from asyncio.windows_events import NULL
import json
import pyaudio
import json
from channels.generic.websocket import WebsocketConsumer, AsyncWebsocketConsumer
from asgiref.sync import async_to_sync
import cv2
import io
import mediapipe as mp
import base64
import tensorflow
from PIL import Image
from io import BytesIO
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

def stringToRGB(base64_string):
    imgdata = base64.b64decode(base64_string)
    dataBytesIO = io.BytesIO(imgdata)
    image = Image.open(dataBytesIO)
    return cv2.cvtColor(np.array(image), cv2.COLOR_BGR2RGB)

def service(message):
    message = message.split(',')[1]
    # img = base64.b64decode(message)
    # image = np.array(Image.open(BytesIO(img)))
    image = stringToRGB(message)
    mp_pose = mp.solutions.pose
    # m,n = image.shape[::2]
    # image = np.rollaxis(image,3,1).reshape(m,-1,n)
    model = tensorflow.keras.models.load_model("service\pose.h5")

    # 데이터프레임 만들기 위한 준비
    column=["nose_x", "nose_y", "left_eye_inner_x", "left_eye_inner_y", "left_eye_x", "left_eye_y", "left_eye_outer_x", "left_eye_outer_y",
            "right_eye_inner_x", "right_eye_inner_y", "right_eye_x", "right_eye_y", "right_eye_outer_x", "right_eye_outer_y",
            "left_ear_x", "left_ear_y", "right_ear_x", "right_ear_y", "mouth_left_x", "mouth_left_y", "mouth_right_x", "mouth_right_y",
            "left_shoulder_x", "left_shoulder_y", "right_shoulder_x", "right_shoulder_y", "left_elbow_x", "left_elbow_y", "right_elbow_x", "right_elbow_y",
            "left_wrist_x", "left_wrist_y", "right_wrist_x", "right_wrist_y", "left_pinky_x", "left_pinky_y", "right_pinky_x", "right_pinky_y",
            "left_index_x", "left_index_y", "right_index_x", "right_index_y", "left_thumb_x", "left_thumb_y", "right_thumb_x", "right_thumb_y",
            "left_hip_x", "left_hip_y", "right_hip_x", "right_hip_y", "left_knee_x", "left_knee_y", "right_knee_x", "right_knee_y",
            "left_ankle_x", "left_ankle_y", "right_ankle_x", "right_ankle_y", "left_heel_x", "left_heel_y", "right_heel_x", "right_heel_y",
            "left_foot_index_x", "left_foot_index_y", "right_foot_index_x", "right_foot_index_y"]

    # For webcam input:
    # cap = cv2.VideoCapture(0)
    with mp_pose.Pose(
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5) as pose:
        
    # while cap.isOpened():
        # success, image = cap.read()
        # if not success:
        #     print("Ignoring empty camera frame.")
        #     # If loading a video, use 'break' instead of 'continue'.
        #     continue

        # To improve performance, optionally mark the image as not writeable to
        # pass by reference.
            # image.flags.writeable = False
            # image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            results = pose.process(image)

            # Draw the pose annotation on the image.
            # image.flags.writeable = True
            # image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
            
            list_xy = []
            if results.pose_landmarks == None:
                return

            for i in range(len(results.pose_landmarks.landmark)):
                list_xy.append(results.pose_landmarks.landmark[i].x)
                list_xy.append(results.pose_landmarks.landmark[i].y)

            df3 = pd.DataFrame(np.array([list_xy]), columns=column)
            
            if model.predict(df3).argmax(axis=1)[0] == 0:
                return {'message' : 'head'}
            elif model.predict(df3).argmax(axis=1)[0] == 1:
                return {'message' :'leg'}
            else:
                return {'message' :'sit'}

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
                    'message': text_data_json['message'],
                }
            )

    # Receive message from room group
    async def video_message(self, event):
        message = event['message']
        f = open("새파일.txt", 'w')
        f.write(message)
        f.close()
        message = service(message)
        print(message)
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))