import os
import django
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Wallet.settings')
django.setup()

handler = get_asgi_application()
