from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer

from main import models
from main.lib.responses import data_response


class RecipeRatingSerializer(ModelSerializer):
    class Meta:
        model = models.Recipe
        fields = ("rating",)


@api_view(http_method_names=["GET"])
@permission_classes([IsAuthenticated])
def rating(request: Request, recipe_id: int) -> Response:
    recipe = get_object_or_404(models.Recipe, pk=recipe_id, user=request.user)
    serializer = RecipeRatingSerializer(recipe)
    return data_response(data=serializer.data)
