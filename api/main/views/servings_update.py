from django.shortcuts import get_object_or_404
from rest_framework import permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import DecimalField, ModelSerializer

from main.lib.responses import invalid_request_data_response, no_content_response
from main.models.recipe import Recipe


class ServingsUpdateSerializer(ModelSerializer):
    class Meta:
        model = Recipe
        fields = ("servings",)

    servings = DecimalField(
        max_digits=6, decimal_places=2, coerce_to_string=False, required=True
    )


@api_view(http_method_names=["POST"])
@permission_classes([permissions.IsAuthenticated])
def servings_update(request: Request, recipe_id: int) -> Response:
    recipe = get_object_or_404(Recipe, pk=recipe_id, user=request.user)
    serializer = ServingsUpdateSerializer(data=request.data, instance=recipe)

    if not serializer.is_valid():
        return invalid_request_data_response(serializer)

    recipe = serializer.save()
    return no_content_response()
