from rest_framework import serializers
from rest_auth.registration.serializers import RegisterSerializer
from allauth.account.adapter import get_adapter
from users.models import User, Egresado, Admin, Evento, Interes

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id',
            'name',
            'last_name',
            'email',
            'password',
            'country',
            'region',
            'city',
            'is_graduated',
            'is_admin'
        )

class CustomRegisterSerializer(RegisterSerializer):
    
    id = serializers.CharField(required=True)
    name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    country = serializers.CharField(required=True)
    region = serializers.CharField(required=True)
    city = serializers.CharField(required=True)
    is_graduated = serializers.BooleanField()
    is_admin = serializers.BooleanField()

    class Meta: 
        model = User
        fields = (
            'email',
            'password',
            'id',
            'name',
            'last_name',
            'country',
            'region',
            'city',
            'is_graduated',
            'is_admin'
        )
    
    def get_cleaned_data(self):
        return {
            'id': self.validated_data.get('id', ''),
            'password1': self.validated_data.get('password1', ''),
            'password2': self.validated_data.get('password2', ''),
            'name': self.validated_data.get('name', ''),
            'last_name': self.validated_data.get('last_name', ''),
            'email': self.validated_data.get('email', ''),
            'country': self.validated_data.get('country', ''),
            'region': self.validated_data.get('region', ''),
            'city': self.validated_data.get('city', ''),
            'is_graduated': self.validated_data.get('is_graduated', ''),
            'is_admin': self.validated_data.get('is_admin', ''),
        }

    def save(self, request):
        adapter = get_adapter()
        user = adapter.new_user(request)
        self.cleaned_data = self.get_cleaned_data()
        user.id = self.cleaned_data.get('id')
        user.name = self.cleaned_data.get('name')
        user.last_name = self.cleaned_data.get('last_name')
        user.country = self.cleaned_data.get('country')
        user.region = self.cleaned_data.get('region')
        user.city = self.cleaned_data.get('city')
        user.is_graduated = self.cleaned_data.get('is_graduated')
        user.is_admin = self.cleaned_data.get('is_admin')
        user.set_password(self.cleaned_data.get('password1'))
        user.save()
        adapter.save_user(request, user, self)
        return user

class EgresadoSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Egresado 
        fields = (
            'user',
            'date_of_birth',
            'genre',
            'interests',
            'friends'
        )

class AdminSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Admin 
        fields = (
            'user',
            'address',
            'phone'
        )

class EventoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evento
        fields = (
            'name',
            'description',
            'place',
            'date',
            'hour',
            'organizer',
            'created_at',
            'admin',
            'interests'
        )

class InteresSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interes
        fields = "__all__"