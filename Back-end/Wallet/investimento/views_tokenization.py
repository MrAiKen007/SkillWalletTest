# views_tokenization.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from decimal import Decimal
from django.shortcuts import get_object_or_404
from django.views.generic import DetailView, TemplateView
from .models import TokenizationRequest, Token
from .serializers import TokenizationRequestSerializer, TokenSerializer

# View para exibir detalhes de um token via template
class TokenDetailView(DetailView):
    model = Token
    template_name = "token_detail.html"
    context_object_name = "token"

# View para exibir a página de pedidos de tokenização (para análise interna)
class TokenizationRequestsView(TemplateView):
    template_name = "tokenization_requests.html"

# View para exibir a tela de configuração de tokenização (para empresas)
class TokenizationConfigureView(TemplateView):
    template_name = "tokenization_configure.html"

# API para enviar um pedido de tokenização
class TokenizationConfigurationAPIView(APIView):
    def post(self, request):
        user = request.user
        data = request.data.copy()
        data['user'] = user.id
        serializer = TokenizationRequestSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Pedido de tokenização enviado. Aguarde análise."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# API para simulação de tokenização (ex.: responder perguntas)
class TokenizationSimulationAPIView(APIView):
    def post(self, request):
        answers = request.data.get("answers", {})
        return Response({"message": "Perguntas respondidas. Aguarde análise."}, status=status.HTTP_200_OK)

# API para listar os pedidos de tokenização pendentes
class TokenizationRequestsAPIView(APIView):
    def get(self, request):
        requests_qs = TokenizationRequest.objects.filter(is_approved=False)
        serializer = TokenizationRequestSerializer(requests_qs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

# API para aprovar um pedido de tokenização e criar o Token correspondente
class ApproveTokenizationAPIView(APIView):
    def post(self, request):
        request_id = request.data.get("request_id")
        token_request = get_object_or_404(TokenizationRequest, id=request_id)
        token_request.is_approved = True
        token_request.save()
        Token.objects.create(
            token_request=token_request,
            supply=token_request.token_quantity,
            price=token_request.token_price
        )
        return Response({"message": "Tokenização aprovada e token criado!"}, status=status.HTTP_200_OK)

# API para rejeitar um pedido de tokenização
class RejectTokenizationAPIView(APIView):
    def post(self, request):
        request_id = request.data.get("request_id")
        token_request = get_object_or_404(TokenizationRequest, id=request_id)
        token_request.is_approved = False
        token_request.save()
        return Response({"message": "Tokenização rejeitada."}, status=status.HTTP_200_OK)

# View para Gerenciamento do Token (para o emissor)
class TokenManagementView(TemplateView):
    template_name = "token_management.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        token_id = self.kwargs.get("token_id")
        token = get_object_or_404(Token, id=token_id)
        context["token"] = token
        return context

# API para atualizar os dados do token (ex.: alterar preço, supply, etc.)
class TokenUpdateAPIView(APIView):
    def post(self, request, token_id):
        token = get_object_or_404(Token, id=token_id)
        serializer = TokenSerializer(token, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Token atualizado com sucesso!", "token": serializer.data}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
