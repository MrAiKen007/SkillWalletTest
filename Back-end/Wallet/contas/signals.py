from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import CustomUser, Wallet

@receiver(post_save, sender=CustomUser)
def create_wallet_for_user(sender, instance, created, **kwargs):
    if created:  # Só cria a Wallet se o usuário for novo
        Wallet.objects.get_or_create(user=instance)
