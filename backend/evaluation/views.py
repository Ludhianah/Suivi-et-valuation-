# evaluation/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

from .models import IndicateurSF, SavoirFaire, IndicateurSE, SavoirEtre, Evaluation
from .serializers import (
    IndicateurSFSerializer,
    SavoirFaireSerializer,
    IndicateurSESerializer,
    SavoirEtreSerializer,
    EvaluationSerializer
)


# =========================================
# INDICATEUR SAVOIR-FAIRE (SF)
# =========================================
@api_view(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([AllowAny])
def indicateur_sf_api(request, pk=None):
    if request.method == 'GET':
        if pk:
            try:
                obj = IndicateurSF.objects.get(pk=pk)
                serializer = IndicateurSFSerializer(obj)
                return Response(serializer.data)
            except IndicateurSF.DoesNotExist:
                return Response({"detail": "IndicateurSF non trouvé."}, status=status.HTTP_404_NOT_FOUND)
        qs = IndicateurSF.objects.all()
        serializer = IndicateurSFSerializer(qs, many=True)
        return Response(serializer.data)

    elif request.method in ['POST', 'PUT', 'PATCH']:
        if pk:
            try:
                obj = IndicateurSF.objects.get(pk=pk)
            except IndicateurSF.DoesNotExist:
                return Response({"detail": "IndicateurSF non trouvé."}, status=status.HTTP_404_NOT_FOUND)
            serializer = IndicateurSFSerializer(obj, data=request.data, partial=(request.method=='PATCH'))
        else:
            serializer = IndicateurSFSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        try:
            obj = IndicateurSF.objects.get(pk=pk)
            obj.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except IndicateurSF.DoesNotExist:
            return Response({"detail": "IndicateurSF non trouvé."}, status=status.HTTP_404_NOT_FOUND)


# =========================================
# SAVOIR-FAIRE (SavoirFaire)
# =========================================
@api_view(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([AllowAny])
def savoir_faire_api(request, pk=None):
    if request.method == 'GET':
        if pk:
            try:
                obj = SavoirFaire.objects.select_related('id_service', 'id_indicateur_sf').get(pk=pk)
                serializer = SavoirFaireSerializer(obj)
                return Response(serializer.data)
            except SavoirFaire.DoesNotExist:
                return Response({"detail": "SavoirFaire non trouvé."}, status=status.HTTP_404_NOT_FOUND)
        qs = SavoirFaire.objects.select_related('id_service', 'id_indicateur_sf').all()
        serializer = SavoirFaireSerializer(qs, many=True)
        return Response(serializer.data)

    elif request.method in ['POST', 'PUT', 'PATCH']:
        if pk:
            try:
                obj = SavoirFaire.objects.get(pk=pk)
            except SavoirFaire.DoesNotExist:
                return Response({"detail": "SavoirFaire non trouvé."}, status=status.HTTP_404_NOT_FOUND)
            serializer = SavoirFaireSerializer(obj, data=request.data, partial=(request.method=='PATCH'))
        else:
            serializer = SavoirFaireSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        try:
            obj = SavoirFaire.objects.get(pk=pk)
            obj.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except SavoirFaire.DoesNotExist:
            return Response({"detail": "SavoirFaire non trouvé."}, status=status.HTTP_404_NOT_FOUND)


# =========================================
# INDICATEUR SAVOIR-ÊTRE (SE)
# =========================================
@api_view(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([AllowAny])
def indicateur_se_api(request, pk=None):
    if request.method == 'GET':
        if pk:
            try:
                obj = IndicateurSE.objects.get(pk=pk)
                serializer = IndicateurSESerializer(obj)
                return Response(serializer.data)
            except IndicateurSE.DoesNotExist:
                return Response({"detail": "IndicateurSE non trouvé."}, status=status.HTTP_404_NOT_FOUND)
        qs = IndicateurSE.objects.all()
        serializer = IndicateurSESerializer(qs, many=True)
        return Response(serializer.data)

    elif request.method in ['POST', 'PUT', 'PATCH']:
        if pk:
            try:
                obj = IndicateurSE.objects.get(pk=pk)
            except IndicateurSE.DoesNotExist:
                return Response({"detail": "IndicateurSE non trouvé."}, status=status.HTTP_404_NOT_FOUND)
            serializer = IndicateurSESerializer(obj, data=request.data, partial=(request.method=='PATCH'))
        else:
            serializer = IndicateurSESerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        try:
            obj = IndicateurSE.objects.get(pk=pk)
            obj.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except IndicateurSE.DoesNotExist:
            return Response({"detail": "IndicateurSE non trouvé."}, status=status.HTTP_404_NOT_FOUND)


# =========================================
# SAVOIR-ÊTRE (SavoirEtre)
# =========================================
@api_view(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([AllowAny])
def savoir_etre_api(request, pk=None):
    if request.method == 'GET':
        if pk:
            try:
                obj = SavoirEtre.objects.select_related('id_indicateur_se').get(pk=pk)
                serializer = SavoirEtreSerializer(obj)
                return Response(serializer.data)
            except SavoirEtre.DoesNotExist:
                return Response({"detail": "SavoirEtre non trouvé."}, status=status.HTTP_404_NOT_FOUND)
        qs = SavoirEtre.objects.select_related('id_indicateur_se').all()
        serializer = SavoirEtreSerializer(qs, many=True)
        return Response(serializer.data)

    elif request.method in ['POST', 'PUT', 'PATCH']:
        if pk:
            try:
                obj = SavoirEtre.objects.get(pk=pk)
            except SavoirEtre.DoesNotExist:
                return Response({"detail": "SavoirEtre non trouvé."}, status=status.HTTP_404_NOT_FOUND)
            serializer = SavoirEtreSerializer(obj, data=request.data, partial=(request.method=='PATCH'))
        else:
            serializer = SavoirEtreSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        try:
            obj = SavoirEtre.objects.get(pk=pk)
            obj.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except SavoirEtre.DoesNotExist:
            return Response({"detail": "SavoirEtre non trouvé."}, status=status.HTTP_404_NOT_FOUND)


# =========================================
# ÉVALUATION (calcul automatique)
# =========================================
@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def evaluation_api(request, pk=None):
    if request.method == 'GET':
        if pk:
            try:
                obj = Evaluation.objects.select_related('id_employe').get(pk=pk)
                serializer = EvaluationSerializer(obj)
                return Response(serializer.data)
            except Evaluation.DoesNotExist:
                return Response({"detail": "Évaluation non trouvée."}, status=status.HTTP_404_NOT_FOUND)
        qs = Evaluation.objects.select_related('id_employe').all()
        serializer = EvaluationSerializer(qs, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        data = request.data.copy()
        try:
            objectif = float(data.get('objectif'))
            realisation = float(data.get('realisation'))
            note_percent = (realisation / objectif) * 100 if objectif != 0 else 0
            note_sur_20 = (note_percent / 100) * 20
        except (TypeError, ValueError):
            return Response({"detail": "Objectif et Réalisation doivent être des nombres."}, status=status.HTTP_400_BAD_REQUEST)

        data['note_sur_20'] = round(note_sur_20, 2)
        data['note_percent'] = round(note_percent, 2)

        serializer = EvaluationSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
