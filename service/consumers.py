import json
import pyaudio
import json
from channels.generic.websocket import WebsocketConsumer, AsyncWebsocketConsumer
from asgiref.sync import async_to_sync

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.room_group_name = 'test'
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            #채널 이름은 자동적으로 생성됨
            self.channel_name
        )
        self.accept()
        self.send(text_data=json.dumps({
            'type' : 'connection',
            'message' : 'connected'
        }))


    def receive(self, text_data=None, bytes_data=None):
        bytes_data_json = json.loads(bytes_data)
        message = bytes_data_json['message']

        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type' : 'chat_message',
                'message': message
            }
        )
    
    def chat_message(self, event):
        message = event['message']

        self.send(text_data=json.dumps({
            'type' : 'chat',
            'message' : message

        }))

    def disconnect(self, code):
        return super().disconnect(code)

FRAMES_PER_BUFFER = 3200
FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 16000
p = pyaudio.PyAudio()

# starts recording
stream = p.open(
   format=FORMAT,
   channels=CHANNELS,
   rate=RATE,
   input=True,
   frames_per_buffer=FRAMES_PER_BUFFER
)

class VideoConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_group_name = 'test'
        #print(self.room_name)
        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        # print(1)
        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'video_message',
                'message': text_data,
            }
        )

    # Receive message from room group
    async def video_message(self, event):
        # print(1)
        message = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))

    def 메인로직():
        # 포즈 분석, 표정 분석에 대한 로직을 처리 후 메시지 전송
        pass