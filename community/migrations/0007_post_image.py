# Generated by Django 3.2 on 2022-04-19 14:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('community', '0006_comment_author'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='media/post/%Y/%m/', verbose_name='IMAGE'),
        ),
    ]
