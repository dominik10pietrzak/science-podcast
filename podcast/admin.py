from django.contrib import admin

# Register your models here.

from .models import Podcast, Comment, Like, UserProfile

admin.site.register(Podcast)
admin.site.register(Comment)
admin.site.register(Like)
admin.site.register(UserProfile)

