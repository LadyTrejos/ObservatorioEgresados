from django import forms
from django.contrib import admin
from django.contrib.auth.models import Group
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import ReadOnlyPasswordHashField

from .models import User, Egresado, Admin, Evento, Interes

class UserCreationForm(forms.ModelForm):
    """A form for creating new users. Includes all the required
    fields, plus a repeated password."""
    password1 = forms.CharField(label='Password', widget=forms.PasswordInput)
    password2 = forms.CharField(label='Password confirmation', widget=forms.PasswordInput)
    is_graduated = forms.BooleanField()
    is_admin = forms.BooleanField()

    class Meta:
        model = User
        fields = (
            'id',
            'id_type',
            'name',
            'last_name',
            'email',
            'country',
            'region',
            'city'
        )

    def clean_password2(self):
        # Check that the two password entries match
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Las contraseñas no coinciden")
        return password2

    def save(self, commit=True):
        # Save the provided password in hashed format
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user


class UserChangeForm(forms.ModelForm):
    """A form for updating users. Includes all the fields on
    the user, but replaces the password field with admin's
    password hash display field.
    """
    password = ReadOnlyPasswordHashField()

    class Meta:
        model = User
        fields = fields = (
            'id',
            'id_type',
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

    def clean_password(self):
        # Regardless of what the user provides, return the initial value.
        # This is done here, rather than on the field, because the
        # field does not have access to the initial value
        return self.initial["password"]


class MyUserAdmin(UserAdmin):
    # The forms to add and change user instances
    form = UserChangeForm
    add_form = UserCreationForm
    class Meta():
        model = User
    # The fields to be used in displaying the User model.
    # These override the definitions on the base UserAdmin
    # that reference specific fields on auth.User.
    list_display = ('id',
            'name',
            'id_type',
            'last_name',
            'email',
            'password',
            'country',
            'region',
            'city',
            'is_graduated',
            'is_admin')
    list_filter = ('is_admin','is_graduated')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Información personal', {'fields': (('id', 'id_type'), 'name','last_name','country', 'region','city')}),
        ('Tipo de usuario', {'fields': ('is_admin','is_graduated')}),
    )
    # add_fieldsets is not a standard ModelAdmin attribute. UserAdmin
    # overrides get_fieldsets to use this attribute when creating a user.
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (('id',
            'id_type'),
            'name',
            'last_name',
            'email',
            'password1',
            'password2',
            'country',
            'region',
            'city',
            'is_graduated',
            'is_admin')}
        ),
    )
    search_fields = ('email',)
    ordering = ('email',)
    filter_horizontal = ()

admin.site.register(User, MyUserAdmin)
admin.site.register(Egresado)
admin.site.register(Admin)
admin.site.register(Evento)
admin.site.register(Interes)
admin.site.unregister(Group)

