from users.models import User, Egresado, Admin, Evento, Interes, FriendRequest
from .serializers import (
    UserSerializer, EgresadoSerializer, AdminSerializer, 
    EventoSerializer, InteresSerializer, FriendRequestSerializer, FriendRequestListSerializer,
    FriendCircleSerializer
    )
from rest_framework import viewsets
from rest_framework.generics import ListAPIView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter, SearchFilter


class UserViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing user instances.
    """
    serializer_class = UserSerializer
    queryset = User.objects.all()

class EgresadoViewSet(viewsets.ModelViewSet):
    serializer_class = EgresadoSerializer
    queryset = Egresado.objects.all()

class AdminViewSet(viewsets.ModelViewSet):
    serializer_class = AdminSerializer
    queryset = Admin.objects.all()

class EventoViewSet(viewsets.ModelViewSet):
    serializer_class = EventoSerializer
    queryset = Evento.objects.all()
    filter_backends = (DjangoFilterBackend, OrderingFilter, SearchFilter,)
    filter_fields = ('admin',)
    ordering_fields = ('created_at', 'name')
    search_fields = ('name',)


class InteresViewSet(viewsets.ModelViewSet):
    serializer_class = InteresSerializer
    queryset = Interes.objects.all()

class AdminListView(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.filter(is_admin = True)
    serializer_class = UserSerializer

class EgresadoListView(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.filter(is_graduated = True)
    serializer_class = UserSerializer
    filter_backends = (DjangoFilterBackend, OrderingFilter, SearchFilter,)
    filter_fields = ('is_active',)
    ordering_fields = ('id', 'email')
    search_fields = ('id','email','name', 'last_name')


class FriendRequestView(viewsets.ModelViewSet):
    queryset = FriendRequest.objects.all()
    serializer_class = FriendRequestSerializer
    filter_backends = (DjangoFilterBackend, OrderingFilter, SearchFilter,)
    filter_fields = ('to_user', 'from_user')
    ordering_fields = ('timestamp',)
    search_fields = ('to_user','from_user')

class FriendRequestListView(viewsets.ReadOnlyModelViewSet):
    queryset = FriendRequest.objects.all()
    serializer_class = FriendRequestListSerializer
    filter_backends = (DjangoFilterBackend, OrderingFilter, SearchFilter,)
    filter_fields = ('to_user', 'from_user')
    ordering_fields = ('timestamp',)
    search_fields = ('to_user','from_user')

class FriendCircleView(viewsets.ReadOnlyModelViewSet):
    queryset = Egresado.objects.all()
    serializer_class = FriendCircleSerializer
    filter_backends = (DjangoFilterBackend, OrderingFilter, SearchFilter,)
    filter_fields = ('user',)
    ordering_fields = ('user',)
    search_fields = ('user',)