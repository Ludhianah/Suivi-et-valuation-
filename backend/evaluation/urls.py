# evaluation/urls.py
from django.urls import path
from . import views

urlpatterns = [
    # IndicateurSF
    path('indicateurs-sf', views.indicateur_sf_api, name='indicateursf-list'),
    path('indicateurs-sf/<int:pk>/', views.indicateur_sf_api, name='indicateursf-detail'),

    # SavoirFaire
    path('savoir-faire/', views.savoir_faire_api, name='savoirfaire-list'),
    path('savoir-faire/<int:pk>/', views.savoir_faire_api, name='savoirfaire-detail'),

    # IndicateurSE
    path('indicateurs-se/', views.indicateur_se_api, name='indicateurse-list'),
    path('indicateurs-se/<int:pk>/', views.indicateur_se_api, name='indicateurse-detail'),

    # SavoirEtre
    path('savoir-etre/', views.savoir_etre_api, name='savoir-etre-list'),
    path('savoir-etre/<int:pk>/', views.savoir_etre_api, name='savoir-etre-detail'),

    # Evaluation
    path('evaluations/', views.evaluation_api, name='evaluation-list'),
    path('evaluations/<int:pk>/', views.evaluation_api, name='evaluation-detail'),

    # Détails SF
    path('evaluations/sf-details/', views.evaluation_sf_detail_api, name='sf-detail-list'),
    path('evaluations/sf-details/<int:pk>/', views.evaluation_sf_detail_api, name='sf-detail-detail'),

    # Détails SE
    path('evaluations/se-details/', views.evaluation_se_detail_api, name='se-detail-list'),
    path('evaluations/se-details/<int:pk>/', views.evaluation_se_detail_api, name='se-detail-detail'),
]