# routing.py
from django.urls import re_path
from .consumers import PriceConsumer

websocket_urlpatterns = [
    re_path(r'ws/price/$', PriceConsumer.as_asgi()),
]
