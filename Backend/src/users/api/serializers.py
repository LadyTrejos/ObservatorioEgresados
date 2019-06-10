from rest_framework import serializers
from rest_auth.registration.serializers import RegisterSerializer
from allauth.account.adapter import get_adapter
from users.models import User, Egresado, Admin, Evento, Interes
from rest_framework.authtoken.models import Token
from drf_extra_fields.fields import Base64ImageField


class UserSerializer(serializers.ModelSerializer):
    is_superuser = serializers.BooleanField(read_only=True)
    password = serializers.CharField(style={'input_type': 'password'})
    class Meta:
        model = User
        fields = (
             "id",
            "password",
            "id_type",
            "name",
            "last_name",
            "email",
            "country",
            "region",
            "city",
            "is_graduated",
            "is_admin",
            "is_active",
            "is_superuser"
        )

class CustomRegisterSerializer(RegisterSerializer):
    
    id = serializers.CharField(required=True)
    id_type = serializers.CharField(required=True)
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
            'id',
            'id_type',
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
            'id_type': self.validated_data.get('id_type', ''),
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
        user.id_type = self.cleaned_data.get('id_type')
        user.name = self.cleaned_data.get('name')
        user.last_name = self.cleaned_data.get('last_name')
        user.country = self.cleaned_data.get('country')
        user.region = self.cleaned_data.get('region')
        user.city = self.cleaned_data.get('city')
        user.is_graduated = self.cleaned_data.get('is_graduated')
        user.is_admin = self.cleaned_data.get('is_admin')
        user.set_password(self.cleaned_data.get('password'))
        user.save()
        adapter.save_user(request, user, self)
        return user

class EgresadoSerializer(serializers.ModelSerializer):
    date_of_birth = serializers.DateField(required=False, allow_null=True)
    genre = serializers.CharField(required=False, allow_blank=True)

    class Meta: 
        model = Egresado 
        fields = "__all__"

class AdminSerializer(serializers.ModelSerializer):
    address = serializers.CharField(required=False, allow_blank=True)
    id_phone = serializers.IntegerField(required=False, allow_null=True)
    phone = serializers.IntegerField(required=False, allow_null=True)
    class Meta: 
        model = Admin 
        fields = (
            'user',
            'address',
            'id_phone',
            'phone'
            )

class EventoSerializer(serializers.ModelSerializer):
    url = serializers.CharField()
    class Meta:
        model = Evento
        fields = "__all__"

class InteresSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interes
        fields = ('id', 'name')

class EventoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evento
        fields = "__all__"


class TokenSerializer(serializers.ModelSerializer):

    class Meta:
        model = Token
        fields = ('key', 'user')