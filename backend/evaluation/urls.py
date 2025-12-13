# evaluation/urls.py
from django.urls import path
from . import views

urlpatterns = [
    # =========================
    # 🔹 INDICATEUR SAVOIR-FAIRE (SF)
    # =========================
    path('indicateurs-sf/', views.indicateur_sf_api, name='indicateursf-list'),
    path('indicateurs-sf/<int:pk>/', views.indicateur_sf_api, name='indicateursf-detail'),

    # =========================
    # 🔹 SAVOIR-FAIRE
    # =========================
    path('savoir-faire/', views.savoir_faire_api, name='savoirfaire-list'),
    path('savoir-faire/<int:pk>/', views.savoir_faire_api, name='savoirfaire-detail'),

    # =========================
    # 🔹 INDICATEUR SAVOIR-ÊTRE (SE)
    # =========================
    path('indicateurs-se/', views.indicateur_se_api, name='indicateurse-list'),
    path('indicateurs-se/<int:pk>/', views.indicateur_se_api, name='indicateurse-detail'),

    # =========================
    # 🔹 SAVOIR-ÊTRE
    # =========================
    path('savoir-etre/', views.savoir_etre_api, name='savoir-etre-list'),
    path('savoir-etre/<int:pk>/', views.savoir_etre_api, name='savoir-etre-detail'),

    # =========================
    # 🔹 ÉVALUATIONS
    # =========================
    path('evaluations/', views.evaluation_api, name='evaluation-list'),
    path('evaluations/<int:pk>/', views.evaluation_api, name='evaluation-detail'),

]
