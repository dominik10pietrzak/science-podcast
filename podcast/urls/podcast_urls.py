from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from podcast.views import podcast_views as views


urlpatterns = [
    path('', views.podcastList, name='podcast-list'),
    path('upload/', views.uploadImage, name='image-upload'),
    path('create/', views.createPodcast, name='create-podcast'),
    path('<str:pk>/like/', views.likePodcast, name='like-podcast'),
    path('<str:pk>/unlike/', views.unlikePodcast, name='unlike-podcast'),

    path('<str:pk>/', views.getPodcastById, name='podcast-get'),
    path('<str:pk>/preview/', views.getPodcastPreview, name='podcast-get-preview'),
    path('update/<str:pk>/', views.podcastUpdate, name='podcast-update'),
    path('delete/<str:pk>/', views.podcastDelete, name='podcast-delete'),

    # comments
    path('<str:pk>/comments/', views.getComments, name='get-comments'),
    path('comments/<str:pk>/like/', views.likeComment, name='like-comments'),
    path('comments/<str:pk>/unlike/', views.unlikeComment, name='unlike-comments'),

    path('<str:pk>/comments/', views.getComments, name='get-comments'),
    path('<str:pk>/create_comment/', views.commentCreate, name='create-comment'),
    path('<str:pk>/delete_comment/', views.commentDelete, name='delete-comment'),
    path('comments/<str:pk>/update/', views.commentUpdate, name='comment-update'),
]