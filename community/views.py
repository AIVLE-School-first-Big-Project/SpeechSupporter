from collections import OrderedDict
from gc import get_objects
from django.http import JsonResponse

from community.filters import PostFilter
from .serializers import PostCreateSerializer, CommentSerializer, PostDetailSerializer, PostListSerializer, PostModifySerializer, CateTagSerializer
from .models import Post, Comment, Category, Tag
# from users.models import User
from rest_framework.parsers import JSONParser
from django.views.decorators.csrf import csrf_exempt

from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes

from rest_framework.generics import ListAPIView, GenericAPIView, CreateAPIView, RetrieveAPIView, UpdateAPIView, DestroyAPIView
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework import status

import joblib
from .Data_preprocessing import data_split
# from sklearn.feature_extraction.text import TfidfVectorizer

@csrf_exempt
def post_create(request): # 글쓰기 - 내용, 제목
    # if request.method == "GET":
    # return HttpResponse("Login Plz")
    if request.method == "POST":
        data = JSONParser().parse(request)
        print(data)
        data['user'] = request.session.get('user')
        print(data)
        serializer = PostCreateSerializer(data=data)
        print(serializer)

        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status = 201)
        return JsonResponse(serializer.errors, status = 400)


# @csrf_exempt
# def post_list(request): # 커뮤니티 조회
#     if request.method == "GET":
#         query = Post.objects.all().order_by("create_dt").reverse()
#         serialzer = PostListSerializer(query, many=True)

#         return JsonResponse(serialzer.data, safe = False)


@permission_classes([IsAuthenticated])
class PostCreateAPIView(CreateAPIView):
    queryset = Post.objects.all()

    global model
    global vector

    model = joblib.load('community/model/rf.pkl') # 비속어 모델 소환
    vector = joblib.load('community/model/vector.pkl') # 임베딩 모델 소환

    def get_queryset(self):
        return super().get_queryset().prefetch_related('tags', 'category')
    serializer_class = PostCreateSerializer

    def create(self, request, *args, **kwargs):
        text = request.data['title'] + request.data['content']
        text = apply_preprocessing(text) # 
        y_pred = model.predict(text)
        if y_pred == 1: 
            return Response(status=status.HTTP_201_CREATED, data = {'message':"Save Failed", 'state' : False})

        serializer = self.get_serializer(data = request.data)
        if serializer.is_valid(raise_exception=True):
            print(request.user)
            serializer.save(user=request.user)

        if serializer.errors:
            print(serializer.errors)
        return Response(status=status.HTTP_201_CREATED, data = {'message':"post created"})

def apply_preprocessing(sentence):
    import re
    '''
    영어, 숫자, 한글(온전한 문자)을 제외한 나머지 제거
    '''
    result = ''.join(re.compile('[ㄱ-ㅎㅏ-ㅣ가-힣0-9a-zA-Z ]').findall(sentence)).strip()

    result = data_split(result)

    result = vector.transform([result])

    return result


# class CommentCreateAPIView(CreateAPIView):
#     queryset = Comment.objects.all()
#     serializer_class = CommentSerializer

# class CommentCreateRetreiveAPIView(ModelViewSet):    
#     http_method_names = ['get', 'post']
#     serializer_class = CommentSerializer
#     queryset = Comment.objects.all()

#     def perform_create(self, serializer):
#         serializer = self.get_serializer(data=self.request.data)

#         if serializer.is_valid(raise_exception=True):
#             serializer.save(author_id = self.request.user.pk, post_id=self.kwargs.get('pk'))
#             return Response(status=status.HTTP_201_CREATED, data = {'data' : serializer.validated_data})

#         if serializer.errors:
#             print(serializer.errors)
@permission_classes([IsAuthenticated])
class CommentCreateAPIView(CreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            print(request.user)
            serializer.save(post_id=self.kwargs.get('pk'), author_id=request.user.id)
        return Response(status=status.HTTP_201_CREATED, data={"message": "comment created"})


def get_prev_next(instance):
    try:
        prev = instance.get_previous_by_update_dt()
    except instance.DoesNotExist:
        prev = None

    try:
        next_ = instance.get_next_by_update_dt()
    except instance.DoesNotExist:
        next_ = None

    return prev, next_


class PostRetreiveAPIView(RetrieveAPIView):
    serializer_class = PostDetailSerializer
    queryset = Post.objects.all()

    def retrieve(self, request, *args, **kwargs):
        my_post = False
        instance = self.get_object()
        prevInstance, nextInstance = get_prev_next(instance)
        commentList = instance.comment_set.all()
        if instance.user == request.user:
            my_post = True

        instance.my_post = my_post

        data = {
            'post' : instance,
            'prevPost' : prevInstance,
            'nextPost' : nextInstance,
            'commentList' : commentList,
        }
        serializer = self.get_serializer(instance=data)
        instance.view_count += 1
        instance.save(update_fields=("view_count",))
        return Response(serializer.data)


# class PostLikeAPIView(UpdateAPIView):
@permission_classes([IsAuthenticated])
class PostLikeAPIView(GenericAPIView):
    queryset = Post.objects.all()
    # GET으로 처리함으로써 serializer는 삭제해도 됨.
    # serializer_class = PostLikeSerializer

    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.like += 1
        instance.save()
        return Response(instance.like)
    #partial = True 전체의 데이터를 업데이트하지 않아도 됨
    #Patch method
    # def update(self, request, *args, **kwargs):
    #     partial = kwargs.pop('partial', False)
    #     instance = self.get_object()

    #     data = {'like' : instance.like+1}
    #     serializer = self.get_serializer(instance, data=data, partial=partial)
    #     serializer.is_valid(raise_exception=True)
    #     self.perform_update(serializer)

    #     return Response(serializer.data)
    #GET method

class CateTagAPIView(APIView):
    def get(self, request):
        cateList = Category.objects.all()
        tagList = Tag.objects.all()

        data = {
            'cateList': cateList,
            'tagList': tagList,
        }
        serializer = CateTagSerializer(instance = data)
        return Response(serializer.data)

#ListView Pagination
class PostPageNumberPagination(PageNumberPagination):
    page_size = 15

    def get_paginated_response(self, data):
        return Response(OrderedDict([
            ('postList', data),
            ('pageCnt', self.page.paginator.num_pages),
            ('curPage', self.page.number)
        ]))
    # page_size_query_param = 'page_size'
    # max_page_size = 1000

class PostListAPIView(ListAPIView):
    queryset = Post.objects.all().order_by("create_dt").reverse()
    serializer_class = PostListSerializer
    pagination_class = PostPageNumberPagination

    filter_class = PostFilter

# @permission_classes([IsAuthenticated])
class MyPostListAPIView(ListAPIView):
    queryset = Post.objects.all()
    serializer_class = PostListSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        print(request.user)
        try:
            obj = queryset.filter(user=self.request.user)
        except BaseException: 
            return Response(status=status.HTTP_409_CONFLICT, data={'message': '데이터가 존재하지 않습니다.'})

        serializer = self.get_serializer(obj, many = True)
        if len(serializer.data) < 1:
            return Response(data={'message':'아직 작성한 글이 없습니다.'})

        return Response(serializer.data)

@permission_classes([IsAuthenticated])
class PostModifyAPIView(UpdateAPIView, DestroyAPIView): # 게시글 수정, 삭제하는 페이지
    serializer_class = PostModifySerializer
    queryset = Post.objects.all()

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        print(request.data)
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        print(serializer.validated_data)
        self.perform_update(serializer)

        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        try :
            instance = queryset.filter(id=self.kwargs['pk'])
        except BaseException: 
            return Response(status=status.HTTP_409_CONFLICT, data={'message': '데이터가 존재하지 않습니다.'})
        self.perform_destroy(instance=instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    # def delete(self, request): # 사용자가 글 수정 화면에서 글 삭제을 누를 때 - 아이디만 주세여

    #     user = Post.objects.get(id = self.kwargs.get('pk'))
    #     user.delete()

    #     return Response({"message" : "Remove Success"}, status=status.HTTP_200_OK)

# @api_view(['GET','PUT','DELETE'])
# def post_detail(request, pk):
#     if request.method == 'GET':
#         try:
#             post = Post.objects.get(pk=pk)
#         except Post.DoesNotExist:
#             return Response(data={"Error": 'Post Not found'}, status=status.HTTP_404_NOT_FOUND)

#         serializer = PostModifySerializer(post)
#         return Response(serializer.data)

#     if request.method == 'PUT':
#         post = Post.objects.get(pk=pk)
#         print(post)
#         serializer = PostModifySerializer(instance=post, data=request.data)
#         if serializer.is_valid(raise_exception=True):
#             serializer.save()
#         else:
#             return Response(serializer.data, status=status.HTTP_400_BAD_REQUEST)

#     if request.method == 'DELETE':
#         post = Post.objects.get(pk=pk)
#         post.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT, data="deleted") 