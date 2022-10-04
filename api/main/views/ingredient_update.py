from django import shortcuts
from django.db import Error, transaction
from django.utils.translation import gettext_lazy as _
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import CharField, Serializer

from main import models
from main.lib.responses import (
    invalid_request_data_response,
    no_content_response,
    unprocessable_entity_response,
)


class IngredientUpdateSerializer(Serializer):
    amount = CharField(
        allow_blank=True,
        max_length=models.Ingredient._meta.get_field("amount").max_length,
        required=False,
    )
    brand = CharField(
        allow_blank=True,
        max_length=models.Brand._meta.get_field("name").max_length,
        required=False,
    )
    food = CharField(
        allow_blank=False,
        max_length=models.Food._meta.get_field("name").max_length,
        required=True,
    )
    unit = CharField(
        allow_blank=True,
        max_length=models.Unit._meta.get_field("name").max_length,
        required=False,
    )


@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated])
def ingredient_update(request: Request, ingredient_id: int) -> Response:
    ingredient = shortcuts.get_object_or_404(
        models.Ingredient, pk=ingredient_id, recipe__user=request.user
    )
    serializer = IngredientUpdateSerializer(data=request.data, instance=ingredient)

    if not serializer.is_valid():
        return invalid_request_data_response(serializer)

    try:
        with transaction.atomic():
            if "amount" in serializer.validated_data:
                ingredient.amount = serializer.validated_data["amount"]

            if "unit" in serializer.validated_data:
                ingredient.unit = models.Unit.objects.get_or_create(
                    defaults={"name": serializer.validated_data["unit"]},
                    name__iexact=serializer.validated_data["unit"],
                    user=request.user,
                )[0]

            if "brand" in serializer.validated_data:
                ingredient.brand = models.Brand.objects.get_or_create(
                    defaults={"name": serializer.validated_data["brand"]},
                    name__iexact=serializer.validated_data["brand"],
                    user=request.user,
                )[0]

            ingredient.food = models.Food.objects.get_or_create(
                defaults={"name": serializer.validated_data["food"]},
                name__iexact=serializer.validated_data["food"],
                user=request.user,
            )[0]

            ingredient.save()
    except Error:
        return unprocessable_entity_response(
            message=_("Your information could not be saved.")
        )

    return no_content_response()
