# routing.py
from django.urls import path
from . import consumers

websocket_urlpatterns = [
    # Ajuste para usar PriceConsumer, que é o nome da classe no consumers.py
    path("ws/some_path/", consumers.PriceConsumer.as_asgi()),
]
