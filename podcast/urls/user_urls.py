from django.urls import path
from podcast.views import user_views as views


urlpatterns = [
    path('login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),  
    path('register/', views.registerUser, name='register'),
    # email sender
    path('send_message/', views.send_email_message, name='send-email'),

    path('profile/', views.getUserProfile, name='users-profile'),
    path('profile/upload/', views.uploadProfileImage, name='users-profile-upload '),    
    path('profile/update/', views.updateUserProfile, name='users-profile-update '),    
    path('', views.getUsers, name='users'),  

    path('<str:pk>/', views.getUserById, name='user-get-by-id'),
    path('update/<str:pk>/', views.updateUser, name='user-update'),
    path('delete/<str:pk>/', views.deleteUser, name='user-delete'),
]
