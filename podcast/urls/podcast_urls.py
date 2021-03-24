from django.urls import path
from django.conf import settings
from django.conf.urls import url
from django.conf.urls.static import static
from podcast.views import podcast_views as views


urlpatterns = [
    url(r'^$', views.PodcastList.as_view(), name='podcast-list'),
    path('upload/', views.uploadImage, name='image-upload'),
    path('create/', views.PodcastCreate.as_view(), name='create-podcast'),
    path('newest/', views.PodcastNewestDetail.as_view(), name='newest-podcast'),

    
    path('<str:pk>/like/', views.LikeUnlikeAPIView.as_view(), name='like-podcast'),
    path('<str:pk>/unlike/', views.LikeUnlikeAPIView.as_view(), name='unlike-podcast'),


    path('<str:pk>/', views.PodcastDetail.as_view(), name='podcast-get'),
    path('<str:pk>/preview/', views.PodcastPreview.as_view(), name='podcast-get-preview'),
    path('update/<str:pk>/', views.podcastUpdate, name='podcast-update'),
    path('delete/<str:pk>/', views.PodcastDelete.as_view(), name='podcast-delete'),


    # comments
    path('<str:pk>/comments/', views.getComments, name='get-comments'),
    path('comments/<str:pk>/like/', views.LikeUnlikeAPIView.as_view(), name='like-comments'),
    path('comments/<str:pk>/unlike/', views.LikeUnlikeAPIView.as_view(), name='unlike-comments'),

    path('<str:pk>/comments/', views.getComments, name='get-comments'),
    path('<str:pk>/create_comment/', views.CommentAPIView.as_view(), name='create-comment'),
    path('<str:pk>/delete_comment/', views.CommentAPIView.as_view(), name='delete-comment'),
    path('comments/<str:pk>/update/', views.CommentAPIView.as_view(), name='comment-update'),
]