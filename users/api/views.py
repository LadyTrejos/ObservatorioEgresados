from users.models import User, Egresado, Admin, Evento, Interes
from .serializers import UserSerializer, EgresadoSerializer, AdminSerializer, EventoSerializer, InteresSerializer
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
    search_fields = ('id','email')

