from rest_framework import serializers, viewsets
from django.contrib.auth.models import User
from .models import Employe, Service  # <-- Remplacé Departement par Service

# -------------------------------
# Serializer User
# -------------------------------
class UserSerializer(serializers.ModelSerializer):
    # Sécuriser le mot de passe en écriture seule (non renvoyé dans les réponses API)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'is_staff']

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


# -------------------------------
# ViewSet User
# -------------------------------
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


# -------------------------------
# Serializer Service (anciennement Departement)
# -------------------------------
class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'


# -------------------------------
# Serializer Employe
# -------------------------------
class EmployeSerializer(serializers.ModelSerializer):
    # On affiche le nom du service dans la réponse
    service_nom = serializers.CharField(source='service.nom_service', read_only=True)

    class Meta:
        model = Employe
        fields = '__all__'  # Tous les champs du modèle
