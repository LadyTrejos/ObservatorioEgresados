from django.contrib import admin
from django.conf import settings
from django.conf.urls import url
from django.conf.urls.static import static
from django.urls import path, include, re_path
from django.views.generic import TemplateView

urlpatterns = [
    path('api-auth/', include('rest_framework.urls')),
    path('rest-auth/', include('rest_auth.urls')),
    path('rest-auth/registration/', include('rest_auth.registration.urls')),
    url(r'^password-reset/confirm/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$',
        TemplateView.as_view(template_name="../templates/password_reset_confirm.html"),
        name='password_reset_confirm'),
    
    path('admin/', admin.site.urls),
    path('api/', include('users.api.urls')),
    re_path('.*', TemplateView.as_view(template_name='index.html'))
    ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
