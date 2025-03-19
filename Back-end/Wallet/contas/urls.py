from django.urls import path
from .views import (
    RegistrationAPIView,
    LoginAPIView,
    WalletBalanceAPIView,
    SendTokenAPIView,
    ReceiveTokenAPIView,
    DepositTokenAPIView 
)

urlpatterns = [
    path('api/contas/register/', RegistrationAPIView.as_view(), name='register_api'),
    path('api/contas/login/', LoginAPIView.as_view(), name='login_api'),
    path('api/wallet/balance/', WalletBalanceAPIView.as_view(), name='wallet_balance'),
    path('api/wallet/send/', SendTokenAPIView.as_view(), name='send_token'),
    path('api/wallet/receive/', ReceiveTokenAPIView.as_view(), name='receive_token'),
    path('api/wallet/deposit/', DepositTokenAPIView.as_view(), name='deposit_token'),
]


