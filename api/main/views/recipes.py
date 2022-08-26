from django.core.paginator import Paginator
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer

from main.models.recipe import Recipe


class RecipesSerializer(ModelSerializer):
    class Meta:
        model = Recipe
        fields = ("id", "title")


@api_view(http_method_names=["GET"])
@permission_classes([IsAuthenticated])  # type: ignore[list-item]
def recipes(request: Request) -> Response:
    recipes = Recipe.objects.filter(user=request.user).order_by("title").all()
    paginator = Paginator(recipes, per_page=5)
    page = paginator.get_page(request.query_params.get("page", 1))
    serializer = RecipesSerializer(page.object_list, many=True)
    data = {
        "pagination": {
            "page": page.number,
            "total": paginator.num_pages,
        },
        "recipes": serializer.data,
    }
    return Response({"data": data}, status=status.HTTP_200_OK)
