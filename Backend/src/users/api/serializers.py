from rest_framework import serializers
from rest_auth.registration.serializers import RegisterSerializer
from allauth.account.adapter import get_adapter
from users.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id',
            'name',
            'lastname',
            'email',
            'password',
            'country',
            'region',
            'city',
            'is_graduated',
            'is_admin'
        )

class CustomRegisterSerializer(RegisterSerializer):
    is_graduated = serializers.BooleanField()
    is_admin = serializers.BooleanField()
    class Meta: 
        model = User
        fields = (
            'id',
            'name',
            'lastname',
            'email',
            'password',
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
        user.is_graduated = self.cleaned_data.get('is_graduated')
        user.is_admin = self.cleaned_data.get('is_admin')
        user.save()
        adapter.save_user(request, user, self)
        return user