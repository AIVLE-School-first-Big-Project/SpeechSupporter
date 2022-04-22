from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import serializers
from django.contrib.auth import get_user_model,authenticate

from rest_framework_simplejwt.settings import api_settings

from .serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
# from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
import logging

logging.basicConfig(level=logging.DEBUG)
user_model = get_user_model()


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        token['nickname'] = user.nick_name
        token['wannabe'] = user.wannabe
        token['email'] = user.user_email
        token['error'] = cls.errors
        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serialize_class = MyTokenObtainPairSerializer

@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/token/',
        '/api/token/refresh/',
    ]

    return JsonResponse(routes, safe=False)