from django.urls import path
from .views import (
    WalletPageView,
    RegistrationPageView,
    LoginPageView,
    RegistrationAPIView,
    LoginAPIView,
    WalletBalanceAPIView,
    SendTokenAPIView,
    ReceiveTokenAPIView,
    DepositTokenAPIView  # <-- Importe aqui
)

urlpatterns = [
    path('wallet/', WalletPageView.as_view(), name='wallet_page'),
    # Rotas de autenticação
    path('register/', RegistrationPageView.as_view(), name='registration_page'),
    path('login/', LoginPageView.as_view(), name='login_page'),
    path('api/contas/register/', RegistrationAPIView.as_view(), name='register_api'),
    path('api/contas/login/', LoginAPIView.as_view(), name='login_api'),

    # Rotas da Wallet
    path('api/wallet/balance/', WalletBalanceAPIView.as_view(), name='wallet_balance'),
    path('api/wallet/send/', SendTokenAPIView.as_view(), name='send_token'),
    path('api/wallet/receive/', ReceiveTokenAPIView.as_view(), name='receive_token'),
    path('api/wallet/deposit/', DepositTokenAPIView.as_view(), name='deposit_token'),  # <-- Rota de depósito
]


