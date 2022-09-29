from django.shortcuts import get_object_or_404
from rest_framework import serializers
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from main.lib.responses import (
    created_response,
    invalid_request_data_response,
    ok_response,
)
from main.models.equipment import Equipment
from main.models.recipe import Recipe


class EquipmentAssociateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipment
        fields = ("id", "description")


@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated])  # type: ignore[list-item]
def equipment_associate(request: Request, recipe_id: int) -> Response:
    recipe = get_object_or_404(Recipe, pk=recipe_id, user=request.user)
    serializer = EquipmentAssociateSerializer(data=request.data)

    if not serializer.is_valid():
        return invalid_request_data_response(serializer)

    equipment = Equipment.objects.filter(
        description__iexact=serializer.validated_data["description"], user=request.user
    ).first()

    created = False

    if not equipment:
        equipment = serializer.save(user=request.user)
        created = True

    if not equipment.recipes.contains(recipe):  # type: ignore[union-attr]
        equipment.recipes.add(recipe)  # type: ignore[union-attr]

    serializer = EquipmentAssociateSerializer(equipment)

    if created:
        return created_response(data=serializer.data)
    else:
        return ok_response(data=serializer.data)
