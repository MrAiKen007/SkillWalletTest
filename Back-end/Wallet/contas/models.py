from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings
from decimal import Decimal

class CustomUser(AbstractUser):
    encrypted_seed_key = models.CharField(max_length=512, blank=True, null=True)

class Wallet(models.Model):
    """
    Modelo unificado de carteira (wallet) do usuário.
    Armazena o saldo (balance) e o token_kz sincronizado.
    """
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    balance = models.DecimalField(default=Decimal("0.00"), max_digits=15, decimal_places=2)
    token_kz = models.DecimalField(default=Decimal("0.00"), max_digits=15, decimal_places=2)

    def save(self, *args, **kwargs):
        self.token_kz = self.balance
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Wallet de {self.user.username} - Saldo: {self.balance}"
