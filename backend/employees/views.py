from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from .models import Service, Employe  # <-- Remplacé Departement par Service
from .serializers import UserSerializer, ServiceSerializer, EmployeSerializer


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
# 🔹 SERVICES
# ===============================

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def services_list_create(request):
    """
    ✅ Lister tous les services (GET)
    ✅ Créer un nouveau service (POST)
    URL : /api/services/
    """
    if request.method == 'GET':
        services = Service.objects.all()
        serializer = ServiceSerializer(services, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = ServiceSerializer(data=request.data)
        if serializer.is_valid():
            service = serializer.save()
            return Response(ServiceSerializer(service).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 🔹 Récupérer, modifier et supprimer un service
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([AllowAny])
def service_detail(request, pk):
    """
    ✅ GET : Récupérer un service
    ✅ PUT : Modifier un service
    ✅ DELETE : Supprimer un service
    URL : /api/services/<pk>/
    """
    try:
        service = Service.objects.get(pk=pk)
    except Service.DoesNotExist:
        return Response({"error": "Service non trouvé"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ServiceSerializer(service)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = ServiceSerializer(service, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        service.delete()
        return Response({"message": "Service supprimé"}, status=status.HTTP_204_NO_CONTENT)
