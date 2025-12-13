from rest_framework import serializers
from .models import Evaluation, SavoirFaire, SavoirEtre, IndicateurSF, IndicateurSE
from employees.models import Employe, Service  # 🔹 Remplacé Departement par Service

# =========================
# Serializer Évaluation
# =========================
class EvaluationSerializer(serializers.ModelSerializer):
    id_employe = serializers.PrimaryKeyRelatedField(
        queryset=Employe.objects.all(),
        required=True
    )
    nom_employe = serializers.SerializerMethodField(read_only=True)
    mois_display = serializers.CharField(source='get_mois_display', read_only=True)
    note_globale = serializers.SerializerMethodField(read_only=True)

    # Champs virtuels calculés
    note_sf = serializers.SerializerMethodField(read_only=True)
    note_se = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Evaluation
        fields = [
            'id',
            'id_employe',
            'nom_employe',
            'id_service',
            'id_indicateur',
            'annee',
            'mois',
            'mois_display',
            'note_sf',
            'note_se',
            'note_globale',
            'objectif',
            'realisation',
            'commentaire',
            'date_creation',
            'date_modification',
        ]
        read_only_fields = ['nom_employe', 'mois_display', 'note_sf', 'note_se', 'note_globale']

    def get_nom_employe(self, obj):
        return str(obj.id_employe)

    def get_note_sf(self, obj):
        # Calcul automatique de la note SF basée sur objectif / réalisation
        if obj.objectif and obj.realisation is not None:
            return round((obj.realisation / obj.objectif) * 20, 2)
        return None

    def get_note_se(self, obj):
        # Pour l'instant on met None ou 0, tu pourras remplacer par un vrai calcul SE
        return None

    def get_note_globale(self, obj):
        notes = []
        sf = self.get_note_sf(obj)
        se = self.get_note_se(obj)
        if sf is not None:
            notes.append(sf)
        if se is not None:
            notes.append(se)
        if notes:
            return round(sum(notes) / len(notes), 2)
        return None


# =========================
# Serializer SavoirFaire
# =========================
class SavoirFaireSerializer(serializers.ModelSerializer):
    id_service = serializers.PrimaryKeyRelatedField(queryset=Service.objects.all())
    id_indicateur_sf = serializers.PrimaryKeyRelatedField(queryset=IndicateurSF.objects.all())

    class Meta:
        model = SavoirFaire
        fields = '__all__'


# =========================
# Serializer SavoirEtre
# =========================
class SavoirEtreSerializer(serializers.ModelSerializer):
    id_indicateur_se = serializers.PrimaryKeyRelatedField(queryset=IndicateurSE.objects.all())

    class Meta:
        model = SavoirEtre
        fields = '__all__'


# =========================
# Serializer IndicateurSF
# =========================
class IndicateurSFSerializer(serializers.ModelSerializer):
    class Meta:
        model = IndicateurSF
        fields = '__all__'


# =========================
# Serializer IndicateurSE
# =========================
class IndicateurSESerializer(serializers.ModelSerializer):
    class Meta:
        model = IndicateurSE
        fields = '__all__'
