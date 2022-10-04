from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import CharField, ModelSerializer

from main.lib.responses import data_response
from main.models.brand import Brand
from main.models.food import Food
from main.models.ingredient import Ingredient
from main.models.unit import Unit


class BrandSerializer(ModelSerializer):
    class Meta:
        model = Brand
        fields = ("id", "name")

    name = CharField(allow_blank=False, allow_null=False, max_length=256)


class FoodSerializer(ModelSerializer):
    class Meta:
        model = Food
        fields = ("id", "name")

    name = CharField(allow_blank=False, allow_null=False, max_length=256)


class UnitSerializer(ModelSerializer):
    class Meta:
        model = Unit
        fields = ("id", "name")

    name = CharField(allow_blank=False, allow_null=False, max_length=256)


class IngredientSerializer(ModelSerializer):
    class Meta:
        model = Ingredient
        fields = (
            "amount",
            "brand",
            "food",
            "id",
            "unit",
        )

    brand = BrandSerializer(required=False)
    food = FoodSerializer(required=True)
    unit = UnitSerializer(required=False)


@api_view(http_method_names=["GET"])
@permission_classes([IsAuthenticated])
def ingredient(request: Request, ingredient_id: int) -> Response:
    ingredient = get_object_or_404(
        Ingredient, pk=ingredient_id, recipe__user=request.user
    )
    serializer = IngredientSerializer(ingredient)
    return data_response(data=serializer.data)
