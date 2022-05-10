import json
from django.shortcuts import render
from django.http.response import StreamingHttpResponse
from .camera import VideoCamera, LiveWebCam

def lobby(request):
    return render(request, 'service/streamer.html')

def client(request):
    return render(request, 'service/client.html')

def index(request):
    return render(request, 'service/stream.html')

def gen(camera):
    while True:
        #프레임(초당) 로직 추가. 과부하 방자
        result = camera.get_frame()
        result = json.dumps(result)
        yield result
        

def video_feed(request):
    #카메라 종료 요청 받기.
    # if request.method == "POST":
    # VideoCamera.__del__()
    # else:
    
    return StreamingHttpResponse(gen(VideoCamera()),
                        content_type='multipart/x-mixed-replace; boundary=text/plain')

def live_feed(request):
    return StreamingHttpResponse(gen(LiveWebCam()), content_type='multipart/x-mixed-replace; boundary=frame')
 