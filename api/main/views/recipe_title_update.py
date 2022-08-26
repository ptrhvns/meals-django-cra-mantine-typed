from django.shortcuts import get_object_or_404
from django.utils.translation import gettext_lazy as _
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer

from main.models.recipe import Recipe


class RecipeTitleUpdateSerializer(ModelSerializer):
    class Meta:
        model = Recipe
        fields = ("title",)


@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated])  # type: ignore[list-item]
def recipe_title_update(request: Request, recipe_id: int) -> Response:
    recipe = get_object_or_404(Recipe, pk=recipe_id, user=request.user)
    serializer = RecipeTitleUpdateSerializer(data=request.data, instance=recipe)

    if not serializer.is_valid():
        return Response(
            {
                "errors": serializer.errors,
                "message": _("The information you provided was invalid."),
            },
            status=status.HTTP_422_UNPROCESSABLE_ENTITY,
        )

    recipe = serializer.save()
    return Response(status=status.HTTP_204_NO_CONTENT)
