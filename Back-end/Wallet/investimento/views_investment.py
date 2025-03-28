import io
import base64
import matplotlib.pyplot as plt
import mplfinance as mpf
import pandas as pd
from decimal import Decimal
from django.utils import timezone
from django.shortcuts import get_object_or_404
from django.views.generic import TemplateView, DetailView
from django.contrib.auth import get_user_model, login, logout
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from contas.models import Wallet
from .models import InvestmentAccount, Token, TokenTransaction, Order, TokenizationRequest
from .serializers import (
    InvestmentAccountSerializer, 
    TokenSerializer, 
    TokenTransactionSerializer,
    TokenizationRequestSerializer
)

User = get_user_model()

# ==============================
# DASHBOARD DE INVESTIMENTO
# ==============================
class InvestmentDashboardView(TemplateView):
    template_name = "investment_dashboard.html"


# ==============================
# DEPÓSITO / SAQUE
# ==============================
class InvestmentDepositAPIView(APIView):
    """
    Endpoint para depósito na conta de investimento.
    """
    def post(self, request):
        user = request.user
        try:
            amount = Decimal(str(request.data.get("amount", "0")))
        except Exception:
            return Response({"error": "Valor inválido."}, status=status.HTTP_400_BAD_REQUEST)
        if amount <= 0:
            return Response({"error": "O valor deve ser maior que zero."}, status=status.HTTP_400_BAD_REQUEST)
        normal_wallet = get_object_or_404(Wallet, user=user)
        investment_account, _ = InvestmentAccount.objects.get_or_create(user=user)
        if normal_wallet.balance < amount:
            return Response({"error": "Saldo insuficiente na wallet normal."}, status=status.HTTP_400_BAD_REQUEST)
        normal_wallet.balance -= amount
        investment_account.balance += amount
        normal_wallet.save()
        investment_account.save()
        return Response({
            "message": "Depósito realizado com sucesso!",
            "investment_balance": str(investment_account.balance),
            "normal_wallet_balance": str(normal_wallet.balance)
        }, status=status.HTTP_200_OK)


class InvestmentWithdrawAPIView(APIView):
    """
    Endpoint para saque (retirada) da conta de investimento para a wallet normal.
    """
    def post(self, request):
        user = request.user
        try:
            amount = Decimal(str(request.data.get("amount", "0")))
        except Exception:
            return Response({"error": "Valor inválido."}, status=status.HTTP_400_BAD_REQUEST)
        if amount <= 0:
            return Response({"error": "O valor deve ser maior que zero."}, status=status.HTTP_400_BAD_REQUEST)
        investment_account = get_object_or_404(InvestmentAccount, user=user)
        normal_wallet = get_object_or_404(Wallet, user=user)
        if investment_account.balance < amount:
            return Response({"error": "Saldo insuficiente na conta de investimento."}, status=status.HTTP_400_BAD_REQUEST)
        investment_account.balance -= amount
        normal_wallet.balance += amount
        investment_account.save()
        normal_wallet.save()
        return Response({
            "message": "Saque realizado com sucesso!",
            "investment_balance": str(investment_account.balance),
            "normal_wallet_balance": str(normal_wallet.balance)
        }, status=status.HTTP_200_OK)


# ==============================
# TOKENS
# ==============================
class TokensListAPIView(APIView):
    """
    Retorna a lista de tokens disponíveis.
    """
    def get(self, request):
        tokens = Token.objects.all()
        serializer = TokenSerializer(tokens, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class TokenDetailAPIView(APIView):
    """
    Retorna os detalhes de um token específico.
    """
    def get(self, request, token_id):
        token = get_object_or_404(Token, id=token_id)
        serializer = TokenSerializer(token)
        return Response(serializer.data, status=status.HTTP_200_OK)

class TokenTradeAPIView(APIView):
    """
    Executa uma ordem de trade (compra ou venda) e ajusta o preço do token conforme o impacto.
    """
    def post(self, request, token_id):
        trade_type = request.data.get("type")
        try:
            quantity = int(request.data.get("quantity", 0))
        except (ValueError, TypeError):
            return Response({"error": "Quantidade inválida."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            trade_price = Decimal(str(request.data.get("price", "0")))
        except Exception:
            return Response({"error": "Preço inválido."}, status=status.HTTP_400_BAD_REQUEST)
        if quantity <= 0 or trade_price <= 0:
            return Response({"error": "Quantidade e preço devem ser maiores que zero."}, status=status.HTTP_400_BAD_REQUEST)

        token = get_object_or_404(Token, id=token_id)
        user = request.user
        investment_account = get_object_or_404(InvestmentAccount, user=user)
        impact_factor = Decimal("0.05")

        # Cria a ordem com status "open"
        order = Order.objects.create(
            token=token,
            user=user,
            order_type=trade_type,
            quantity=quantity,
            price=trade_price,
            status="open"
        )

        if trade_type == "buy":
            total_cost = trade_price * quantity
            if investment_account.balance < total_cost:
                order.status = "cancelled"
                order.save()
                return Response({"error": "Saldo insuficiente."}, status=status.HTTP_400_BAD_REQUEST)
            investment_account.balance -= total_cost
            investment_account.save()
            TokenTransaction.objects.create(
                token=token,
                user=user,
                quantity=quantity,
                price_per_unit=trade_price,
                is_buy=True
            )
            if token.supply == 0:
                return Response({"error": "Supply do token é zero."}, status=status.HTTP_400_BAD_REQUEST)
            delta = impact_factor * (Decimal(quantity) / token.supply)
            new_price = token.price * (Decimal("1") + delta)
            token.price = new_price.quantize(Decimal("0.01"))
            token.save()
            order.status = "executed"
            order.save()
            return Response({
                "message": "Ordem de compra executada com sucesso!",
                "order_id": order.id,
                "new_price": str(token.price)
            }, status=status.HTTP_200_OK)

        elif trade_type == "sell":
            total_gain = trade_price * quantity
            investment_account.balance += total_gain
            investment_account.save()
            TokenTransaction.objects.create(
                token=token,
                user=user,
                quantity=quantity,
                price_per_unit=trade_price,
                is_buy=False
            )
            delta = impact_factor * (Decimal(quantity) / token.supply)
            new_price = token.price * (Decimal("1") - delta)
            token.price = new_price.quantize(Decimal("0.01"))
            token.save()
            order.status = "executed"
            order.save()
            return Response({
                "message": "Ordem de venda executada com sucesso!",
                "order_id": order.id,
                "new_price": str(token.price)
            }, status=status.HTTP_200_OK)
        else:
            order.status = "cancelled"
            order.save()
            return Response({"error": "Tipo de operação inválido. Use 'buy' ou 'sell'."}, status=status.HTTP_400_BAD_REQUEST)

# ==============================
# GRÁFICOS, LIVRO DE ORDENS, HISTÓRICO
# ==============================
class TokenChartAPIView(APIView):
    """
    Retorna dados do gráfico de preços (linha) extraídos do histórico de transações.
    """
    def get(self, request, token_id):
        transactions = TokenTransaction.objects.filter(token_id=token_id).order_by("created_at")
        timestamps = [t.created_at.strftime("%H:%M") for t in transactions]
        prices = [float(t.price_per_unit) for t in transactions]
        return Response({"timestamps": timestamps, "prices": prices}, status=status.HTTP_200_OK)


class TokenChartImageAPIView(APIView):
    """
    Gera uma imagem do gráfico de preços (linha) usando Matplotlib e retorna a imagem codificada em base64.
    """
    def get(self, request, token_id):
        transactions = TokenTransaction.objects.filter(token_id=token_id).order_by("created_at")
        timestamps = [t.created_at.strftime("%H:%M") for t in transactions]
        prices = [float(t.price_per_unit) for t in transactions]
        if not timestamps or not prices:
            return Response({"error": "Sem dados para gerar o gráfico."}, status=status.HTTP_400_BAD_REQUEST)
        plt.figure(figsize=(8, 4))
        plt.plot(timestamps, prices, marker="o", linestyle="-", color="blue")
        plt.title("Histórico de Preços")
        plt.xlabel("Horário")
        plt.ylabel("Preço (KZ)")
        plt.grid(True)
        buf = io.BytesIO()
        plt.savefig(buf, format="png")
        buf.seek(0)
        image_base64 = base64.b64encode(buf.getvalue()).decode("utf-8")
        plt.close()
        return Response({"chart_image": image_base64}, status=status.HTTP_200_OK)


class TokenCandlestickChartAPIView(APIView):
    """
    Gera um gráfico de velas (candlestick) a partir do histórico de transações de um token.
    Agrupa os dados por data para calcular os valores OHLC e retorna a imagem em base64.
    """
    def get(self, request, token_id):
        transactions = TokenTransaction.objects.filter(token_id=token_id).order_by("created_at")
        if not transactions.exists():
            return Response({"error": "Sem dados para gerar o gráfico."}, status=status.HTTP_400_BAD_REQUEST)
        
        data = []
        for t in transactions:
            data.append({
                "Date": t.created_at.date(),
                "Price": float(t.price_per_unit)
            })
        
        df = pd.DataFrame(data)
        if df.empty:
            return Response({"error": "Sem dados para gerar o gráfico."}, status=status.HTTP_400_BAD_REQUEST)
        
        ohlc = df.groupby("Date").agg({
            "Price": ["first", "max", "min", "last"]
        })
        ohlc.columns = ["Open", "High", "Low", "Close"]
        ohlc.index = pd.to_datetime(ohlc.index)
        
        if ohlc.empty:
            return Response({"error": "Dados insuficientes para gerar o gráfico."}, status=status.HTTP_400_BAD_REQUEST)
        
        buf = io.BytesIO()
        mpf.plot(ohlc, type="candle", style="charles", volume=False, savefig=buf)
        buf.seek(0)
        image_base64 = base64.b64encode(buf.getvalue()).decode("utf-8")
        return Response({"chart_image": image_base64}, status=status.HTTP_200_OK)


class TokenOrderBookAPIView(APIView):
    """
    Retorna o livro de ordens (compra e venda) para um token.
    """
    def get(self, request, token_id):
        token = get_object_or_404(Token, id=token_id)
        buy_orders = token.orders.filter(order_type="buy", status="open")
        sell_orders = token.orders.filter(order_type="sell", status="open")
        buy_data = [{"quantity": str(order.quantity), "price": str(order.price)} for order in buy_orders]
        sell_data = [{"quantity": str(order.quantity), "price": str(order.price)} for order in sell_orders]
        data = {"buy": buy_data, "sell": sell_data}
        return Response(data, status=status.HTTP_200_OK)


class TokenHistoryAPIView(APIView):
    """
    Retorna o histórico de transações para um token.
    """
    def get(self, request, token_id):
        transactions = TokenTransaction.objects.filter(token_id=token_id).order_by("-created_at")
        data = []
        for t in transactions:
            total = float(t.price_per_unit) * float(t.quantity)
            data.append({
                "created_at": t.created_at.isoformat() if t.created_at else "",
                "is_buy": t.is_buy,
                "quantity": str(t.quantity),
                "price_per_unit": str(t.price_per_unit),
                "total": f"{total:.2f}"
            })
        return Response(data, status=status.HTTP_200_OK)


# ==============================
# SALDO DE INVESTIMENTO
# ==============================
class InvestmentBalanceAPIView(APIView):
    """
    Retorna o saldo da conta de investimento do usuário autenticado.
    """
    def get(self, request):
        user = request.user
        if not user.is_authenticated:
            return Response({"error": "Não autenticado"}, status=401)
        try:
            investment_account = InvestmentAccount.objects.get(user=user)
            return Response({"balance": str(investment_account.balance)}, status=200)
        except InvestmentAccount.DoesNotExist:
            return Response({"balance": "0"}, status=200)


# ==============================
# COMPRA / VENDA SIMPLES (REFERÊNCIA)
# ==============================
class TokenBuyAPIView(APIView):
    def post(self, request):
        user = request.user
        token_id = request.data.get("token_id")
        try:
            quantity = int(request.data.get("quantity", 0))
        except (ValueError, TypeError):
            return Response({"error": "Quantidade inválida."}, status=status.HTTP_400_BAD_REQUEST)
        if quantity <= 0:
            return Response({"error": "Quantidade deve ser maior que zero."}, status=status.HTTP_400_BAD_REQUEST)
        token = get_object_or_404(Token, id=token_id)
        price_per_unit = token.price
        total_cost = price_per_unit * quantity
        investment_account = get_object_or_404(InvestmentAccount, user=user)
        if investment_account.balance < total_cost:
            return Response({"error": "Saldo insuficiente."}, status=status.HTTP_400_BAD_REQUEST)
        investment_account.balance -= total_cost
        investment_account.save()
        transaction = TokenTransaction.objects.create(
            token=token,
            user=user,
            quantity=quantity,
            price_per_unit=price_per_unit,
            is_buy=True
        )
        return Response({
            "message": "Compra realizada com sucesso!",
            "transaction_id": transaction.id,
            "new_balance": str(investment_account.balance)
        }, status=status.HTTP_200_OK)


class TokenSellAPIView(APIView):
    def post(self, request):
        user = request.user
        token_id = request.data.get("token_id")
        try:
            quantity = int(request.data.get("quantity", 0))
        except (ValueError, TypeError):
            return Response({"error": "Quantidade inválida."}, status=status.HTTP_400_BAD_REQUEST)
        if quantity <= 0:
            return Response({"error": "Quantidade deve ser maior que zero."}, status=status.HTTP_400_BAD_REQUEST)
        token = get_object_or_404(Token, id=token_id)
        price_per_unit = token.price
        total_gain = price_per_unit * quantity
        investment_account = get_object_or_404(InvestmentAccount, user=user)
        investment_account.balance += total_gain
        investment_account.save()
        transaction = TokenTransaction.objects.create(
            token=token,
            user=user,
            quantity=quantity,
            price_per_unit=price_per_unit,
            is_buy=False
        )
        return Response({
            "message": "Venda realizada com sucesso!",
            "transaction_id": transaction.id,
            "new_balance": str(investment_account.balance)
        }, status=status.HTTP_200_OK)