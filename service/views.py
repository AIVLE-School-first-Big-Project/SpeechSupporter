from typing import OrderedDict
from django.shortcuts import render
from django.http.response import StreamingHttpResponse
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import CreateAPIView,ListAPIView
from community.views import PostPageNumberPagination
from service.models import Coaching

from service.serializers import CoachingHistorySerializer
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
        frame = camera.get_frame()
        yield (
            b'--frame\r\n'
			b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')

def video_feed(request):
    #카메라 종료 요청 받기.
    if request.method == "POST":
        VideoCamera.__del__()
    else:
        return StreamingHttpResponse(gen(VideoCamera()),
                        content_type='multipart/x-mixed-replace; boundary=frame')

def live_feed(request):
	return StreamingHttpResponse(gen(LiveWebCam()),
					content_type='multipart/x-mixed-replace; boundary=frame')

class CoachingHistoryPagination(PostPageNumberPagination):
    page_size = 10

    def get_paginated_response(self, data):
        return Response(OrderedDict([
            ('historyList', data),
            ('pageCnt', self.page.paginator.num_pages),
            ('curPage', self.page.number),
        ]))

# @permission_classes([IsAuthenticated])
class CoachingHistoryView(CreateAPIView, ListAPIView):
    '''
    사용자의 코칭 내용에 대한 히스토리를 저장하고, 히스토리들을 불러옵니다.
    '''
    serializer_class = CoachingHistorySerializer
    queryset = Coaching.objects.all()
    pagination_class = CoachingHistoryPagination

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data = request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors)
    
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        
        if page is not None:
            try :
                obj = queryset.filter(user=self.request.user)
                serializer = self.get_serializer(obj, many=True)
            except:
                return Response(status=status.HTTP_409_CONFLICT)

            serializer = self.get_serializer(queryset, many=True)
        return self.get_paginated_response(serializer.data)
             
        