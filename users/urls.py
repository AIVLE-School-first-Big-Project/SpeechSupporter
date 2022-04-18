from django.contrib import admin
from django.urls import path, include
from users.views import RegisterView, LoginView, UserView, LogoutView, ChangePasswordView, Test
app_name = 'users'
urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', LoginView.as_view()),
    path('user/', UserView.as_view()),
    path('logout/', LogoutView.as_view()),
    path('change_password/', ChangePasswordView.as_view()),
    path('test/', Test.as_view()),
]