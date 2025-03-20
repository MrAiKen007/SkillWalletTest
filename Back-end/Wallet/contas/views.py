from django.views.generic import TemplateView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import login, authenticate, get_user_model
from .serializers import RegistrationSerializer, LoginSerializer
from .models import Wallet
from decimal import Decimal
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class RegistrationAPIView(APIView):
    def post(self, request):
        serializer = RegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # Opcional: criar automaticamente a wallet se ainda não existir
            # Wallet.objects.get_or_create(user=user)
            
            # Gerar um token JWT para o novo usuário
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'message': 'Usuário registrado com sucesso!',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email
                },
                'seed_key': serializer.data.get('seed_key', ''),
                'token': str(refresh.access_token)
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# API de Login (POST)

class LoginAPIView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            return Response({
                'message': 'Login realizado com sucesso!',
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'username': user.username
                },
                'seed_key': serializer.validated_data['seed_key'],
                'token': str(refresh.access_token)
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# O restante dos endpoints permanece inalterado.


class WalletBalanceAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            wallet = Wallet.objects.get(user=request.user)
            return Response({
                'balance': str(wallet.balance),
                'token_plc': str(wallet.token_kz)  # Renomeado de token_kz para token_plc
            }, status=status.HTTP_200_OK)
        except Wallet.DoesNotExist:
            return Response({'error': 'Wallet não encontrada.'}, status=status.HTTP_404_NOT_FOUND)

class SendTokenAPIView(APIView):
    def post(self, request):
        if not request.user.is_authenticated:
            return Response({'error': 'Usuário não autenticado.'}, status=status.HTTP_401_UNAUTHORIZED)
        
        receiver_email = request.data.get('receiver_email')
        try:
            amount = Decimal(str(request.data.get('amount', '0')))
        except Exception:
            return Response({'error': 'Valor inválido.'}, status=status.HTTP_400_BAD_REQUEST)

        if amount <= 0:
            return Response({'error': 'O valor deve ser maior que zero.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            sender_wallet = Wallet.objects.get(user=request.user)
        except Wallet.DoesNotExist:
            return Response({'error': 'Wallet do remetente não encontrada.'}, status=status.HTTP_404_NOT_FOUND)

        try:
            receiver = User.objects.get(email=receiver_email)
            receiver_wallet = Wallet.objects.get(user=receiver)
        except User.DoesNotExist:
            return Response({'error': 'Usuário destinatário não encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        except Wallet.DoesNotExist:
            return Response({'error': 'Wallet do destinatário não encontrada.'}, status=status.HTTP_404_NOT_FOUND)

        if sender_wallet.balance < amount:
            return Response({'error': 'Saldo insuficiente.'}, status=status.HTTP_400_BAD_REQUEST)

        sender_wallet.balance -= amount
        receiver_wallet.balance += amount
        sender_wallet.save()
        receiver_wallet.save()

        return Response({'message': 'Transferência realizada com sucesso!'}, status=status.HTTP_200_OK)


class ReceiveTokenAPIView(APIView):
    def post(self, request):
        if not request.user.is_authenticated:
            return Response({'error': 'Usuário não autenticado.'}, status=status.HTTP_401_UNAUTHORIZED)
        
        try:
            amount = Decimal(str(request.data.get('amount', '0')))
        except Exception:
            return Response({'error': 'Valor inválido.'}, status=status.HTTP_400_BAD_REQUEST)
        
        if amount <= 0:
            return Response({'error': 'O valor deve ser maior que zero.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            wallet = Wallet.objects.get(user=request.user)
            wallet.balance += amount
            wallet.save()
            return Response({
                'message': 'Tokens recebidos com sucesso!',
                'new_balance': str(wallet.balance),
                'email': request.user.email
            }, status=status.HTTP_200_OK)
        except Wallet.DoesNotExist:
            return Response({'error': 'Wallet não encontrada.'}, status=status.HTTP_404_NOT_FOUND)


class DepositTokenAPIView(APIView):
    def post(self, request):
        if not request.user.is_authenticated:
            return Response({'error': 'Usuário não autenticado.'}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            amount = Decimal(str(request.data.get('amount', '0')))
        except Exception:
            return Response({'error': 'Valor inválido.'}, status=status.HTTP_400_BAD_REQUEST)

        if amount <= 0:
            return Response({'error': 'O valor deve ser maior que zero.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            wallet = Wallet.objects.get(user=request.user)
            wallet.balance += amount
            wallet.save()
            return Response({
                'message': 'Depósito realizado com sucesso!',
                'new_balance': str(wallet.balance)
            }, status=status.HTTP_200_OK)
        except Wallet.DoesNotExist:
            return Response({'error': 'Wallet não encontrada.'}, status=status.HTTP_404_NOT_FOUND)

