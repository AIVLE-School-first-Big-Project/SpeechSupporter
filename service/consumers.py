from email.errors import MessageError
import json
# import pyaudio
import json
from channels.generic.websocket import WebsocketConsumer, AsyncWebsocketConsumer
from asgiref.sync import async_to_sync
import joblib
import tensorflow
import numpy as np
import pandas as pd

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
# FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 16000
# p = pyaudio.PyAudio()

# starts recording
# stream = p.open(
#    format=FORMAT,
#    channels=CHANNELS,
#    rate=RATE,
#    input=True,
#    frames_per_buffer=FRAMES_PER_BUFFER
# )

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
        text_data_json = json.loads(text_data)
        eventType = text_data_json['type']
        if eventType == 'video_message':
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'video_message',
                    'pose_message': text_data_json['pose_message'],
                    # 'face_message': text_data_json['face_message'],
                }
            )

    global result_pose_list_head
    global result_pose_list_leg
    # global result_face_list_nothing
    # global result_face_list_surprise
    result_pose_list_head = []
    result_pose_list_leg = []
    # result_face_list_nothing = []
    # result_face_list_surprise = []
    
    # Receive message from room group
    async def video_message(self, event):
        # print(1)
        pose_message = event['pose_message']
        # face_message = event['face_message']
        
        if len(pose_message) == 0 :
            return NULL
        
        # # 받은 데이터 확인
        print(pose_message["keypoints"][0])
        
        model_pose = tensorflow.keras.models.load_model("./service/pose1.h5")
        # model_face = tensorflow.keras.models.load_model("")
        
        # 데이터프레임 만들기 위한 준비
        column_pose=[i for i in range(99)]
        # column_face=[j for j in range(478*3)]
        df1 = pd.DataFrame(columns=column_pose)
        # df2 = pd.DataFrame(columns=column_face)
        
        list_xy_pose = []
        # list_xy_face = []
        
        for i in range(len(pose_message["keypoints"])):
            list_xy_pose.append(pose_message["keypoints"][i]['x'])
            list_xy_pose.append(pose_message["keypoints"][i]['y'])
            list_xy_pose.append(pose_message["keypoints"][i]['z'])
        
        # for j in range(len(face_message["keypoints"])):
        #     list_xy_face.append(face_message["keypoints"][j]['x'])
        #     list_xy_face.append(face_message["keypoints"][j]['y'])
        #     list_xy_face.append(face_message["keypoints"][j]['z'])

        #list_xy를 데이터프레임으로 변환
        df3 = pd.DataFrame(np.array([list_xy_pose]), columns=column_pose)
        # df4 = pd.DataFrame(np.array([list_xy_face]), columns=column_face)
        df1 = pd.concat([df1, df3], axis=0, ignore_index=True)
        # df2 = pd.concat([df2, df4], axis=0, ignore_index=True)
        
        
        
        if model_pose.predict(df3).argmax(axis=1)[0] == 0:    
            result_pose_list_head.append('head')
            result_pose_list_leg.clear()
        elif model_pose.predict(df3).argmax(axis=1)[0] == 1:
            result_pose_list_leg.append('leg')
            result_pose_list_head.clear()
        else:
            result_pose_list_head.clear()
            result_pose_list_leg.clear()
        
        # if model_face.predict(df4).argmax(axis=1)[0] == 0:    
        #     result_face_list_nothing.append('angry')
        #     result_face_list_surprise.clear()
        # elif model_face.predict(df4).argmax(axis=1)[0] == 2:
        #     result_face_list_surprise.append('surprise')
        #     result_face_list_nothing.clear()
        # else:
        #     result_face_list_nothing.clear()
        #     result_face_list_surprise.clear()
        
        if len(result_pose_list_head) > 1:
            result_pose_list_head.clear()
            await self.send(text_data=json.dumps({
                'pose_message': "Don't touch your head!!"
            }))
        elif len(result_pose_list_leg) > 10:
            result_pose_list_leg.clear()
            await self.send(text_data=json.dumps({
                'pose_message': "Don't cross your legs!!"
            }))

        # if len(result_face_list_nothing) > 10:
        #     result_face_list_nothing.clear()
        #     await self.send(text_data=json.dumps({
        #         'face_message': "Smile please~!"
        #     }))
        # elif len(result_face_list_surprise) > 10:
        #     result_face_list_surprise.clear()
        #     await self.send(text_data=json.dumps({
        #         'face_message': "Calm down!"
        #     }))
