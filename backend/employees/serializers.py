from rest_framework import serializers, viewsets
from django.contrib.auth.models import User

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