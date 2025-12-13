# employees/admin.py
from django.contrib import admin
from .models import Service, Employe  # <-- Remplacé Departement par Service

# -------------------------------
# Admin pour Service
# -------------------------------
@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    """
    Admin pour les services (anciennement départements)
    """
    list_display = ('id', 'nom_service', 'date_creation')  # Colonnes visibles
    search_fields = ('nom_service',)                        # Recherche par nom
    list_filter = ('date_creation',)                        # Filtres
    ordering = ('nom_service',)                             # Tri par défaut


# -------------------------------
# Admin pour Employe
# -------------------------------
@admin.register(Employe)
class EmployeAdmin(admin.ModelAdmin):
    """
    Admin pour les employés – adapté à ton modèle avec service
    """
    # Colonnes visibles dans la liste
    list_display = (
        'matricule',
        'nom_complet',  # Méthode personnalisée pour Nom + Prénom
        'poste',
        'service',      # Nom du service
        'email',
        'actif',
        'date_embauche'
    )

    # Champs utilisés pour la recherche
    search_fields = ('matricule', 'nom', 'prenom', 'email', 'poste')

    # Filtres à droite
    list_filter = (
        'service__nom_service',  # Champ FK Service
        'actif',
        'date_embauche'
    )

    # Champs en lecture seule
    readonly_fields = ('date_creation',)

    # === Méthode : Nom complet ===
    def nom_complet(self, obj):
        """Retourne 'Nom Prénom'"""
        prenom = obj.prenom or ''
        return f"{obj.nom} {prenom}".strip()
    nom_complet.short_description = 'Nom complet'

    # === Méthode : Nom du service ===
    def service(self, obj):
        """Retourne le nom du service ou '-'"""
        return obj.service.nom_service if obj.service else '-'
    service.short_description = 'Service'
