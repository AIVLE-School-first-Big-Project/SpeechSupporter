from attr import fields
from rest_framework import serializers

from service.models import Coaching
from users.models import User
from users.serializers import UserSerializer

class CoachingHistorySerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = Coaching
        fields = '__all__'