# evaluation/admin.py
from django.contrib import admin
from .models import (
    IndicateurSF, IndicateurSE,
    SavoirFaire, SavoirEtre,
    Evaluation, EvaluationSFDetail, EvaluationSEDetail
)


# === INDICATEUR SF ===
@admin.register(IndicateurSF)
class IndicateurSFAdmin(admin.ModelAdmin):
    list_display = ('id', 'nom_indicateur', 'unite_mesure', 'description')
    search_fields = ('nom_indicateur',)
    list_filter = ('unite_mesure',)
    ordering = ('nom_indicateur',)


# === SAVOIR-FAIRE ===
@admin.register(SavoirFaire)
class SavoirFaireAdmin(admin.ModelAdmin):
    list_display = ('id', 'departement', 'indicateur', 'poids_pourcentage', 'objectif')
    search_fields = ('id_departement__nom_departement', 'id_indicateur_sf__nom_indicateur')
    list_filter = ('id_departement__nom_departement',)

    def departement(self, obj):
        return obj.id_departement.nom_departement
    departement.short_description = 'Département'

    def indicateur(self, obj):
        return obj.id_indicateur_sf.nom_indicateur
    indicateur.short_description = 'Indicateur SF'


# === ÉVALUATION (CORRIGÉE) ===
@admin.register(Evaluation)
class EvaluationAdmin(admin.ModelAdmin):
    list_display = ('id', 'employe_nom', 'mois_annee', 'note_sf', 'note_se', 'note_globale')
    search_fields = ('id_employe__nom', 'id_employe__prenom', 'id_employe__matricule')
    list_filter = ('annee', 'mois', 'note_sf', 'note_se')
    readonly_fields = ('note_sf', 'note_se', 'note_globale', 'date_creation', 'date_modification')
    ordering = ('-annee', '-mois')

    # CORRIGÉ : utilise __str__ de Employe → "Dupont Jean"
    def employe_nom(self, obj):
        return str(obj.id_employe)
    employe_nom.short_description = 'Employé'

    def mois_annee(self, obj):
        return f"{obj.get_mois_display()} {obj.annee}"
    mois_annee.short_description = 'Période'

    # Optionnel : lien direct vers l'employé
    def view_employe_link(self, obj):
        from django.urls import reverse
        from django.utils.html import format_html
        url = reverse('admin:employees_employe_change', args=[obj.id_employe.id])
        return format_html('<a href="{}">Voir employé</a>', url)
    view_employe_link.short_description = 'Lien employé'


# === DÉTAIL SF ===
@admin.register(EvaluationSFDetail)
class EvaluationSFDetailAdmin(admin.ModelAdmin):
    list_display = ('id', 'evaluation_link', 'indicateur', 'note', 'note_ponderee', 'commentaire')
    search_fields = ('id_evaluation__id_employe__nom', 'id_sf__id_indicateur_sf__nom_indicateur')
    list_filter = ('id_sf__id_indicateur_sf__nom_indicateur',)
    readonly_fields = ('note_ponderee',)

    def evaluation_link(self, obj):
        from django.urls import reverse
        from django.utils.html import format_html
        url = reverse('admin:evaluation_evaluation_change', args=[obj.id_evaluation.id])
        return format_html('<a href="{}">Éval #{}</a>', url, obj.id_evaluation.id)
    evaluation_link.short_description = 'Évaluation'

    def indicateur(self, obj):
        return obj.id_sf.id_indicateur_sf.nom_indicateur
    indicateur.short_description = 'Critère SF'


# === INDICATEUR SE ===
@admin.register(IndicateurSE)
class IndicateurSEAdmin(admin.ModelAdmin):
    list_display = ('id', 'nom_indicateur', 'description')
    search_fields = ('nom_indicateur',)
    ordering = ('nom_indicateur',)


# === SAVOIR-ÊTRE ===
@admin.register(SavoirEtre)
class SavoirEtreAdmin(admin.ModelAdmin):
    list_display = ('id', 'indicateur', 'poids_pourcentage')
    search_fields = ('id_indicateur_se__nom_indicateur',)
    list_filter = ('poids_pourcentage',)

    def indicateur(self, obj):
        return obj.id_indicateur_se.nom_indicateur
    indicateur.short_description = 'Critère SE'


# === DÉTAIL SE ===
@admin.register(EvaluationSEDetail)
class EvaluationSEDetailAdmin(admin.ModelAdmin):
    list_display = ('id', 'evaluation_link', 'indicateur', 'note', 'note_ponderee')
    search_fields = ('id_evaluation__id_employe__nom',)
    list_filter = ('id_se__id_indicateur_se__nom_indicateur',)
    readonly_fields = ('note_ponderee',)

    def evaluation_link(self, obj):
        from django.urls import reverse
        from django.utils.html import format_html
        url = reverse('admin:evaluation_evaluation_change', args=[obj.id_evaluation.id])
        return format_html('<a href="{}">Éval #{}</a>', url, obj.id_evaluation.id)
    evaluation_link.short_description = 'Évaluation'

    def indicateur(self, obj):
        return obj.id_se.id_indicateur_se.nom_indicateur
    indicateur.short_description = 'Critère SE'