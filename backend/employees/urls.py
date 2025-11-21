from django.urls import path
from . import views

urlpatterns = [
    # 🔹 USERS
    path('users/', views.users_list_create, name='users_list_create'),

    # 🔹 EMPLOYÉS
    path('employees/', views.employees_list_create, name='employees_list_create'),

    # 🔹 DÉPARTEMENTS
    path('departements/', views.departements_list_create, name='departements_list_create'),
    
    # Récupérer, modifier, supprimer
    path('departements/<int:pk>/', views.departement_detail, name='departement_detail'),
]
