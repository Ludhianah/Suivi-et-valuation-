from django.contrib import admin
from .models import IndicateurSF, IndicateurSE, SavoirFaire, SavoirEtre, Evaluation

# Indicateur SF
@admin.register(IndicateurSF)
class IndicateurSFAdmin(admin.ModelAdmin):
    list_display = ('id', 'nom_indicateur', 'unite_mesure')
    search_fields = ('nom_indicateur',)
    list_filter = ('unite_mesure',)

# Savoir-Faire
@admin.register(SavoirFaire)
class SavoirFaireAdmin(admin.ModelAdmin):
    list_display = ('id', 'service', 'indicateur', 'poids_pourcentage', 'objectif')
    search_fields = ('id_service__nom_service', 'id_indicateur_sf__nom_indicateur')
    list_filter = ('id_service__nom_service',)

    def service(self, obj):
        return obj.id_service.nom_service
    service.short_description = 'Service'

    def indicateur(self, obj):
        return obj.id_indicateur_sf.nom_indicateur
    indicateur.short_description = 'Indicateur SF'

# Indicateur SE
@admin.register(IndicateurSE)
class IndicateurSEAdmin(admin.ModelAdmin):
    list_display = ('id', 'nom_indicateur')
    search_fields = ('nom_indicateur',)

# Savoir-Être
@admin.register(SavoirEtre)
class SavoirEtreAdmin(admin.ModelAdmin):
    list_display = ('id', 'indicateur', 'poids_pourcentage')
    
    def indicateur(self, obj):
        return obj.id_indicateur_se.nom_indicateur
    indicateur.short_description = 'Critère SE'

# Évaluation
@admin.register(Evaluation)
class EvaluationAdmin(admin.ModelAdmin):
    list_display = ('id', 'employe', 'mois_annee', 'id_indicateur', 'objectif', 'realisation', 'note_percent')
    search_fields = ('id_employe__nom', 'id_employe__prenom', 'id_employe__matricule')
    list_filter = ('annee', 'mois')

    def employe(self, obj):
        return obj.id_employe.nom_complet() if hasattr(obj.id_employe, 'nom_complet') else str(obj.id_employe)
    employe.short_description = 'Employé'

    def mois_annee(self, obj):
        return f"{obj.get_mois_display()} {obj.annee}"
    mois_annee.short_description = 'Période'
