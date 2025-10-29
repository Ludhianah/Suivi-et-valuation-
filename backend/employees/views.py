from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from .serializers import UserSerializer
from django.contrib.auth.models import User

# Create your views here.

@api_view(['POST'])
@permission_classes([AllowAny])
def create_user(request):
    if request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
@api_view(['GET'])
@permission_classes([AllowAny])
# Récupérer la liste des utilisateurs
def list_users(request):
    if request.method == 'GET':
        # Récupérer tous les utilisateurs
        users = User.objects.all()
        
        # Sérialiser les données des utilisateurs
        serializer = UserSerializer(users, many=True)
        
        # Retourner la réponse avec les données sérialisées
        return Response(serializer.data)        