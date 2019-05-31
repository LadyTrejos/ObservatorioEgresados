from django.db import models
from djongo import models as djongomodels
from django.core.mail import send_mail
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.contrib.auth.base_user import BaseUserManager
from django.utils import timezone
import datetime

class UserManager(BaseUserManager):
    use_in_migrations = True

    def create_user(self, email, id, name, last_name, country, region, city, password=None):
        """
        Creates and saves a User with the given email, other fields
        and password.
        """
        if not email:
            raise ValueError('Los usuarios deben tener un correo electrónico')

        user = self.model(
            email = self.normalize_email(email),
            id = id,
            name = name,
            last_name = last_name,
            country = country,
            region = region,
            city = city
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_admin(self, email, id, name, last_name, country, region, city, password):
        """
        Creates and saves an admin with the given email, other fields
        and password.
        """
        user = self.create_user(
            email = self.normalize_email(email),
            id = id,
            name = name,
            last_name = last_name,
            country = country,
            region = region,
            city = city
        )
        user.is_admin = True
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, id, name, last_name, country, region, city, password):
        """
        Creates and saves a superuser with the given email, other fields
        and password.
        """
        user = self.create_user(
            email,
            password=password,
            id = id,
            name = name,
            last_name = last_name,
            country = country,
            region = region,
            city = city
        )
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user

class User(AbstractBaseUser, PermissionsMixin):
    id = models.CharField(max_length=20, primary_key=True)
    name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    country = models.CharField(max_length=50)
    region = models.CharField(max_length=50)
    city = models.CharField(max_length=50)

    is_graduated = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)

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


class Interes(models.Model):
    _id = djongomodels.ObjectIdField(primary_key=True)
    name = models.CharField(max_length=120)
    
    def __str__(self):
        return self.name

GENDER_CHOICES = (
    ('M', 'Masculino'),
    ('F', 'Femenino'),
    ('P', 'Prefiere no responder'),
)

class Egresado(models.Model):

    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    date_of_birth = models.DateField(default=datetime.date.today)
    genre = models.CharField(max_length=1, choices=GENDER_CHOICES, default='M')
    interests = models.ManyToManyField(Interes, blank=True)
    friends = models.ManyToManyField("self", blank=True)

    def __str__(self):
        return self.user.get_full_name()

class Admin(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    address = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    
    def __str__(self):
        return self.user.get_full_name()

class Evento(models.Model):
    _id = djongomodels.ObjectIdField(primary_key=True)
    name = models.CharField(max_length=120)
    description = models.TextField()
    place = models.CharField(max_length=150)
    date = models.DateField(default=datetime.date.today)
    hour = models.TimeField(default=timezone.now)
    organizer = models.CharField(max_length=120)
    created_at = models.DateField(auto_now_add=True)
    admin = models.ForeignKey(Admin, on_delete=models.CASCADE, related_name='admin')
    interests = models.ManyToManyField(Interes, related_name='insterests',blank=True)

    def __str__(self):
        return self.name 
