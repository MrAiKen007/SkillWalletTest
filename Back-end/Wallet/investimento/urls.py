from django.urls import path
from .views_investment import (
    TokenChartImageAPIView,
    InvestmentDashboardView,
    InvestmentDepositAPIView,
    InvestmentWithdrawAPIView,
    TokensListAPIView,
    TokenDetailAPIView,
    TokenBuyAPIView,
    TokenSellAPIView,
    InvestmentBalanceAPIView,
    TokenTradeAPIView,
    TokenChartAPIView,
    TokenOrderBookAPIView,
    TokenHistoryAPIView,
)
from .views_tokenization import (
    TokenDetailView,
    TokenizationRequestsView,
    TokenizationConfigureView,
    TokenizationConfigurationAPIView,
    TokenizationSimulationAPIView,
    TokenizationRequestsAPIView,
    ApproveTokenizationAPIView,
    RejectTokenizationAPIView,
    TokenManagementView,
    TokenUpdateAPIView,
)

urlpatterns = [
    # Investimento
    path('api/tokens/<int:token_id>/chart-image/', TokenChartImageAPIView.as_view(), name='token_chart_image'),
    path('api/tokens/<int:token_id>/orderbook/', TokenOrderBookAPIView.as_view(), name='token_orderbook'),
    path('investment/', InvestmentDashboardView.as_view(), name='investment_dashboard'),
    path('api/investment/deposit/', InvestmentDepositAPIView.as_view(), name='investment_deposit'),
    path('api/investment/withdraw/', InvestmentWithdrawAPIView.as_view(), name='investment_withdraw'),
    path('api/investment/balance/', InvestmentBalanceAPIView.as_view(), name='investment_balance'),
    path('api/tokens/list/', TokensListAPIView.as_view(), name='tokens_list'),
    path('api/tokens/<int:token_id>/', TokenDetailAPIView.as_view(), name='token_detail'),
    path('api/tokens/buy/', TokenBuyAPIView.as_view(), name='token_buy'),
    path('api/tokens/sell/', TokenSellAPIView.as_view(), name='token_sell'),
    path('api/tokens/<int:token_id>/trade/', TokenTradeAPIView.as_view(), name='token_trade'),
    path('api/tokens/<int:token_id>/chart/', TokenChartAPIView.as_view(), name='token_chart'),
    path('api/tokens/<int:token_id>/orderbook/', TokenOrderBookAPIView.as_view(), name='token_orderbook'),
    path('api/tokens/<int:token_id>/history/', TokenHistoryAPIView.as_view(), name='token_history'),

    # Tokenização
    path('investment/token/<int:pk>/', TokenDetailView.as_view(), name='token_detail'),
    path('token/<int:token_id>/manage/', TokenManagementView.as_view(), name='token_management'),
    path('api/token/<int:token_id>/update/', TokenUpdateAPIView.as_view(), name='token_update'),
    path('tokenization/configure/', TokenizationConfigureView.as_view(), name='tokenization_configure_view'),
    path('api/tokenization/configure/', TokenizationConfigurationAPIView.as_view(), name='tokenization_configure'),
    path('api/tokenization/simulate/', TokenizationSimulationAPIView.as_view(), name='tokenization_simulate'),
    path('api/tokenization/requests/', TokenizationRequestsAPIView.as_view(), name='tokenization_requests'),
    path('api/tokenization/approve/', ApproveTokenizationAPIView.as_view(), name='tokenization_approve'),
    path('api/tokenization/reject/', RejectTokenizationAPIView.as_view(), name='tokenization_reject'),
]
