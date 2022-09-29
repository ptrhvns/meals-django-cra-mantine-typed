from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from main.lib.responses import no_content_response
from main.models.equipment import Equipment
from main.models.recipe import Recipe


@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated])  # type: ignore[list-item]
def equipment_dissociate(
    request: Request, equipment_id: int, recipe_id: int
) -> Response:
    recipe = get_object_or_404(Recipe, pk=recipe_id, user=request.user)
    equipment = get_object_or_404(
        Equipment, pk=equipment_id, recipes=recipe, user=request.user
    )
    recipe.equipment.remove(equipment)  # type: ignore[attr-defined]
    return no_content_response()
