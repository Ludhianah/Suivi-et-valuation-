# serializers.py
from rest_framework import serializers
from .models import (
    IndicateurSF, SavoirFaire, IndicateurSE, SavoirEtre,
    Evaluation, EvaluationSFDetail, EvaluationSEDetail  
)
from employees.models import Employe, Departement  # Assure-toi que le chemin est correct


# 1. IndicateurSF
class IndicateurSFSerializer(serializers.ModelSerializer):
    class Meta:
        model = IndicateurSF
        fields = ['id', 'nom_indicateur', 'description', 'unite_mesure', 'date_creation']
        read_only_fields = ['date_creation']


# 2. SavoirFaire
class SavoirFaireSerializer(serializers.ModelSerializer):
    id_departement = serializers.PrimaryKeyRelatedField(
        queryset=Departement.objects.all(),
        required=True
    )
    id_indicateur_sf = serializers.PrimaryKeyRelatedField(
        queryset=IndicateurSF.objects.all(),
        required=True
    )
    nom_departement = serializers.CharField(source='id_departement.nom_departement', read_only=True)
    nom_indicateur = serializers.CharField(source='id_indicateur_sf.nom_indicateur', read_only=True)

    class Meta:
        model = SavoirFaire
        fields = [
            'id', 'id_departement', 'nom_departement',
            'id_indicateur_sf', 'nom_indicateur',
            'objectif', 'poids_pourcentage', 'date_creation'
        ]
        read_only_fields = ['date_creation']


# 3. IndicateurSE
class IndicateurSESerializer(serializers.ModelSerializer):
    class Meta:
        model = IndicateurSE
        fields = ['id', 'nom_indicateur', 'description', 'date_creation']
        read_only_fields = ['date_creation']


# 4. SavoirEtre
class SavoirEtreSerializer(serializers.ModelSerializer):
    id_indicateur_se = serializers.PrimaryKeyRelatedField(
        queryset=IndicateurSE.objects.all(),
        required=True
    )
    nom_indicateur = serializers.CharField(source='id_indicateur_se.nom_indicateur', read_only=True)

    class Meta:
        model = SavoirEtre
        fields = ['id', 'id_indicateur_se', 'nom_indicateur', 'poids_pourcentage', 'date_creation']
        read_only_fields = ['date_creation']


# 6. Détails Évaluation SF (DÉPLACÉ EN HAUT)
class EvaluationSFDetailSerializer(serializers.ModelSerializer):
    id_sf = serializers.PrimaryKeyRelatedField(
        queryset=SavoirFaire.objects.all(),
        required=True
    )
    nom_indicateur = serializers.CharField(source='id_sf.id_indicateur_sf.nom_indicateur', read_only=True)
    poids = serializers.DecimalField(source='id_sf.poids_pourcentage', max_digits=5, decimal_places=2, read_only=True)
    note_ponderee = serializers.SerializerMethodField()

    class Meta:
        model = EvaluationSFDetail
        fields = ['id',  'id_sf', 'nom_indicateur', 'poids', 'note', 'commentaire', 'note_ponderee', 'date_creation']
        read_only_fields = ['note_ponderee', 'date_creation']

    def get_note_ponderee(self, obj):
        return obj.note_ponderee


# 7. Détails Évaluation SE (DÉPLACÉ EN HAUT)
class EvaluationSEDetailSerializer(serializers.ModelSerializer):
    id_se = serializers.PrimaryKeyRelatedField(
        queryset=SavoirEtre.objects.all(),
        required=True
    )
    nom_indicateur = serializers.CharField(source='id_se.id_indicateur_se.nom_indicateur', read_only=True)
    poids = serializers.DecimalField(source='id_se.poids_pourcentage', max_digits=5, decimal_places=2, read_only=True)
    note_ponderee = serializers.SerializerMethodField()

    class Meta:
        model = EvaluationSEDetail
        fields = ['id', 'id_se', 'nom_indicateur', 'poids', 'note', 'commentaire', 'note_ponderee', 'date_creation']
        read_only_fields = ['note_ponderee', 'date_creation']

    def get_note_ponderee(self, obj):
        return obj.note_ponderee


# 8 . Evaluation (MAINTENANT APRÈS les détails)# evaluation/serializers.py

class EvaluationSerializer(serializers.ModelSerializer):
    id_employe = serializers.PrimaryKeyRelatedField(
        queryset=Employe.objects.all(),
        required=True
    )
    
    nom_employe = serializers.SerializerMethodField()
    mois_display = serializers.CharField(source='get_mois_display', read_only=True)
    note_globale = serializers.SerializerMethodField()

    # ❌ WRONG if id_detail_sf is a ForeignKey (single object)
    # id_detail_sf = EvaluationSFDetailSerializer(many=True, read_only=True)
    # id_detail_se = EvaluationSEDetailSerializer(many=True, read_only=True)

    # ✅ CORRECT if it's a single related object:
    id_detail_sf = EvaluationSFDetailSerializer(read_only=True)
    id_detail_se = EvaluationSEDetailSerializer(read_only=True)

    class Meta:
        model = Evaluation
        fields = [
            'annee',
            'mois',
            'id_employe',
            'nom_employe',
            'mois_display',
            'note_globale',
            'id_detail_sf',
            'id_detail_se',
        ]

    def get_nom_employe(self, obj):
        return str(obj.id_employe)

    def get_note_globale(self, obj):
        return obj.note_globale