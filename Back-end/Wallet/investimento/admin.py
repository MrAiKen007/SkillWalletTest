from django.contrib import admin
from .models import InvestmentAccount, TokenizationRequest, Token, TokenTransaction

@admin.register(InvestmentAccount)
class InvestmentAccountAdmin(admin.ModelAdmin):
    list_display = ('user', 'balance')
    search_fields = ('user__username', 'user__email')

@admin.register(TokenizationRequest)
class TokenizationRequestAdmin(admin.ModelAdmin):
    list_display = ('token_name', 'token_symbol', 'valuation', 'percentage', 'token_quantity', 'token_price', 'is_approved', 'created_at')
    list_filter = ('is_approved', 'created_at')
    search_fields = ('token_name', 'token_symbol', 'user__username')

@admin.register(Token)
class TokenAdmin(admin.ModelAdmin):
    list_display = ('token_request', 'supply', 'price', 'listed_at')
    list_filter = ('listed_at',)
    search_fields = ('token_request__token_name',)

@admin.register(TokenTransaction)
class TokenTransactionAdmin(admin.ModelAdmin):
    list_display = ('token', 'user', 'quantity', 'price_per_unit', 'is_buy', 'created_at')
    list_filter = ('is_buy', 'created_at')
    search_fields = ('token__token_request__token_name', 'user__username')
