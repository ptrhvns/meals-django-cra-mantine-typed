from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import CharField, ModelSerializer

from main.lib.responses import data_response
from main.models import Time
from main.models.brand import Brand
from main.models.direction import Direction
from main.models.equipment import Equipment
from main.models.food import Food
from main.models.ingredient import Ingredient
from main.models.recipe import Recipe
from main.models.tag import Tag
from main.models.unit import Unit


class DirectionSerializer(ModelSerializer):
    class Meta:
        model = Direction
        fields = ("description", "id", "order")


class EquipmentSerializer(ModelSerializer):
    class Meta:
        model = Equipment
        fields = ("description", "id")


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


class TagSerializer(ModelSerializer):
    class Meta:
        model = Tag
        fields = ("id", "name")


class TimeSerializer(ModelSerializer):
    class Meta:
        model = Time
        fields = ("category", "days", "hours", "id", "minutes", "note")


class RecipeSerializer(ModelSerializer):
    class Meta:
        model = Recipe
        fields = (
            "directions",
            "equipment",
            "id",
            "ingredients",
            "notes",
            "rating",
            "servings",
            "tags",
            "times",
            "title",
        )

    directions = DirectionSerializer(many=True, required=False)
    equipment = EquipmentSerializer(many=True, required=False)
    ingredients = IngredientSerializer(many=True, required=False)
    tags = TagSerializer(many=True, required=False)
    times = TimeSerializer(many=True, required=False)


@api_view(http_method_names=["GET"])
@permission_classes([IsAuthenticated])
def recipe(request: Request, recipe_id: int) -> Response:
    recipe = get_object_or_404(Recipe, pk=recipe_id, user=request.user)
    serializer = RecipeSerializer(recipe)
    return data_response(data=serializer.data)
