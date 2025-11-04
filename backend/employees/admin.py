# employees/admin.py
from django.contrib import admin
from .models import Departement, Employe


@admin.register(Departement)
class DepartementAdmin(admin.ModelAdmin):
    """
    Admin pour les départements
    """
    list_display = ('id', 'nom_departement', 'date_creation')
    search_fields = ('nom_departement',)
    list_filter = ('date_creation',)
    ordering = ('nom_departement',)


@admin.register(Employe)
class EmployeAdmin(admin.ModelAdmin):
    """
    Admin pour les employés – adapté à ton modèle sans date_modification
    """
    # Colonnes visibles
    list_display = (
        'matricule',
        'nom_complet',        # Méthode personnalisée
        'poste',
        'departement',        # Nom du département
        'email',
        'actif',
        'date_embauche'
    )

    # Recherche
    search_fields = ('matricule', 'nom', 'prenom', 'email', 'poste')

    # Filtres à droite
    list_filter = (
        'id_departement__nom_departement',  # CORRIGÉ : bon champ FK
        'actif',
        'date_embauche'
    )

    # Champ en lecture seule (existe dans ton modèle)
    readonly_fields = ('date_creation',)

    # === Méthode : Nom complet ===
    def nom_complet(self, obj):
        """Retourne 'Nom Prénom'"""
        prenom = obj.prenom or ''
        return f"{obj.nom} {prenom}".strip()
    nom_complet.short_description = 'Nom complet'

    # === Méthode : Nom du département ===
    def departement(self, obj):
        """Retourne le nom du département ou '-'"""
        return obj.id_departement.nom_departement if obj.id_departement else '-'
    departement.short_description = 'Département'