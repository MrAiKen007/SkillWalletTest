from rest_framework import serializers
from .models import (
    InvestmentAccount,
    TokenizationRequest,
    Token,
    TokenTransaction,
    Order
)

class InvestmentAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvestmentAccount
        fields = ['id', 'user', 'balance']

class TokenizationRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = TokenizationRequest
        fields = '__all__'

class TokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Token
        fields = '__all__'

class TokenTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TokenTransaction
        fields = '__all__'


class TokenTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TokenTransaction
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'
