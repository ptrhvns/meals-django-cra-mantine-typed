from django.utils.translation import gettext_lazy as _
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer

from main.models.recipe import Recipe


class RecipeCreateSerializer(ModelSerializer):
    class Meta:
        model = Recipe
        fields = ("title",)


@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated])  # type: ignore[list-item]
def recipe_create(request: Request) -> Response:
    serializer = RecipeCreateSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(
            {
                "errors": serializer.errors,
                "message": _("The information you provided was invalid."),
            },
            status=status.HTTP_422_UNPROCESSABLE_ENTITY,
        )

    recipe = serializer.save(user=request.user)
    return Response({"data": {"id": recipe.id}}, status=status.HTTP_201_CREATED)
