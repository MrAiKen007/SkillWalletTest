# consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer

class PriceConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Você pode usar um grupo para enviar atualizações para todos os clientes
        self.group_name = "preco_atual"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        # Caso queira tratar mensagens do cliente (não obrigatório se só for enviar updates)
        data = json.loads(text_data)
        # Processar dados se necessário

    async def send_price_update(self, event):
        # Envia a mensagem para o WebSocket
        price_data = event["price_data"]
        await self.send(text_data=json.dumps({
            "price_data": price_data
        }))
