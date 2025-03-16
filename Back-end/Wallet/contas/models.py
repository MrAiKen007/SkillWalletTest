from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    phone = models.CharField(max_length=20, blank=True, null=True)
    encrypted_seed_key = models.CharField(max_length=512, blank=True, null=True)
