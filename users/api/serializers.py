from allauth.account.adapter import get_adapter
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from rest_auth.registration.serializers import RegisterSerializer
from rest_framework import serializers
from rest_framework.authtoken.models import Token
from rest_framework.exceptions import APIException
from smtplib import SMTPException
from users.models import User, Egresado, Admin, Evento, Interes, FriendRequest

class ServiceUnavailable(APIException):
    status_code = 500
    default_detail = 'No se pudo enviar el correo.'
    default_code = 'email_server_not_found'


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
    is_active = serializers.BooleanField(default=True)

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
            'is_admin',
            'is_active'
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
            'is_active': self.validated_data.get('is_active','')
        }

    def save(self, request):
        adapter = get_adapter()
        user = adapter.new_user(request)
        self.cleaned_data = self.get_cleaned_data()
        user.id = self.cleaned_data.get('id')
        user.email = self.cleaned_data.get('email')
        user.id_type = self.cleaned_data.get('id_type')
        user.name = self.cleaned_data.get('name')
        user.last_name = self.cleaned_data.get('last_name')
        user.country = self.cleaned_data.get('country')
        user.region = self.cleaned_data.get('region')
        user.city = self.cleaned_data.get('city')
        user.is_graduated = self.cleaned_data.get('is_graduated')
        user.is_admin = self.cleaned_data.get('is_admin')
        user.is_active = self.cleaned_data.get('is_active')
        password = self.cleaned_data.get('password1')
        user.set_password(password)


        # message = 'Haz sido seleccionado como administrador para la aplicacion Observatorio de Egresados. \nEsta es tu contrasena temporal: %s \nPor favor ingresa con este correo y la contraseña temporal. Luego ve a la seccion "Mi perfil" y cambia la contrasena' % password
        if ( self.cleaned_data.get('is_admin')):
            # Enviar correo con contraseña temporal al administrador
            ctx = {
                'name': self.cleaned_data.get('name'),
                'email': self.cleaned_data.get('email'),
                'password': self.cleaned_data.get('password1'),
            }
            subject = 'Bienvenido(a) a Observatorio UTP'
            from_email = 'Observatorio UTP <observatorioutp@utp.edu.co>'
            to = self.cleaned_data.get('email')
            html_message = render_to_string('../templates/welcome_admin.html', ctx)
            plain_message = strip_tags(html_message)
            try:
                send_mail(subject, plain_message, from_email, [to], html_message=html_message,
                fail_silently=False,)
            except SMTPException:
                print('No se ha podido conectar al servidor de correo.')
        user.save()
        adapter.save_user(request, user, self)
        return user

class EgresadoSerializer(serializers.ModelSerializer):
    date_of_birth = serializers.DateField(required=False, allow_null=True,format="%d-%m-%Y", input_formats=['%d-%m-%Y'])
    genre = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = Egresado
        fields = "__all__"
        """fields= (
        'user',
        'date_of_birth',
        'genre',
        'interests',
        'friends',
        'events'

        )"""

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

class FriendRequestListSerializer(serializers.ModelSerializer):
    from_user = UserSerializer(read_only=True)
    to_user = UserSerializer(read_only=True)
    class Meta:
        model = FriendRequest
        fields = ('id', 'from_user', 'to_user', 'timestamp')

class FriendRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = FriendRequest
        fields = '__all__'

class FriendCircleSerializer(serializers.ModelSerializer):
    friends = UserSerializer(read_only=True)
    class Meta:
        model = UserSerializer
        fields = '__all__'

class TokenSerializer(serializers.ModelSerializer):

    class Meta:
        model = Token
        fields = ('key', 'user')
