from django.conf import settings
import cv2
import os
import urllib.request
face_detection_videocam = cv2.CascadeClassifier(os.path.join(
			settings.BASE_DIR,'opencv_haarcascade_data/haarcascade_frontalface_default.xml'))

result_ = []
class LiveWebCam(object):
    def __init__(self):
        self.url = cv2.VideoCapture(0)

    def __del__(self):
        cv2.destroyAllWindows()
    
    def result(self):
        pass

    def get_frame(self):
        success,image = self.url.read()
        frame_flip = cv2.flip(image,1)
        resize = cv2.resize(frame_flip, (640, 480), interpolation = cv2.INTER_LINEAR) 
        ret, jpeg = cv2.imencode('.jpg', resize)
        return jpeg.tobytes()

class VideoCamera(object):
    global result_
    def __init__(self): 
        self.video=cv2.VideoCapture(0)

    def __del__(self):
        self.video.release()

    def result(self):
        data = {
            'temp' : 11
        }
        result_.append(data)
        return result_
    
    def get_frame(self):
        success, image = self.video.read()
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        faces_detected = face_detection_videocam.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=5)
        for(x, y, w, h) in faces_detected:
            cv2.rectangle(image, pt1=(x, y), pt2=(x + w, y + h), color=(255, 0, 0), thickness=2)
        frame_flip = cv2.flip(image,1)
        resize = cv2.resize(frame_flip, (640, 480), interpolation = cv2.INTER_LINEAR) 
        ret, jpeg = cv2.imencode('.jpg', resize)
        return jpeg.tobytes()