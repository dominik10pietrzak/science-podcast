from django.db import models
from django.db.models.signals import post_delete
from django.dispatch import receiver
from django.contrib.auth.models import User
from colorthief import ColorThief
from PIL import Image, ImageFilter


# Create your models here.


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    profile_pic = models.ImageField(default='profile.png', null=True, blank=True)

    def __str__(self):
        return str(self.user)


class Podcast(models.Model):
    CATEGORY_CHOICES = [
        ('Kosmos', 'Kosmos'),
        ('Klimat', 'Klimat'),
        ('Technologia', 'Technologia'),
    ]

    title = models.CharField(max_length=200, null=False)
    category = models.CharField(max_length=200, choices=CATEGORY_CHOICES, null=False)
    description = models.TextField(null=True, blank=True)
    cover = models.ImageField(null=True, blank=True, default='placeholder.png')
    background = models.ImageField(null=True, blank=True, default='placeholder.png')
    dominant_color = models.CharField(max_length=20, null=True, blank=True)
    code = models.CharField(max_length=200, null=False)
    date_added = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    
    
    class Meta:
        ordering = ['-id']

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        color_thief = ColorThief(self.cover)
        self.dominant_color = color_thief.get_color(quality=1)
        super(Podcast, self).save(*args, **kwargs)


class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    podcast = models.ForeignKey(Podcast, on_delete=models.CASCADE, null=True, blank=True)
    higher_comment = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True)
    author = models.CharField(max_length=200, null=True, blank=True)
    was_edited = models.BooleanField(default=False)
    higher_author = models.CharField(max_length=200, null=True, blank=True)
    text = models.TextField(null=False)
    date_added = models.DateTimeField(auto_now_add=True, null=True)

    class Meta:
        ordering = ['-id']

    def __str__(self):
        return self.text


class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    podcast = models.ForeignKey(Podcast, on_delete=models.CASCADE, null=True, blank=True)
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True, null=True, blank=True)


    class Meta:
        ordering = ['-created']

    def __str__(self):
        return str(self.user)