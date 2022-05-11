from django.urls import path
from community.views import PostCreateAPIView, PostListAPIView, PostModifyAPIView, PostRetreiveAPIView, MyPostListAPIView, PostLikeAPIView, CommentCreateAPIView, CateTagAPIView
app_name = 'post'
urlpatterns = [
    path('post/', PostCreateAPIView.as_view()), 
    path('postlist/', PostListAPIView.as_view()), 
    path('mypostlist/', MyPostListAPIView.as_view()), 
    path('<int:pk>/', PostRetreiveAPIView.as_view()),
    # path('comment/', CommentCreateAPIView.as_view()), 
    path('<int:pk>/comment/', CommentCreateAPIView.as_view()), 
    path('<int:pk>/like/', PostLikeAPIView.as_view()), 
    path('catetag/', CateTagAPIView.as_view()), 
    path('modify/<int:pk>/', PostModifyAPIView.as_view()),
    # path('modify/<int:pk>/', post_detail),
]