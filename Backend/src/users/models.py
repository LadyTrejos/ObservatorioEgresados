from django.db import models
from django.core.mail import send_mail
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.contrib.auth.base_user import BaseUserManager
from django.utils import timezone
import datetime

class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        """
        Creates and saves a User with the given email and password.
        """
        if not email:
            raise ValueError('The given email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    id = models.CharField(max_length=20, primary_key=True, editable=False)
    name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True, editable=False)
    country = models.CharField(max_length=50)
    region = models.CharField(max_length=50)
    city = models.CharField(max_length=50)

    is_graduated = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    is_active = models.BooleanField(default=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = [ 'id', 'name', 'last_name', 'country', 'region', 'city' ]

    def __str__(self):
        return self.email

    def get_full_name(self):
        '''
        Returns the name plus the last_name, with a space in between.
        '''
        full_name = '%s %s' % (self.name, self.last_name)
        return full_name.strip()

    def get_short_name(self):
        '''
        Returns the short name for the user.
        '''
        return self.name

    def email_user(self, subject, message, from_email=None, **kwargs):
        '''
        Sends an email to this User.
        '''
        send_mail(subject, message, from_email, [self.email], **kwargs)


class Interest(models.Model):
    name = models.CharField(max_length=120)
    
GENDER_CHOICES = (
    ('M', 'Masculino'),
    ('F', 'Femenino'),
    ('P', 'Prefiere no responder'),
)

class Egresado(models.Model):

    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    date_of_birth = models.DateField(default=datetime.date.today)
    genre = models.CharField(max_length=1, choices=GENDER_CHOICES, default='M')
    interests = models.ManyToManyField(Interest, related_name='interests')
    friends = models.ManyToManyField("self", symmetrical=False)

class Admin(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    address = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=20, blank=True)

class Evento(models.Model):
    name = models.CharField(max_length=120)
    description = models.TextField()
    place = models.CharField(max_length=150)
    date = models.DateField(default=datetime.date.today)
    hour = models.TimeField(default=timezone.now)
    organizer = models.CharField(max_length=120)
    created_at = models.DateField(auto_now_add=True)
    admin = models.ForeignKey(Admin, on_delete=models.CASCADE, related_name='admin')
    interests = models.ManyToManyField(Interest, related_name='insterests')
