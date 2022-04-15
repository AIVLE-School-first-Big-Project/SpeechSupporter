from django.db import models
from django.conf import settings
from community.models import Post
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    email = models.EmailField(max_length=255, unique=True)
    nick_name = models.CharField(max_length=50)
    password = models.CharField(max_length=255, null=False)
    wannabe = models.CharField(max_length=50, null=False)
    profile_img = models.ImageField(null=True, upload_to="images")
    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(auto_now=True)
    is_activate = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['password','wannabe']

    class Meta:
        ordering = ['-date_joined']

    def get_full_name(self):
        email = self.email.split('@')[0]
        return email + '/' +self.nick_name

    def __str__(self):
        return self.nick_name

class BookMark(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, null=False, on_delete=models.CASCADE)
    create_dt = models.DateTimeField('CREATE DT', auto_now_add=True)

