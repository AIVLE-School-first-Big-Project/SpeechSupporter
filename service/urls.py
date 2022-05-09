from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('history/', views.CoachingHistoryView.as_view(), name='history'),
    # path('server/', views.lobby),
    # path('client/', views.client),
    # path('video_feed/', views.video_feed, name='video_feed'),
    # path('live_feed/', views.live_feed, name='live_feed')
]
