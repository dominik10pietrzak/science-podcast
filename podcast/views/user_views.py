from django.shortcuts import render
from django.contrib.auth.hashers import make_password

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.response import Response

from django.contrib.auth.models import User
from podcast.serializers import UserSerializer, UserSerializerWithToken
from podcast.models import UserProfile

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status

from django.core.mail import send_mail
from django.conf import settings
from decouple import config
import json


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        serializer = UserSerializerWithToken(self.user).data
        for k, v in serializer.items():
            data[k] = v

        return data


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['POST'])
def registerUser(request):
    data = request.data
    try:
        user = User.objects.create(
            first_name=data['name'],
            username=data['name'],
            email=data['email'],
            password=make_password(data['password'])
        )

        UserProfile.objects.create(
            user=user
        )

        serializer = UserSerializerWithToken(user, many=False)
        return Response(serializer.data)
    
    except:
        message = {'detail' : 'User with this email already exists'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUsers(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUserById(request, pk):
    user = User.objects.get(id=pk)
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUserProfile(request):
    user = request.user
    serializer = UserSerializerWithToken(user, many=False)

    data = request.data

    user.username = data['username']
    user.first_name = data['name']
    user.email = data['email']

    if data['password'] != '':
        user.password = make_password(data['password'])
    user.save()

    return Response(serializer.data)


@api_view(['POST'])
def uploadProfileImage(request):
    data = request.data
    profile_id = data['profile_id']
    profile = UserProfile.objects.get(id=profile_id)
    profile.profile_pic = request.FILES.get('file')
    profile.save()

    return Response('File has been uploaded')


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    user = request.user
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateUser(request, pk):
    user = User.objects.get(id=pk)

    data = request.data 
    
    user.first_name = data['name']
    user.username = data['name']
    user.email = data['email']
    user.is_staff = data['isAdmin']
    user.save()

    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteUser(request, pk):
    user = User.objects.get(id=pk)
    user.delete()
    return Response('User has been deleted')


@api_view(['POST'])
def send_email_message(request):
    data = request.data

    message_title = 'Wiadomość ze strony portfolio od - ' + data['name'] 
    message =  data['message'] + ' ' + data['email']

    send_mail(
        message_title,
        message,
        settings.EMAIL_HOST_USER,
        ['dominikpietrzak.webdev@gmail.com'],
        fail_silently=False,
    )

    return Response("Email succesfully sent!")
