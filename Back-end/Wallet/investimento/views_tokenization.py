# views_tokenization.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from decimal import Decimal
from django.shortcuts import get_object_or_404
from django.views.generic import DetailView, TemplateView
from .models import TokenizationRequest, Token
from .serializers import TokenizationRequestSerializer, TokenSerializer

class TokenDetailView(DetailView):
    model = Token
    template_name = "token_detail.html"
    context_object_name = "token"

class TokenizationRequestsView(TemplateView):
    template_name = "tokenization_requests.html"

class TokenizationConfigureView(TemplateView):
    template_name = "tokenization_configure.html"


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


class TokenizationSimulationAPIView(APIView):
    def post(self, request):
        answers = request.data.get("answers", {})
        return Response({"message": "Perguntas respondidas. Aguarde análise."}, status=status.HTTP_200_OK)


class TokenizationRequestsAPIView(APIView):
    def get(self, request):
        requests_qs = TokenizationRequest.objects.filter(is_approved=False)
        serializer = TokenizationRequestSerializer(requests_qs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


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

class RejectTokenizationAPIView(APIView):
    def post(self, request):
        request_id = request.data.get("request_id")
        token_request = get_object_or_404(TokenizationRequest, id=request_id)
        token_request.is_approved = False
        token_request.save()
        return Response({"message": "Tokenização rejeitada."}, status=status.HTTP_200_OK)

class TokenManagementView(TemplateView):
    template_name = "token_management.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        token_id = self.kwargs.get("token_id")
        token = get_object_or_404(Token, id=token_id)
        context["token"] = token
        return context

class TokenUpdateAPIView(APIView):
    def post(self, request, token_id):
        token = get_object_or_404(Token, id=token_id)
        serializer = TokenSerializer(token, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Token atualizado com sucesso!", "token": serializer.data}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
