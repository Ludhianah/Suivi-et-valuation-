from django.db import models

# Create your models here.


class Departement(models.Model):
    nom_departement = models.CharField(max_length=100, unique=True, verbose_name="Nom du département")
    date_creation = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'departement'
        ordering = ['nom_departement']
    
    def __str__(self):
        return self.nom_departement


class Employe(models.Model):
    matricule = models.CharField(max_length=100, unique=True, verbose_name="Matricule", default=None)
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100, blank=True, null=True)
    poste = models.CharField(max_length=100, blank=True, null=True)
    id_departement = models.ForeignKey(
        Departement, 
        on_delete=models.SET_NULL, 
        null=True,
        related_name='employes',
        db_column='id_departement'
    )
    email = models.EmailField(blank=True, null=True, unique=True)
    telephone = models.CharField(max_length=20, blank=True, null=True)
    date_embauche = models.DateField(blank=True, null=True)
    actif = models.BooleanField(default=True)
    date_creation = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'employe'
        ordering = ['nom', 'prenom']
    
    def __str__(self):
        return f"{self.nom} {self.prenom or ''}"
