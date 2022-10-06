from typing import Any

from django.shortcuts import get_object_or_404
from django.utils.translation import gettext_lazy as _
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer, ValidationError

from main.lib.responses import created_response, invalid_request_data_response
from main.models.recipe import Recipe
from main.models.time import Time


class RecipeTimeCreateSerializer(ModelSerializer):
    class Meta:
        model = Time
        fields = ("category", "days", "hours", "id", "minutes", "note")

    def validate(self, data: dict[str, Any]) -> dict[str, Any]:
        units = ["days", "hours", "minutes"]
        error = _("At least one unit is required.")
        if not any([data.get(u) for u in units]):
            raise ValidationError({u: error for u in units})
        return data


@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated])
def time_create(request: Request, recipe_id: int) -> Response:
    recipe = get_object_or_404(Recipe, pk=recipe_id, user=request.user)

    # Eliminate fields with an empty string (e.g. unset <select> field).
    pruned_data = {k: v for k, v in request.data.items() if v}

    serializer = RecipeTimeCreateSerializer(data=pruned_data)

    # If "category" is invalid (field), units won't be validated (object).
    if not serializer.is_valid():
        return invalid_request_data_response(serializer)

    serializer.save(recipe=recipe)
    return created_response(data=serializer.data)
