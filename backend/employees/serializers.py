from rest_framework import serializers, viewsets
from django.contrib.auth.models import User
from .models import Employe, Departement

# Serializers define the API representation.
class UserSerializer(serializers.ModelSerializer):
    
    # Sécuriser le mot de passe en écriture seule | n'est pas renvoyé dans les réponses API
    password = serializers.CharField(write_only=True)
    
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'is_staff']
        
        
    def create(self, validated_data):
        return User.objects.create_user(**validated_data)    


# ViewSets define the view behavior.
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
# Serializer pour le modèle Departement    
class DepartementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Departement
        fields = '__all__'


# Serializer pour le modèle Employe
class EmployeSerializer(serializers.ModelSerializer):
    # On affiche le nom du département dans la réponse
    departement_nom = serializers.CharField(source='id_departement.nom_departement', read_only=True)

    class Meta:
        model = Employe
        fields = '__all__'  # Tous les champs du modèle