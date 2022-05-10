# from django.conf import settings
# import cv2
# import os
# import mediapipe as mp
# import numpy as np
# import pandas as pd
# import tensorflow

# face_detection_videocam = cv2.CascadeClassifier(os.path.join(
# 			settings.BASE_DIR,'opencv_haarcascade_data/haarcascade_frontalface_default.xml'))

# result_ = []
# class LiveWebCam(object):
#     def __init__(self):
#         self.url = cv2.VideoCapture(0)
        
#     def __del__(self):
#         cv2.destroyAllWindows()
    
#     def result(self):
#         pass

#     def get_frame(self):
#         success,image = self.url.read()
#         frame_flip = cv2.flip(image,1)
#         resize = cv2.resize(frame_flip, (640, 480), interpolation = cv2.INTER_LINEAR) 
#         ret, jpeg = cv2.imencode('.jpg', resize)
#         return jpeg.tobytes()

# class VideoCamera(object):
#     global result_
    
#     def __init__(self): 
#         self.video=cv2.VideoCapture(0, cv2.CAP_DSHOW)
#         self.model = tensorflow.keras.models.load_model("service\pose.h5")
        
#     def __del__(self):
#         self.video.release()

#     def result(self):
#         data = {
#             'temp' : 11
#         }
#         result_.append(data)
#         return result_
    
#     def get_frame(self):
#         print(self)
#         result_list = ["a", "b", "c"]
#         mp_pose = mp.solutions.pose
        
        
#         # 데이터프레임 만들기 위한 준비
#         column=["nose_x", "nose_y", "left_eye_inner_x", "left_eye_inner_y", "left_eye_x", "left_eye_y", "left_eye_outer_x", "left_eye_outer_y",
#                 "right_eye_inner_x", "right_eye_inner_y", "right_eye_x", "right_eye_y", "right_eye_outer_x", "right_eye_outer_y",
#                 "left_ear_x", "left_ear_y", "right_ear_x", "right_ear_y", "mouth_left_x", "mouth_left_y", "mouth_right_x", "mouth_right_y",
#                 "left_shoulder_x", "left_shoulder_y", "right_shoulder_x", "right_shoulder_y", "left_elbow_x", "left_elbow_y", "right_elbow_x", "right_elbow_y",
#                 "left_wrist_x", "left_wrist_y", "right_wrist_x", "right_wrist_y", "left_pinky_x", "left_pinky_y", "right_pinky_x", "right_pinky_y",
#                 "left_index_x", "left_index_y", "right_index_x", "right_index_y", "left_thumb_x", "left_thumb_y", "right_thumb_x", "right_thumb_y",
#                 "left_hip_x", "left_hip_y", "right_hip_x", "right_hip_y", "left_knee_x", "left_knee_y", "right_knee_x", "right_knee_y",
#                 "left_ankle_x", "left_ankle_y", "right_ankle_x", "right_ankle_y", "left_heel_x", "left_heel_y", "right_heel_x", "right_heel_y",
#                 "left_foot_index_x", "left_foot_index_y", "right_foot_index_x", "right_foot_index_y"]

#         # For webcam input:
#         with mp_pose.Pose(
#             min_detection_confidence=0.5,
#             min_tracking_confidence=0.5) as pose:
                
#                 success, image = self.video.read()
#                     # If loading a video, use 'break' instead of 'continue'.
                    
#                 # To improve performance, optionally mark the image as not writeable to
#                 # pass by reference.
#                 image.flags.writeable = False
#                 image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
#                 results = pose.process(image)

#                 # Draw the pose annotation on the image.
#                 image.flags.writeable = True
#                 image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
                    
#                 list_xy = []
                
#                 for i in range(len(results.pose_landmarks.landmark)):
#                     list_xy.append(results.pose_landmarks.landmark[i].x)
#                     list_xy.append(results.pose_landmarks.landmark[i].y)

#                 df3 = pd.DataFrame(np.array([list_xy]), columns=column)
                
#                 # cv2.imshow('MediaPipe Pose', cv2.flip(image, 1))
#                 # if cv2.waitKey(1) == ord('q'):
#                 #     break
                
#                 if self.model.predict(df3).argmax(axis=1)[0] == 0:
#                     return 'head'
#                 elif self.model.predict(df3).argmax(axis=1)[0] == 1:
#                     return 'leg'
#                 else:
#                     return'sit'
      