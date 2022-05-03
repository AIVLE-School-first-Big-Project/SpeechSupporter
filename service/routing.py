from django.urls import re_path
from .consumers import VideoConsumer, ChatConsumer

websocket_urlpatterns = [
    re_path(r'ws/socket-server/', ChatConsumer.as_asgi()),
    re_path(r'ws/cam/', VideoConsumer.as_asgi()),
]