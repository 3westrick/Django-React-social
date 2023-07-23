import random

from django.db.models import Q
from django.shortcuts import render, get_object_or_404
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from django.contrib.auth.models import User
from rest_framework.filters import OrderingFilter
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework import permissions
from rest_framework.exceptions import ValidationError
from rest_framework.generics import GenericAPIView, ListAPIView
from rest_framework import mixins, views
from rest_framework.throttling import UserRateThrottle
from rest_framework import serializers
from ..models import Pin, Saved, PinMessage, Category
from .serializers import PinListSerializer, PinSingleSerializer, \
    PinMessageSerializer, SavedSerializer, UserSerializer, CategoriesSerializer
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['id'] = user.id
        token['username'] = user.username
        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class PinList(mixins.ListModelMixin, GenericAPIView):
    queryset = Pin.objects.all()
    serializer_class = PinListSerializer
    authentication_classes = [JWTAuthentication, SessionAuthentication]

    # permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        search = request.GET.get('search', None)
        queryset = self.filter_queryset(self.get_queryset())

        if search:
            queryset = queryset.filter(Q(category__title__icontains=search) |
            Q(title__icontains=search) |
            Q(about__icontains=search))

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class UserRetrieve(mixins.RetrieveModelMixin, GenericAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class PinDetail(mixins.RetrieveModelMixin, GenericAPIView):
    queryset = Pin.objects.all()
    serializer_class = PinSingleSerializer

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)


class PinUpdate(mixins.UpdateModelMixin, GenericAPIView):
    queryset = Pin.objects.all()
    serializer_class = PinSingleSerializer

    def put(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)


class PinCreate(mixins.CreateModelMixin, GenericAPIView):
    queryset = Pin.objects.all()
    serializer_class = PinSingleSerializer
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

    def perform_create(self, serializer):
        cat = Category.objects.get(pk=self.request.data['category'])
        serializer.save(user=self.request.user, category=cat)


class PinDelete(mixins.DestroyModelMixin, GenericAPIView):
    queryset = Pin.objects.all()
    serializer_class = PinSingleSerializer

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)


class MessageList(mixins.ListModelMixin, GenericAPIView):
    queryset = PinMessage.objects.all()
    serializer_class = PinMessageSerializer
    lookup_field = 'pk'

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        queryset = self.filter_queryset(self.get_queryset()).filter(pin__id=pk)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class MessageCreate(mixins.CreateModelMixin, GenericAPIView):
    queryset = PinMessage.objects.all()
    serializer_class = PinMessageSerializer
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer, **kwargs)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer, *args, **kwargs):
        pk = kwargs.get('pk')
        pin = Pin.objects.get(pk=pk)
        serializer.save(user=self.request.user, pin=pin)


class SaveList(mixins.ListModelMixin, GenericAPIView):
    queryset = Saved.objects.all()
    serializer_class = SavedSerializer

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset()).filter(user=request.user)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication, SessionAuthentication])
def save_pin(request, pk):
    pin = Pin.objects.get(pk=pk)
    user = request.user
    saved = Saved.objects.filter(user=user)
    if saved.exists():
        saved = saved.first()
    else:
        saved = Saved.objects.create(
            user=user,
        )
    if saved.saves.filter(pk=pk).exists():
        saved.saves.remove(pin)
        return Response({'result': False}, status=status.HTTP_200_OK)
    else:
        saved.saves.add(pin)
        return Response({'result': True}, status=status.HTTP_200_OK)


class CatList(mixins.ListModelMixin, GenericAPIView):
    queryset = Category.objects.all()
    serializer_class = CategoriesSerializer

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)


@api_view(['POST'])
def create_auth(request):
    if User.objects.filter(username=request.data['username']):
        return Response(status=status.HTTP_200_OK)
    serialized = UserSerializer(data=request.data)
    if serialized.is_valid(raise_exception=True):
        user = User.objects.create(
            username=serialized.data['username'],
            email=serialized.data['email'],
        )
        user.set_password(request.data['password1'])
        user.save()

    return Response(status=status.HTTP_200_OK)


@api_view(['GET'])
def cat_pin(request, username):
    qs = Pin.objects.filter(
        Q(category__title__icontains=username) |
        Q(title__icontains=username) |
        Q(about__icontains=username)
    )
    data = PinListSerializer(qs, many=True, context={'request': request}).data
    return Response(data)
