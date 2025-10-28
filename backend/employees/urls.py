from .views import create_user
from django.urls import path

urlpatterns = [
    path('create_user/', create_user, name='create_user'),
]