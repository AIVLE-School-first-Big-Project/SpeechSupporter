# Generated by Django 3.2.5 on 2022-04-20 07:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('community', '0007_post_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='post/%Y/%m/', verbose_name='IMAGE'),
        ),
    ]
