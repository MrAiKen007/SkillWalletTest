from django.urls import path
from .views import (
    RegistrationPageView,
    LoginPageView,
    RegistrationAPIView,
    LoginAPIView
)

urlpatterns = [
    # Rotas para exibir as páginas HTML
    path('register/', RegistrationPageView.as_view(), name='registration_page'),
    path('login/', LoginPageView.as_view(), name='login_page'),
    
    # Endpoints da API (usados pelo fetch nos templates)
    path('api/contas/register/', RegistrationAPIView.as_view(), name='register_api'),
    path('api/contas/login/', LoginAPIView.as_view(), name='login_api'),
]
