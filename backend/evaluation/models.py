from django.db import models

# Create your models here.
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver


# MODÈLE: INDICATEUR SAVOIR-FAIRE (SF)

class IndicateurSF(models.Model):
    nom_indicateur = models.CharField(max_length=100, unique=True, verbose_name="Nom de l'indicateur")
    description = models.TextField(blank=True, null=True)
    unite_mesure = models.CharField(max_length=50, blank=True, null=True, help_text="Ex: FCFA, Nombre, %, etc.")
    date_creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'indicateur_sf'
        verbose_name = 'Indicateur Savoir-Faire'
        verbose_name_plural = 'Indicateurs Savoir-Faire'
        ordering = ['nom_indicateur']

    def __str__(self):
        return self.nom_indicateur



# MODÈLE: SAVOIR-FAIRE (lié au département)
class SavoirFaire(models.Model):
    id_departement = models.ForeignKey(
        'employees.Departement',
        on_delete=models.CASCADE,
        related_name='savoir_faire',
        db_column='id_departement'
    )
    id_indicateur_sf = models.ForeignKey(
        IndicateurSF,
        on_delete=models.CASCADE,
        related_name='savoir_faire',
        db_column='id_indicateur_sf'
    )
    objectif = models.CharField(max_length=255, blank=True, null=True, verbose_name="Objectif")
    poids_pourcentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text="Poids en % (ex: 30 pour 30%)"
    )
    date_creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'savoir_faire'
        verbose_name = 'Savoir-Faire'
        verbose_name_plural = 'Savoirs-Faire'
        unique_together = ['id_departement', 'id_indicateur_sf']

    def __str__(self):
        return f"{self.id_departement.nom_departement} - {self.id_indicateur_sf.nom_indicateur}"

# MODÈLE: INDICATEUR SAVOIR-ÊTRE (SE)

class IndicateurSE(models.Model):
    nom_indicateur = models.CharField(max_length=100, unique=True, verbose_name="Nom de l'indicateur")
    description = models.TextField(blank=True, null=True)
    date_creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'indicateur_se'
        verbose_name = 'Indicateur Savoir-Être'
        verbose_name_plural = 'Indicateurs Savoir-Être'
        ordering = ['nom_indicateur']

    def __str__(self):
        return self.nom_indicateur



# MODÈLE: SAVOIR-ÊTRE (avec pondération)

class SavoirEtre(models.Model):
    id_indicateur_se = models.ForeignKey(
        IndicateurSE,
        on_delete=models.CASCADE,
        related_name='savoir_etre',
        db_column='id_indicateur_se'
    )
    poids_pourcentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text="Poids en % (ex: 20 pour 20%)"
    )
    date_creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'savoir_etre'
        verbose_name = 'Savoir-Être'
        verbose_name_plural = 'Savoirs-Être'

    def __str__(self):
        return f"{self.id_indicateur_se.nom_indicateur} ({self.poids_pourcentage}%)"


# MODÈLE: ÉVALUATION MENSUELLE
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
    annee = models.IntegerField(verbose_name="Année")
    mois = models.IntegerField(choices=MOIS_CHOICES, verbose_name="Mois")
    note_sf = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        blank=True,
        null=True,
        validators=[MinValueValidator(0), MaxValueValidator(10)],
        verbose_name="Note Savoir-Faire"
    )
    note_se = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        blank=True,
        null=True,
        validators=[MinValueValidator(0), MaxValueValidator(10)],
        verbose_name="Note Savoir-Être"
    )
    commentaire = models.TextField(blank=True, null=True)
    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'evaluation'
        verbose_name = 'Évaluation'
        verbose_name_plural = 'Évaluations'
        unique_together = ['id_employe', 'annee', 'mois']
        ordering = ['-annee', '-mois']

    def __str__(self):
        return f"{self.id_employe} - {self.get_mois_display()} {self.annee}"
    @property
    def note_globale(self):
        if self.note_sf is not None and self.note_se is not None:
            return (float(self.note_sf) + float(self.note_se)) / 2
        return None



# MODÈLE: DÉTAIL ÉVALUATION SAVOIR-FAIRE

class EvaluationSFDetail(models.Model):
    id_evaluation = models.ForeignKey(
        Evaluation,
        on_delete=models.CASCADE,
        related_name='details_sf',
        db_column='id_evaluation'
    )
    id_sf = models.ForeignKey(
        SavoirFaire,
        on_delete=models.CASCADE,
        related_name='evaluations_detail',
        db_column='id_sf'
    )
    note = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[MinValueValidator(0), MaxValueValidator(10)],
        verbose_name="Note /10"
    )
    commentaire = models.TextField(blank=True, null=True)
    date_creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'evaluation_sf_detail'
        verbose_name = 'Détail Évaluation SF'
        verbose_name_plural = 'Détails Évaluations SF'
        unique_together = ['id_evaluation', 'id_sf']

    def __str__(self):
        return f"{self.id_evaluation} - {self.id_sf.id_indicateur_sf.nom_indicateur}: {self.note}/10"

    @property
    def note_ponderee(self):
        return (float(self.note) * float(self.id_sf.poids_pourcentage)) / 100



# MODÈLE: DÉTAIL ÉVALUATION SAVOIR-ÊTRE

class EvaluationSEDetail(models.Model):
    id_evaluation = models.ForeignKey(
        Evaluation,
        on_delete=models.CASCADE,
        related_name='details_se',
        db_column='id_evaluation'
    )
    id_se = models.ForeignKey(
        SavoirEtre,
        on_delete=models.CASCADE,
        related_name='evaluations_detail',
        db_column='id_se'
    )
    note = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[MinValueValidator(0), MaxValueValidator(10)],
        verbose_name="Note /10"
    )
    commentaire = models.TextField(blank=True, null=True)
    date_creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'evaluation_se_detail'
        verbose_name = 'Détail Évaluation SE'
        verbose_name_plural = 'Détails Évaluations SE'
        unique_together = ['id_evaluation', 'id_se']

    def __str__(self):
        return f"{self.id_evaluation} - {self.id_se.id_indicateur_se.nom_indicateur}: {self.note}/10"

    @property
    def note_ponderee(self):
        return (float(self.note) * float(self.id_se.poids_pourcentage)) / 100


# SIGNAUX POUR CALCUL AUTOMATIQUE DES NOTES
@receiver([post_save, post_delete], sender=EvaluationSFDetail)
def calculer_note_sf(sender, instance, **kwargs):
    evaluation = instance.id_evaluation
    details_sf = evaluation.details_sf.all()
    if details_sf.exists():
        total_pondere = sum(detail.note_ponderee for detail in details_sf)
        total_poids = sum(float(detail.id_sf.poids_pourcentage) for detail in details_sf)
        evaluation.note_sf = (total_pondere / total_poids) * 10 if total_poids > 0 else 0
        evaluation.save()


@receiver([post_save, post_delete], sender=EvaluationSEDetail)
def calculer_note_se(sender, instance, **kwargs):
    evaluation = instance.id_evaluation
    details_se = evaluation.details_se.all()
    if details_se.exists():
        total_pondere = sum(detail.note_ponderee for detail in details_se)
        total_poids = sum(float(detail.id_se.poids_pourcentage) for detail in details_se)
        evaluation.note_se = (total_pondere / total_poids) * 10 if total_poids > 0 else 0
        evaluation.save()
