# evaluation/admin.py
from django.contrib import admin
from .models import (
    IndicateurSF, IndicateurSE,
    SavoirFaire, SavoirEtre,
    Evaluation, EvaluationSFDetail, EvaluationSEDetail
)


@admin.register(IndicateurSF)
class IndicateurSFAdmin(admin.ModelAdmin):
    list_display = ('id', 'nom_indicateur', 'unite_mesure')
    search_fields = ('nom_indicateur',)
    list_filter = ('unite_mesure',)


@admin.register(SavoirFaire)
class SavoirFaireAdmin(admin.ModelAdmin):
    list_display = ('id', 'departement', 'indicateur', 'poids_pourcentage', 'objectif')
    search_fields = ('id_departement__nom_departement', 'id_indicateur_sf__nom_indicateur')
    
    # CORRIGÉ : bon champ
    list_filter = ('id_departement__nom_departement',)

    def departement(self, obj):
        return obj.id_departement.nom_departement
    departement.short_description = 'Département'

    def indicateur(self, obj):
        return obj.id_indicateur_sf.nom_indicateur
    indicateur.short_description = 'Indicateur SF'


@admin.register(Evaluation)
class EvaluationAdmin(admin.ModelAdmin):
    list_display = ('id', 'employe', 'mois_annee', 'note_sf', 'note_se', 'note_globale')
    search_fields = ('id_employe__nom', 'id_employe__prenom', 'id_employe__matricule')
    list_filter = ('annee', 'mois')

    def employe(self, obj):
        return obj.id_employe.nom_complet() if hasattr(obj.id_employe, 'nom_complet') else str(obj.id_employe)
    employe.short_description = 'Employé'

    def mois_annee(self, obj):
        return f"{obj.get_mois_display()} {obj.annee}"
    mois_annee.short_description = 'Période'


@admin.register(EvaluationSFDetail)
class EvaluationSFDetailAdmin(admin.ModelAdmin):
    list_display = ('id', 'evaluation', 'indicateur', 'note', 'note_ponderee')
    list_filter = ('id_sf__id_indicateur_sf__nom_indicateur',)

    def evaluation(self, obj):
        return f"Éval #{obj.id_evaluation.id}"
    evaluation.short_description = 'Évaluation'

    def indicateur(self, obj):
        return obj.id_sf.id_indicateur_sf.nom_indicateur
    indicateur.short_description = 'Critère'


# Autres modèles (SE) → même principe
@admin.register(IndicateurSE)
class IndicateurSEAdmin(admin.ModelAdmin):
    list_display = ('id', 'nom_indicateur')
    search_fields = ('nom_indicateur',)


@admin.register(SavoirEtre)
class SavoirEtreAdmin(admin.ModelAdmin):
    list_display = ('id', 'indicateur', 'poids_pourcentage')
    def indicateur(self, obj):
        return obj.id_indicateur_se.nom_indicateur
    indicateur.short_description = 'Critère SE'


@admin.register(EvaluationSEDetail)
class EvaluationSEDetailAdmin(admin.ModelAdmin):
    list_display = ('id', 'evaluation', 'indicateur', 'note')
    def evaluation(self, obj):
        return f"Éval #{obj.id_evaluation.id}"
    def indicateur(self, obj):
        return obj.id_se.id_indicateur_se.nom_indicateur