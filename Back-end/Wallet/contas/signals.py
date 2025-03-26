from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import CustomUser, Wallet

from django.conf import settings

@receiver(post_save, sender=CustomUser)
def create_wallet_for_user(sender, instance, created, **kwargs):
    if created:
        Wallet.objects.get_or_create(user=instance)


@receiver(post_save, sender=CustomUser)
def create_normal_wallet(sender, instance, created, **kwargs):
    if created:
        Wallet.objects.get_or_create(user=instance)




