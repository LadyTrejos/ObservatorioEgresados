from django.contrib import admin

from .models import User, Egresado, Admin, Evento, Interes

admin.site.register(User)
admin.site.register(Egresado)
admin.site.register(Admin)
admin.site.register(Evento)
admin.site.register(Interes)
