from rest_framework import serializers
from .models import Podcast, Comment, Like, UserProfile
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)
    surname = serializers.SerializerMethodField(read_only=True)
    # likedPodcastsNumber = serializers.SerializerMethodField(read_only=True)
    writtenCommentsNumber = serializers.SerializerMethodField(read_only=True)
    isAdmin = serializers.SerializerMethodField(read_only=True)
    userProfile = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = '__all__'

    def get_isAdmin(self, obj):
        return obj.is_staff

    def get_name(self, obj):
        name = obj.first_name
        return name

    def get_surname(self, obj):
        surname = obj.last_name
        return surname

    # def get_likedPodcastsNumber(self, obj):
    #     likedPodcastsNumber = obj.podcast_set.filter(lambda obj: obj.)
    #     print(obj.comment_set.all())
    #     return len(likedPodcastsNumber)

    def get_writtenCommentsNumber(self, obj):
        writtenCommentsNumber = obj.comment_set.filter(author=obj.username)
        print(obj.comment_set.all())
        return len(writtenCommentsNumber)


    def get_userProfile(self, obj):
        userProfile = obj.userprofile
        serializer = UserProfileSerializer(userProfile, many=False)
        return serializer.data



class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = '__all__'

    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)



class CommentSerializer(serializers.ModelSerializer):
    likes = serializers.SerializerMethodField(read_only=True)
    replies = serializers.SerializerMethodField(read_only=True)
    authorProfile = serializers.SerializerMethodField(read_only=True)


    class Meta:
        model = Comment
        fields = '__all__'

    def get_likes(self, obj):
        likes = obj.like_set.all()
        serializer = LikeSerializer(likes, many=True)
        return serializer.data
    
    def get_replies(self, obj):
        replies = obj.comment_set.all()
        serializer = CommentSerializer(replies, many=True)
        return serializer.data
    
    def get_authorProfile(self, obj):
        authorProfile = obj.user.userprofile
        serializer = UserProfileSerializer(authorProfile, many=False)
        return serializer.data



class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = '__all__'



class PodcastSerializer(serializers.ModelSerializer):
    comments = serializers.SerializerMethodField(read_only=True)
    commentsCount = serializers.SerializerMethodField(read_only=True)
    likes = serializers.SerializerMethodField(read_only=True)


    class Meta:
        model = Podcast
        fields = '__all__'

    def get_comments(self, obj):
        comments = obj.comment_set.all()
        serializer = CommentSerializer(comments, many=True)
        return serializer.data
    
    def get_commentsCount(self, obj):
        number = 0
        comments = obj.comment_set.all()
        for comment in comments:
            replies = comment.comment_set.all()
            number += 1 + len(replies)
            
        return number


    def get_likes(self, obj):
        likes = obj.like_set.all()
        serializer = LikeSerializer(likes, many=True)
        return serializer.data



class UpdatePodcastSerializer(serializers.ModelSerializer):
    class Meta:
        model = Podcast
        fields = ('id', 'title', 'description', 'date_added', 'likes')