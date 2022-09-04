from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer

from main.models.recipe import Recipe
from main.models.tag import Tag


class TagSerializer(ModelSerializer):
    class Meta:
        model = Tag
        fields = ("id", "name")


class RecipeSerializer(ModelSerializer):
    class Meta:
        model = Recipe
        fields = ("id", "tags", "title")

    tags = TagSerializer(many=True, required=False)


@api_view(http_method_names=["GET"])
@permission_classes([IsAuthenticated])  # type: ignore[list-item]
def recipe(request: Request, recipe_id: int) -> Response:
    recipe = get_object_or_404(Recipe, pk=recipe_id, user=request.user)
    serializer = RecipeSerializer(recipe)
    return Response({"data": serializer.data})
