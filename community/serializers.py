from asyncore import read
from dataclasses import fields
from enum import unique
from importlib.metadata import files
from unicodedata import category
from django.forms import CharField
from rest_framework import serializers

from users.serializers import UserSerializer
from .models import *

class PostCreateSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    image = serializers.ImageField(use_url=True, required = False)
    # category = serializers.PrimaryKeyRelatedField(queryset=query)
    # tags = serializers.PrimaryKeyRelatedField(queryset=query, many=True)
    class Meta:
        model = Post
        fields = ['title', 'content','user','category', 'tags', 'image']
    
class PostListSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source = 'user.nick_name')
    category = serializers.ReadOnlyField(source = 'category.name')
    class Meta:
        model = Post 
        fields = ['id', 'user', 'title', 'category','content', 'create_dt', 'like', 'view_count']


class CommentSerializerSub(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    class Meta:
        model = Comment
        fields = ['id', 'author', 'content', 'update_dt']
        # fields = '__all__'

class PostRetrieveSerializer(serializers.ModelSerializer):
    email = serializers.ReadOnlyField(source = 'user.email')
    user = serializers.ReadOnlyField(source = 'user.nick_name')
    category = serializers.StringRelatedField()
    tags = serializers.StringRelatedField(many=True)

    class Meta:
        model = Post
        exclude = ['create_dt']

class PostSerializerSub(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'title']
            
class PostDetailSerializer(serializers.Serializer):
    post = PostRetrieveSerializer()
    prevPost = PostSerializerSub()
    nextPost = PostSerializerSub()
    commentList = CommentSerializerSub(many = True)
    
class CommentSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source = 'user.nick_name')

    class Meta:
        model = Comment
        fields = '__all__'

class PostLikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post 
        fields = ['like']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['name']

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['name']

class CateTagSerializer(serializers.Serializer):
    cateList = serializers.ListField(child=serializers.CharField())
    tagList = serializers.ListField(child=serializers.CharField())

class PostModifySerializer(serializers.ModelSerializer):
    content = serializers.StringRelatedField()
    title = serializers.StringRelatedField()
    id = serializers.StringRelatedField()
    class Meta:
        model = Post
        fields = ['content', 'title', 'id']