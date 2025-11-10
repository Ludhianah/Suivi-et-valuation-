from .views import create_user, list_users
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DepartementViewSet, EmployeViewSet


router = DefaultRouter()
router.register(r'departements', DepartementViewSet)
router.register(r'', EmployeViewSet)

urlpatterns = [
    path('create_user/', create_user, name='create_user'),
    path('list_users/', list_users, name='list_users'),
    path('', include(router.urls)),
]