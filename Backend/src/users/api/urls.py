from users.api.views import UserViewSet, EgresadoViewSet, AdminViewSet, EventoViewSet, InteresViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='users')
router.register(r'egresados', EgresadoViewSet, basename='egresados')
router.register(r'admins', AdminViewSet, basename='admins')
router.register(r'eventos', EventoViewSet, basename='eventos')
router.register(r'intereses', InteresViewSet, basename='intereses')
urlpatterns = router.urls