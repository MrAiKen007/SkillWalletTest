# accounts/utils.py
from django.conf import settings
from cryptography.fernet import Fernet

def encrypt_seed(seed):
    f = Fernet(settings.ENCRYPTION_KEY)
    return f.encrypt(seed.encode()).decode()

def decrypt_seed(encrypted_seed):
    f = Fernet(settings.ENCRYPTION_KEY)
    return f.decrypt(encrypted_seed.encode()).decode()
