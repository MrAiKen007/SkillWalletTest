from django.db import models
from django.conf import settings
from decimal import Decimal

class InvestmentAccount(models.Model):
    """
    Representa a 'conta de investimento' do usuário,
    separada da wallet normal.
    """
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    balance = models.DecimalField(max_digits=15, decimal_places=2, default=Decimal("0.00"))

    def __str__(self):
        return f"InvestmentAccount de {self.user.username} - Saldo: {self.balance}"


class TokenizationRequest(models.Model):
    """
    Armazena os dados de tokenização de uma empresa (modo empresa).
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    valuation = models.DecimalField(max_digits=15, decimal_places=2, default=Decimal("0.00"))
    percentage = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal("0.00"))  # ex: 10.00%
    token_quantity = models.PositiveIntegerField(default=0)
    token_price = models.DecimalField(max_digits=15, decimal_places=2, default=Decimal("0.00"))
    token_name = models.CharField(max_length=100)
    token_symbol = models.CharField(max_length=20)
    description = models.TextField(blank=True)
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"TokenRequest {self.token_name} ({self.token_symbol}) by {self.user.username}"


class Token(models.Model):
    """
    Representa um token aprovado para listagem.
    """
    token_request = models.OneToOneField(TokenizationRequest, on_delete=models.CASCADE)
    supply = models.PositiveIntegerField(default=0)
    price = models.DecimalField(max_digits=15, decimal_places=2, default=Decimal("0.00"))
    listed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.token_request.token_name} ({self.token_request.token_symbol})"


class TokenTransaction(models.Model):
    """
    Registra compras e vendas de tokens.
    """
    token = models.ForeignKey(Token, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price_per_unit = models.DecimalField(max_digits=15, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    is_buy = models.BooleanField(default=True)

    def __str__(self):
        return f"{'BUY' if self.is_buy else 'SELL'} {self.quantity} of {self.token}"


class Order(models.Model):
    ORDER_TYPE_CHOICES = [
        ('buy', 'Compra'),
        ('sell', 'Venda'),
    ]
    STATUS_CHOICES = [
        ('open', 'Aberta'),
        ('executed', 'Executada'),
        ('cancelled', 'Cancelada'),
    ]

    token = models.ForeignKey(Token, on_delete=models.CASCADE, related_name='orders')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='orders')
    order_type = models.CharField(max_length=4, choices=ORDER_TYPE_CHOICES)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=15, decimal_places=2, default=Decimal("0.00"))
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')

    def __str__(self):
        return f"{self.get_order_type_display()} de {self.quantity} {self.token.token_request.token_symbol} a {self.price} KZ"
