from django.db import models

# -------------------------------
# Modèle Service (anciennement Département)
# -------------------------------
class Service(models.Model):
    # Nom du service, unique dans la base
    nom_service = models.CharField(
        max_length=100,
        unique=True,
        verbose_name="Nom du service"
    )
    # Date de création automatique à l'ajout
    date_creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'service'        # Nom de la table dans la base
        ordering = ['nom_service']  # Tri par nom_service par défaut

    def __str__(self):
        # Affichage lisible dans l’admin ou debug
        return self.nom_service


# -------------------------------
# Modèle Employe
# -------------------------------
class Employe(models.Model):
    # Numéro matricule unique pour chaque employé
    matricule = models.CharField(
        max_length=100,
        unique=True,
        verbose_name="Matricule"
    )
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100, blank=True, null=True)
    poste = models.CharField(max_length=100, blank=True, null=True)

    # Relation avec le service de l'employé
    service = models.ForeignKey(
        Service,                  # Référence au modèle Service
        on_delete=models.SET_NULL, # Si le service est supprimé, garder l'employé avec service NULL
        null=True,                # Peut être NULL
        related_name='employes',  # Permet d’accéder à tous les employés d’un service : service.employes.all()
        db_column='id_service'    # Nom de la colonne dans la base
    )

    # Informations facultatives
    email = models.EmailField(blank=True, null=True, unique=True)
    telephone = models.CharField(max_length=20, blank=True, null=True)
    date_embauche = models.DateField(blank=True, null=True)
    actif = models.BooleanField(default=True)  # Statut actif ou non
    date_creation = models.DateTimeField(auto_now_add=True)  # Date de création automatique

    class Meta:
        db_table = 'employe'        # Nom de la table dans la base
        ordering = ['nom', 'prenom'] # Tri par nom puis prénom

    def __str__(self):
        # Affichage lisible dans l’admin ou debug
        return f"{self.nom} {self.prenom or ''}"
