# evaluation/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

# Import des modèles
from .models import (
    IndicateurSF, SavoirFaire, IndicateurSE, SavoirEtre,
    Evaluation, EvaluationSFDetail, EvaluationSEDetail
)

# Import des sérialiseurs
from .serializers import (
    IndicateurSFSerializer, SavoirFaireSerializer, IndicateurSESerializer, SavoirEtreSerializer,
    EvaluationSerializer, EvaluationSFDetailSerializer, EvaluationSEDetailSerializer
)


# =============================================================================
# INDICATEUR SAVOIR-FAIRE (IndicateurSF)
# =============================================================================
@api_view(['GET', 'POST'])
@permission_classes([AllowAny])  # TODO: À restreindre en production (ex: IsAuthenticated)
def indicateur_sf_api(request, pk=None):
    """
    API pour gérer les IndicateurSF :
    - GET /indicateur-sf/        → Liste tous les indicateurs SF
    - GET /indicateur-sf/<pk>/   → Détail d'un indicateur SF
    - POST /indicateur-sf/       → Création d'un nouvel indicateur SF
    """
    if request.method == 'GET':
        if pk:
            # Récupération d'un seul objet par PK
            try:
                obj = IndicateurSF.objects.get(pk=pk)
                serializer = IndicateurSFSerializer(obj)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except IndicateurSF.DoesNotExist:
                return Response(
                    {"detail": "IndicateurSF non trouvé."},
                    status=status.HTTP_404_NOT_FOUND
                )
        else:
            # Liste complète
            qs = IndicateurSF.objects.all()
            serializer = IndicateurSFSerializer(qs, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        # Création d'un nouvel indicateur
        serializer = IndicateurSFSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# =============================================================================
# SAVOIR-FAIRE (SavoirFaire)
# =============================================================================
@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def savoir_faire_api(request, pk=None):
    """
    API pour gérer les SavoirFaire :
    - Inclut les relations avec département et indicateur SF via select_related
    """
    if request.method == 'GET':
        if pk:
            try:
                # Optimisation : évite les requêtes SQL supplémentaires
                obj = SavoirFaire.objects.select_related('id_departement', 'id_indicateur_sf').get(pk=pk)
                serializer = SavoirFaireSerializer(obj)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except SavoirFaire.DoesNotExist:
                return Response(
                    {"detail": "SavoirFaire non trouvé."},
                    status=status.HTTP_404_NOT_FOUND
                )
        else:
            qs = SavoirFaire.objects.select_related('id_departement', 'id_indicateur_sf').all()
            serializer = SavoirFaireSerializer(qs, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        serializer = SavoirFaireSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# =============================================================================
# INDICATEUR SAVOIR-ÊTRE (IndicateurSE)
# =============================================================================
@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def indicateur_se_api(request, pk=None):
    """
    API pour les IndicateurSE (Savoir-Être).
    Structure identique à IndicateurSF.
    """
    if request.method == 'GET':
        if pk:
            try:
                obj = IndicateurSE.objects.get(pk=pk)
                serializer = IndicateurSESerializer(obj)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except IndicateurSE.DoesNotExist:
                return Response(
                    {"detail": "IndicateurSE non trouvé."},
                    status=status.HTTP_404_NOT_FOUND
                )
        else:
            qs = IndicateurSE.objects.all()
            serializer = IndicateurSESerializer(qs, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        serializer = IndicateurSESerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# =============================================================================
# SAVOIR-ÊTRE (SavoirEtre)
# =============================================================================
@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def savoir_etre_api(request, pk=None):
    """
    API pour les SavoirEtre avec relation vers IndicateurSE.
    """
    if request.method == 'GET':
        if pk:
            try:
                obj = SavoirEtre.objects.select_related('id_indicateur_se').get(pk=pk)
                serializer = SavoirEtreSerializer(obj)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except SavoirEtre.DoesNotExist:
                return Response(
                    {"detail": "SavoirEtre non trouvé."},
                    status=status.HTTP_404_NOT_FOUND
                )
        else:
            qs = SavoirEtre.objects.select_related('id_indicateur_se').all()
            serializer = SavoirEtreSerializer(qs, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        serializer = SavoirEtreSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# =============================================================================
# ÉVALUATION GÉNÉRALE (Evaluation)
# =============================================================================
@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def evaluation_api(request, pk=None):
    """
    API principale pour les évaluations.
    Utilise prefetch_related pour charger les détails liés efficacement.
    """
    if request.method == 'GET':
        if pk:
            try:
                obj = Evaluation.objects.select_related('id_employe') \
                    .prefetch_related('details_sf', 'details_se').get(pk=pk)
                serializer = EvaluationSerializer(obj)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except Evaluation.DoesNotExist:
                return Response(
                    {"detail": "Évaluation non trouvée."},
                    status=status.HTTP_404_NOT_FOUND
                )
        else:
            qs = Evaluation.objects.select_related('id_employe') \
                .prefetch_related('details_sf', 'details_se').all()
            serializer = EvaluationSerializer(qs, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        serializer = EvaluationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# =============================================================================
# DÉTAIL ÉVALUATION SAVOIR-FAIRE (EvaluationSFDetail)
# =============================================================================
@api_view(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([AllowAny])
def evaluation_sf_detail_api(request, pk=None):
    """
    API complète CRUD pour les détails d'évaluation SF.
    Supporte mise à jour partielle (PATCH).
    """
    if request.method == 'GET':
        if pk:
            try:
                obj = EvaluationSFDetail.objects.select_related('id_sf').get(pk=pk)
                serializer = EvaluationSFDetailSerializer(obj)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except EvaluationSFDetail.DoesNotExist:
                return Response(
                    {"detail": "Détail SF non trouvé."},
                    status=status.HTTP_404_NOT_FOUND
                )
        else:
            qs = EvaluationSFDetail.objects.select_related('id_sf').all()
            serializer = EvaluationSFDetailSerializer(qs, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        serializer = EvaluationSFDetailSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method in ['PUT', 'PATCH']:
        # Mise à jour complète (PUT) ou partielle (PATCH)
        try:
            obj = EvaluationSFDetail.objects.get(pk=pk)
        except EvaluationSFDetail.DoesNotExist:
            return Response(
                {"detail": "Détail SF non trouvé."},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = EvaluationSFDetailSerializer(
            obj, data=request.data, partial=(request.method == 'PATCH')
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        try:
            obj = EvaluationSFDetail.objects.get(pk=pk)
            obj.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except EvaluationSFDetail.DoesNotExist:
            return Response(
                {"detail": "Détail SF non trouvé."},
                status=status.HTTP_404_NOT_FOUND
            )


# =============================================================================
# DÉTAIL ÉVALUATION SAVOIR-ÊTRE (EvaluationSEDetail)
# =============================================================================
@api_view(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([AllowAny])
def evaluation_se_detail_api(request, pk=None):
    """
    API CRUD complète pour les détails d'évaluation SE.
    Identique à EvaluationSFDetail.
    """
    if request.method == 'GET':
        if pk:
            try:
                obj = EvaluationSEDetail.objects.select_related('id_se').get(pk=pk)
                serializer = EvaluationSEDetailSerializer(obj)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except EvaluationSEDetail.DoesNotExist:
                return Response(
                    {"detail": "Détail SE non trouvé."},
                    status=status.HTTP_404_NOT_FOUND
                )
        else:
            qs = EvaluationSEDetail.objects.select_related('id_se').all()
            serializer = EvaluationSEDetailSerializer(qs, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        serializer = EvaluationSEDetailSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method in ['PUT', 'PATCH']:
        try:
            obj = EvaluationSEDetail.objects.get(pk=pk)
        except EvaluationSEDetail.DoesNotExist:
            return Response(
                {"detail": "Détail SE non trouvé."},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = EvaluationSEDetailSerializer(
            obj, data=request.data, partial=(request.method == 'PATCH')
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        try:
            obj = EvaluationSEDetail.objects.get(pk=pk)
            obj.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except EvaluationSEDetail.DoesNotExist:
            return Response(
                {"detail": "Détail SE non trouvé."},
                status=status.HTTP_404_NOT_FOUND
            )