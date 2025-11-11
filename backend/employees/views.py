from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from .models import Departement, Employe
from .serializers import UserSerializer, DepartementSerializer, EmployeSerializer


# ===============================
# 🔹 USERS
# ===============================

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def users_list_create(request):
    """
    ✅ Lister tous les utilisateurs (GET)
    ✅ Créer un nouvel utilisateur (POST)
    URL : /api/users/
    """
    if request.method == 'GET':
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ===============================
# 🔹 EMPLOYÉS
# ===============================

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def employees_list_create(request):
    """
    ✅ Lister tous les employés (GET)
    ✅ Créer un nouvel employé (POST)
    URL : /api/employees/
    """
    if request.method == 'GET':
        employes = Employe.objects.all()
        serializer = EmployeSerializer(employes, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = EmployeSerializer(data=request.data)
        if serializer.is_valid():
            employe = serializer.save()
            return Response(EmployeSerializer(employe).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ===============================
# 🔹 DÉPARTEMENTS
# ===============================

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def departements_list_create(request):
    """
    ✅ Lister tous les départements (GET)
    ✅ Créer un nouveau département (POST)
    URL : /api/departements/
    """
    if request.method == 'GET':
        departements = Departement.objects.all()
        serializer = DepartementSerializer(departements, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = DepartementSerializer(data=request.data)
        if serializer.is_valid():
            departement = serializer.save()
            return Response(DepartementSerializer(departement).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
