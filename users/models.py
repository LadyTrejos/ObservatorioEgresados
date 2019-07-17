from django.db import models
from django.core.mail import send_mail
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.contrib.auth.base_user import BaseUserManager
from django.utils import timezone
from django.forms import ModelForm, PasswordInput
from django.db.models import signals
from django.dispatch import receiver
from django.db.models.signals import pre_save, post_save
from django.conf import settings
from djongo import models as djongomodels
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
            id = id,
            name = name,
            last_name = last_name,
            country = country,
            region = region,
            city = city
        )
        user.is_staff = True
        user.is_graduated = False
        user.is_admin = False
        user.is_superuser = True
        user.set_password(password)
        user.save(using=self._db)
        return user

IDTYPE_CHOICES = (
    ('TI', 'Tarjeta de identidad'),
    ('CC', 'Cédula'),
    ('PA', 'Pasaporte'),
    ('CE', 'Cédula de extranjería')
)

class User(AbstractBaseUser, PermissionsMixin):
    id = models.CharField(max_length=20, primary_key=True,unique=True)
    id_type = models.CharField(max_length=2, choices=IDTYPE_CHOICES, default='CC')
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
    name = models.CharField(max_length=120, unique=True)

    def __str__(self):
        return self.name

GENDER_CHOICES = (
    ('M', 'Masculino'),
    ('F', 'Femenino'),
    ('P', 'Prefiere no responder'),
)

class Admin(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    address = models.CharField(max_length=100, blank=True, null=True)
    id_phone = models.IntegerField(blank=True, null=True)
    phone = models.IntegerField(null=True)

    def __str__(self):
        return self.user.get_full_name()


class Evento(models.Model):
    name = models.CharField(max_length=120)
    description = models.TextField()
    place = models.CharField(max_length=150)
    date = models.DateField(default=datetime.date.today)
    hour = models.TimeField(default=timezone.now)
    organizer = models.CharField(max_length=120)
    created_at = models.DateTimeField(auto_now_add=True)
    admin = models.ForeignKey(Admin, on_delete=models.CASCADE, related_name='admin')
    interests = models.ManyToManyField(Interes, related_name='insterests',blank=True)
    url = models.ImageField()

    def __str__(self):
        return self.name

class Egresado(models.Model):

    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    date_of_birth = models.DateField(default="2000-01-01")
    genre = models.CharField(max_length=1, choices=GENDER_CHOICES, default='M')
    interests = models.ManyToManyField(Interes, blank=True)
    friends = models.ManyToManyField("self", blank=True, related_name='friends')
    events = models.ManyToManyField(Evento, related_name="events",blank=True)

    def __str__(self):
        return self.user.get_full_name()

class FriendRequest(models.Model):
    from_user = models.ForeignKey(User, related_name='from_user', on_delete=models.CASCADE)
    to_user = models.ForeignKey(User, related_name='to_user', on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

# FORMS

class UserForm(ModelForm):
    class Meta:
        model = User
        widgets = {
            'password': PasswordInput(),
        }
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

#signal used for is_active=False to is_active=True
@receiver(pre_save, sender=User, dispatch_uid='active')
def active(sender, instance, **kwargs):
    if instance.is_active and User.objects.filter(pk=instance.id, is_active=False).exists():
        subject = 'Active account'
        mesagge = '%s your account is now active' %(instance.name)
        from_email = 'Observatorio UTP <observatorioutp@gmail.com>'
        send_mail(subject, mesagge, from_email, [instance.email], fail_silently=False)