from users.models import User, Egresado, Admin, Evento, Interes
from .serializers import UserSerializer, EgresadoSerializer, AdminSerializer, EventoSerializer, InteresSerializer
from rest_framework import viewsets
from rest_framework.generics import ListAPIView


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

class InteresViewSet(viewsets.ModelViewSet):
    serializer_class = InteresSerializer
    queryset = Interes.objects.all()

class AdminListView(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.filter(is_admin = True)
    serializer_class = UserSerializer

