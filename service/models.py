# from django.db import models

# Create your models here.
class Coaching(models.Model):
    user = models.ForeignKey("users.User", on_delete=models.CASCADE, null=False, blank=False)
    pose = models.CharField(max_length=255)
    voice = models.CharField(max_length=255)
    create_dt = models.DateTimeField('CREATE DT', auto_now_add=True)