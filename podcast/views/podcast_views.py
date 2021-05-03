from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework.response import Response
from podcast.serializers import PodcastSerializer, CommentSerializer, UpdatePodcastSerializer, LikeSerializer
from podcast.models import Podcast, Comment, Like
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from rest_framework.pagination import PageNumberPagination
from rest_framework.generics import *
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework import status
from django.db.models import Q
import random

# !!!
#  W kodzie panuje chaos, ponieważ aktualnie przepisuję functions based views na class based views
# !!!

class PodcastList(ListAPIView):
    queryset = Podcast.objects.all()
    serializer_class = PodcastSerializer
    pagination_class = PageNumberPagination
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['title', 'category']
    


class PodcastDetail(RetrieveAPIView):
    queryset = Podcast.objects.all()
    serializer_class = PodcastSerializer


    
class PodcastDelete(DestroyAPIView):
    permission_classes = [IsAdminUser]
    queryset = Podcast.objects.all()



class PodcastNewestDetail(APIView):
    def get(self, request, format=None):
        podcast = Podcast.objects.latest('id')   
        serializer = PodcastSerializer(podcast, many=False)
        return Response(serializer.data)



class PodcastCreateUpdate(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, format=None):
        podcast = Podcast.objects.create(
            title='New Podcast',
            category='',
            description=''
        )
        serializer = PodcastSerializer(podcast, many=False)
        return Response(serializer.data)


    def put(self, request, pk, format=None):
        data = request.data
        podcast = Podcast.objects.get(id=pk)

        podcast.title = data['title']
        podcast.category = data['category']
        podcast.code = data['code']
        podcast.description = data['description']

        podcast.save()
        serializer = PodcastSerializer(podcast, many=False)

        return Response(serializer.data)



class PodcastPreview(APIView):
    def get(self, request, pk, format=None):
        podcasts = Podcast.objects.filter(~Q(id=pk))
        podcast = random.choice(podcasts)
        serializer = PodcastSerializer(podcast, many=False)
        return Response(serializer.data)



class LikeUnlikeAPIView(APIView):
    permission_classes = [IsAuthenticated]

    # like podcast / comment
    def post(self, request, pk, format=None):
        user = request.user
        like_type = request.data['type']

        if like_type == 'podcast':
            podcast = Podcast.objects.get(id=pk)
            comment = None
            alreadyExists = podcast.like_set.filter(user=user, podcast=podcast).exists()
        else:
            comment = Comment.objects.get(id=pk)
            podcast = None
            alreadyExists = comment.like_set.filter(user=user, comment=comment).exists()

        if alreadyExists:
            return Response('You cannot like one podcast more than once!')
        else:
            like = Like.objects.create(
                user=user,
                podcast=podcast,
                comment=comment
            )
            serializer = LikeSerializer(like, many=False)
            return Response(serializer.data)


    # unlike podcast / comment
    def delete(self, request, pk, format=None):
        user = request.user
        like_type = request.data['type']

        if like_type == 'podcast':
            podcast = Podcast.objects.get(id=pk)
            like = Like.objects.get(user=user, podcast=podcast)
        else:
            comment = Comment.objects.get(id=pk)
            like = Like.objects.get(user=user, comment=comment)

        like.delete()

        return Response('Liked-unliked')



@api_view(['POST'])
def uploadImage(request):
    data = request.data
    file_type = data['type']
    podcast_id = data['podcast_id']
    podcast = Podcast.objects.get(id=podcast_id)

    if file_type == 'background':
        podcast.background = request.FILES.get('file')
    elif file_type == 'cover':
        podcast.cover = request.FILES.get('file')
    else: # file_type == 'audio'
        podcast.file = request.FILES.get('file')

    podcast.save()
    return Response('File has been uploaded')



@api_view(['GET'])
def getComments(request, pk):
    podcast = Podcast.objects.get(id=pk)
    comments = podcast.comment_set.all()
    serializer = CommentSerializer(comments, many=True)
    return Response(serializer.data)



class CommentAPIView(APIView):
    permission_classes = [IsAuthenticated]

    # create comment
    def post(self, request, pk, format=None):
        user = request.user
        podcast = Podcast.objects.get(id=pk)
        data = request.data
        if data['type'] == 'podcast':
            Comment.objects.create(
                user=user,
                podcast=podcast,
                author=user.username,
                text=data['text']
            )
            podcast.save()
        else:
            comment = Comment.objects.get(id=data['commentId'])
            author = comment.author

            if data['replyId'] != 0:
                reply = Comment.objects.get(id=data['replyId'])
                author = reply.author

            Comment.objects.create(
                user=user,
                higher_comment=comment,
                higher_author=author,
                author=user.username,
                text=data['text']
            )
            comment.save()
        return Response('Comment has been created')

    # update comment
    def put(self, request, pk, format=None):
        data = request.data
        comment = Comment.objects.get(id=pk)
        if comment.text != data['text']:
            comment.text = data['text'] 
            comment.was_edited = True
            comment.save()
        serializer = CommentSerializer(comment, many=False)
        return Response(serializer.data)

    # delete comment
    def delete(self, request, pk, format=None):
        user = request.user
        comment = Comment.objects.get(id=pk)
        if comment.user.id == user.id:
            comment.delete()
            return Response('Comment has been deleted')
        else:
            content = {'detail': 'You cannot delete other users comments!'}
            return Response(content, status=status.HTTP_400_BAD_REQUEST)
