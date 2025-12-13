from django.urls import path
from . import views

urlpatterns = [
    # 🔹 USERS
    path('users/', views.users_list_create, name='users_list_create'),

    # 🔹 EMPLOYÉS
    path('employees/', views.employees_list_create, name='employees_list_create'),

    # 🔹 SERVICES (anciennement départements)
    path('services/', views.services_list_create, name='services_list_create'),
    path('services/<int:pk>/', views.service_detail, name='service_detail'),
]
