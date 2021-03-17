from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from podcast.serializers import PodcastSerializer, CommentSerializer, UpdatePodcastSerializer, LikeSerializer
from podcast.models import Podcast, Comment, Like
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from rest_framework import status
from django.db.models import Q
import random



@api_view(['GET'])
def podcastList(request):
    query = request.query_params.get('keyword')
    
    if query == None:
        query = ''

    podcasts = Podcast.objects.filter(Q(title__icontains=query) | Q(category__icontains=query))
    
    page = request.query_params.get('page')
    paginator = Paginator(podcasts, 50)

    try:
        podcasts = paginator.page(page)
    except PageNotAnInteger:
        podcasts = paginator.page(1)
    except EmptyPage:
        podcasts = paginator.page(paginator.num_pages)

    if page == None:
        page = 1

    page = int(page)

    podcasts_serializer = PodcastSerializer(podcasts, many=True)
    return Response({'podcasts': podcasts_serializer.data, 'page': page, 'pages': paginator.num_pages})



@api_view(['GET'])
def getPodcastById(request, pk):

    try:
        podcast = Podcast.objects.get(id=pk)
    except Podcast.DoesNotExist:
        podcast = Podcast.objects.latest('id')        

    serializer = PodcastSerializer(podcast, many=False)
    return Response(serializer.data)


@api_view(['GET'])
def getPodcastPreview(request, pk):
    podcasts = Podcast.objects.filter(~Q(id=pk))
    # podcast = Podcast.objects.filter(id__lt=pk).order_by('-id').first()
    podcast = random.choice(podcasts)
    # if not podcast:
    #     podcast = Podcast.objects.filter(id__gt=pk).order_by('id').last()

    serializer = PodcastSerializer(podcast, many=False)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def likePodcast(request, pk):
    user = request.user
    podcast = Podcast.objects.get(id=pk)

    alreadyExists = podcast.like_set.filter(user=user, podcast=podcast).exists()

    if alreadyExists:
        return Response('You cannot like one podcast more than once!')

    else:
        like = Like.objects.create(
            user=user,
            podcast=podcast
        )
        serializer = LikeSerializer(like, many=False)
        return Response(serializer.data)



@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def unlikePodcast(request, pk):
    user = request.user
    podcast = Podcast.objects.get(id=pk)

    like = Like.objects.get(user=user, podcast=podcast)
    like.delete()

    return Response('Liked-unliked')


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def likeComment(request, pk):
    user = request.user
    comment = Comment.objects.get(id=pk)

    alreadyExists = comment.like_set.filter(user=user, comment=comment).exists()

    if alreadyExists:
        return Response('You cannot like one podcast more than once!')

    else:
        like = Like.objects.create(
            user=user,
            comment=comment
        )
        serializer = LikeSerializer(like, many=False)
        return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def unlikeComment(request, pk):
    user = request.user
    comment = Comment.objects.get(id=pk)

    like = Like.objects.get(user=user, comment=comment)
    like.delete()

    return Response('Liked-unliked')


@api_view(['POST'])
@permission_classes([IsAdminUser])
def createPodcast(request):
    podcast = Podcast.objects.create(
        title='New Podcast',
        category='',
        description=''
    )
    serializer = PodcastSerializer(podcast, many=False)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def podcastUpdate(request, pk):
    data = request.data
    podcast = Podcast.objects.get(id=pk)

    podcast.title = data['title']
    podcast.category = data['category']
    podcast.description = data['description']

    podcast.save()
    serializer = PodcastSerializer(podcast, many=False)

    return Response(serializer.data)


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
    elif file_type == 'audio':
        podcast.file = request.FILES.get('file')
    else:
        print("I didn't see that coming...")

    podcast.save()
    return Response('File has been uploaded')



@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def podcastDelete(request, pk):
    podcast = Podcast.objects.get(id=pk)
    podcast.delete()
    return Response('Podcast has been deleted.')



@api_view(['POST'])
def commentCreate(request, pk):
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



@api_view(['GET'])
def getComments(request, pk):
    podcast = Podcast.objects.get(id=pk)
    comments = podcast.comment_set.all()
    
    serializer = CommentSerializer(comments, many=True)

    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def commentUpdate(request, pk):
    data = request.data
    comment = Comment.objects.get(id=pk)
    
    if comment.text != data['text']:
        comment.text = data['text'] 
        comment.was_edited = True
        comment.save()

    serializer = CommentSerializer(comment, many=False)

    return Response(serializer.data)



@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def commentDelete(request, pk):
    user = request.user
    comment = Comment.objects.get(id=pk)

    if comment.user.id == user.id:
        comment.delete()
        return Response('Comment has been deleted')
    else:
        content = {'detail': 'You cannot delete other users comments!'}
        return Response(content, status=status.HTTP_404_BAD_REQUEST)
    return Response('asd')


