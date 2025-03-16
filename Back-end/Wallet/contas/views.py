from django.views.generic import TemplateView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegistrationSerializer
from django.contrib.auth import login
from .serializers import RegistrationSerializer, LoginSerializer

# View que exibe a página HTML
class RegistrationPageView(TemplateView):
    template_name = "registration.html"  # o Django procurará "registration.html" em sua pasta de templates

# View que processa a API de cadastro (POST)
class RegistrationAPIView(APIView):
    def post(self, request):
        serializer = RegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {
                    'message': 'Usuário registrado com sucesso!',
                    'seed_key': serializer.data['seed_key']  # Exibido apenas uma vez
                },
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Exemplo de Login, se você quiser algo semelhante:
class LoginPageView(TemplateView):
    template_name = "login.html"

class LoginAPIView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            login(request, user)
            return Response({'message': 'Login realizado com sucesso!'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
