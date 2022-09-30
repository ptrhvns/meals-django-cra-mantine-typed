from django.db import Error
from django.db.transaction import atomic
from django.shortcuts import get_object_or_404
from django.utils.translation import gettext_lazy as _
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import CharField, Serializer

from main.lib.responses import (
    created_response,
    invalid_request_data_response,
    ok_response,
    unprocessable_entity_response,
)
from main.models.brand import Brand
from main.models.food import Food
from main.models.ingredient import Ingredient
from main.models.recipe import Recipe
from main.models.unit import Unit


class IngredientAssociateSerializer(Serializer):
    amount = CharField(
        allow_blank=True,
        max_length=Ingredient._meta.get_field("amount").max_length,
        required=False,
    )
    brand = CharField(
        allow_blank=True,
        max_length=Brand._meta.get_field("name").max_length,
        required=False,
    )
    food = CharField(
        allow_blank=False,
        max_length=Food._meta.get_field("name").max_length,
        required=True,
    )
    unit = CharField(
        allow_blank=True,
        max_length=Unit._meta.get_field("name").max_length,
        required=False,
    )


@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated])
def ingredient_associate(request: Request, recipe_id: int) -> Response:
    recipe = get_object_or_404(Recipe, pk=recipe_id, user=request.user)
    serializer = IngredientAssociateSerializer(data=request.data)

    if not serializer.is_valid():
        return invalid_request_data_response(serializer)

    try:
        with atomic():
            ingredient_data = {}

            if "amount" in serializer.validated_data:
                ingredient_data["amount"] = serializer.validated_data["amount"]

            if "unit" in serializer.validated_data:
                ingredient_data["unit"] = Unit.objects.get_or_create(
                    defaults={"name": serializer.validated_data["unit"]},
                    name__iexact=serializer.validated_data["unit"],
                    user=request.user,
                )[0]

            if "brand" in serializer.validated_data:
                ingredient_data["brand"] = Brand.objects.get_or_create(
                    defaults={"name": serializer.validated_data["brand"]},
                    name__iexact=serializer.validated_data["brand"],
                    user=request.user,
                )[0]

            ingredient_data["food"] = Food.objects.get_or_create(
                defaults={"name": serializer.validated_data["food"]},
                name__iexact=serializer.validated_data["food"],
                user=request.user,
            )[0]

            ingredient = Ingredient.objects.create(recipe=recipe, **ingredient_data)
    except Error:
        return unprocessable_entity_response(
            message=_("Your information could not be saved.")
        )

    data = ({"id": ingredient.id, **serializer.data},)  # type: ignore[attr-defined]

    if any(ingredient_data.keys()) or ingredient:
        return created_response(data=data)
    else:
        return ok_response(data=data)
