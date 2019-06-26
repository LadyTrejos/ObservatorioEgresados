from users.api.views import (UserViewSet, EgresadoViewSet,
    AdminViewSet, EventoViewSet, InteresViewSet, AdminListView, CurrentUserView,EventoListView)
=======
from users.api.views import (UserViewSet, EgresadoViewSet,
    AdminViewSet, EventoViewSet, InteresViewSet, AdminListView,EgresadoListView)
>>>>>>> Stashed changes
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='users')
router.register(r'egresados', EgresadoViewSet, basename='egresados')
router.register(r'admins', AdminViewSet, basename='admins')
router.register(r'eventos', EventoViewSet, basename='eventos')
router.register(r'intereses', InteresViewSet, basename='intereses')
router.register(r'admin-list',AdminListView, basename='admin-list')
router.register(r'event-list',EventoListView, basename='evento-list')
router.register(r'current-user', CurrentUserView, base_name="current-user")
urlpatterns = router.urls
=======
router.register(r'egresado-list',EgresadoListView, basename='egresado-list')
urlpatterns = router.urls
>>>>>>> Stashed changes
