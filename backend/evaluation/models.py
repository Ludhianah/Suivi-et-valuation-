from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

# ===============================
# 🔹 MODÈLE: INDICATEUR SAVOIR-FAIRE (SF)
# ===============================
class IndicateurSF(models.Model):
    nom_indicateur = models.CharField(max_length=100, unique=True, verbose_name="Nom de l'indicateur")
    description = models.TextField(blank=True, null=True)
    unite_mesure = models.CharField(max_length=50, blank=True, null=True, help_text="Ex: AR, Nombre, %, etc.")
    date_creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'indicateur_sf'
        verbose_name = 'Indicateur Savoir-Faire'
        verbose_name_plural = 'Indicateurs Savoir-Faire'
        ordering = ['nom_indicateur']

    def __str__(self):
        return self.nom_indicateur


# ===============================
# 🔹 MODÈLE: INDICATEUR SAVOIR-ÊTRE (SE)
# ===============================
class IndicateurSE(models.Model):
    nom_indicateur = models.CharField(max_length=100, unique=True, verbose_name="Nom de l'indicateur")
    description = models.TextField(blank=True, null=True)
    date_creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'indicateur_se'
        ordering = ['nom_indicateur']

    def __str__(self):
        return self.nom_indicateur


# ===============================
# 🔹 MODÈLE: SAVOIR-FAIRE
# ===============================
class SavoirFaire(models.Model):
    id_service = models.ForeignKey(
        'employees.Service',  # renommé Service
        on_delete=models.CASCADE,
        related_name='savoir_faire',
        db_column='id_service'
    )
    id_indicateur_sf = models.ForeignKey(
        IndicateurSF,
        on_delete=models.CASCADE,
        related_name='savoir_faire',
        db_column='id_indicateur_sf'
    )
    objectif = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True, verbose_name="Objectif"
    )
    poids_pourcentage = models.DecimalField(
        max_digits=5, decimal_places=2,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text="Poids en % (ex: 30 pour 30%)"
    )
    date_creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'savoir_faire'
        unique_together = ['id_service', 'id_indicateur_sf']

    def __str__(self):
        return f"{self.id_service.nom_service} - {self.id_indicateur_sf.nom_indicateur}"


# ===============================
# 🔹 MODÈLE: SAVOIR-ÊTRE
# ===============================
class SavoirEtre(models.Model):
    id_indicateur_se = models.ForeignKey(
        IndicateurSE,
        on_delete=models.CASCADE,
        related_name='savoir_etre',
        db_column='id_indicateur_se'
    )
    poids_pourcentage = models.DecimalField(
        max_digits=5, decimal_places=2,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text="Poids en % (ex: 20 pour 20%)"
    )
    date_creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'savoir_etre'

    def __str__(self):
        return f"{self.id_indicateur_se.nom_indicateur} ({self.poids_pourcentage}%)"


# ===============================
# 🔹 MODÈLE: ÉVALUATION MENSUELLE
# ===============================
class Evaluation(models.Model):
    MOIS_CHOICES = [
        (1, 'Janvier'), (2, 'Février'), (3, 'Mars'), (4, 'Avril'),
        (5, 'Mai'), (6, 'Juin'), (7, 'Juillet'), (8, 'Août'),
        (9, 'Septembre'), (10, 'Octobre'), (11, 'Novembre'), (12, 'Décembre'),
    ]

    id_employe = models.ForeignKey(
        'employees.Employe',
        on_delete=models.CASCADE,
        related_name='evaluations',
        db_column='id_employe'
    )
    id_indicateur = models.ForeignKey(
        IndicateurSF,  # tu peux changer en IndicateurSE si nécessaire
        on_delete=models.CASCADE,
        related_name='evaluations',
        db_column='id_indicateur',
        default=1  # ⚡ Défini un indicateur SF par défaut pour les lignes existantes
    )
    id_service = models.ForeignKey(
        'employees.Service',  # renommé Service
        on_delete=models.CASCADE,
        related_name='evaluations',
        db_column='id_service'
    )

    annee = models.IntegerField(verbose_name="Année")
    mois = models.IntegerField(choices=MOIS_CHOICES, verbose_name="Mois")
    objectif = models.DecimalField(max_digits=10, decimal_places=2)
    realisation = models.DecimalField(max_digits=10, decimal_places=2)

    note_percent = models.DecimalField(
        max_digits=5, decimal_places=2, blank=True, null=True, verbose_name="Note (%)"
    )
    note_sur_20 = models.DecimalField(
        max_digits=5, decimal_places=2, blank=True, null=True, verbose_name="Note /20"
    )

    commentaire = models.TextField(blank=True, null=True)
    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'evaluation'
        unique_together = ['id_employe', 'id_indicateur', 'annee', 'mois']
        ordering = ['-annee', '-mois']

    def __str__(self):
        return f"{self.id_employe} - {self.get_mois_display()} {self.annee}"

    def save(self, *args, **kwargs):
        # 🔹 Calcul automatique de la note
        if self.objectif and self.realisation is not None:
            self.note_percent = (self.realisation / self.objectif) * 100
            self.note_sur_20 = (self.note_percent / 100) * 20
        super().save(*args, **kwargs)
