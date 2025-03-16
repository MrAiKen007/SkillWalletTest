from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings

class CustomUser(AbstractUser):
    phone = models.CharField(max_length=20, blank=True, null=True)
    encrypted_seed_key = models.CharField(max_length=512, blank=True, null=True)


class Wallet(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    balance_kz = models.DecimalField(default=0, max_digits=15, decimal_places=2)
    token_kz = models.DecimalField(default=0, max_digits=15, decimal_places=2)

    def save(self, *args, **kwargs):
        # Sempre atualiza token_kz para ser igual a balance_kz
        self.token_kz = self.balance_kz
        super().save(*args, **kwargs)
        
