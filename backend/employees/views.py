from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from .serializers import UserSerializer
from django.contrib.auth.models import User
from .models import Departement, Employe
from .serializers import DepartementSerializer, EmployeSerializer
from rest_framework import viewsets
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated


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
    
    
# Créer un employé
@api_view(['POST'])
@permission_classes([AllowAny])
def create_employe(request):
    if request.method == 'POST':
        serializer = EmployeSerializer(data=request.data)
        if serializer.is_valid():
            employe = serializer.save()
            return Response(EmployeSerializer(employe).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# Lister tous les employés
@api_view(['GET'])
@permission_classes([AllowAny])
def list_employes(request):
    if request.method == 'GET':
        employes = Employe.objects.all()
        serializer = EmployeSerializer(employes, many=True)
        return Response(serializer.data)
# Créer un département
@api_view(['POST'])
@permission_classes([AllowAny])
def create_departement(request):
    if request.method == 'POST':
        serializer = DepartementSerializer(data=request.data)
        if serializer.is_valid():
            departement = serializer.save()
            return Response(DepartementSerializer(departement).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# Lister tous les départements
@api_view(['GET'])
@permission_classes([AllowAny])
def list_departements(request):
    if request.method == 'GET':
        departements = Departement.objects.all()
        serializer = DepartementSerializer(departements, many=True)
        return Response(serializer.data)
    
# ViewSets pour DRF Router


class DepartementViewSet(viewsets.ModelViewSet):
    queryset = Departement.objects.all()
    serializer_class = DepartementSerializer

class EmployeViewSet(viewsets.ModelViewSet):
    queryset = Employe.objects.all()
    serializer_class = EmployeSerializer
    permission_classes = [AllowAny]
    
# logout

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    try:
        refresh_token = request.data["refresh"]
        token = RefreshToken(refresh_token)
        token.blacklist()  # Invalide le token
        return Response({"message": "Logout réussi"}, status=205)
    except Exception as e:
        return Response({"error": str(e)}, status=400)    