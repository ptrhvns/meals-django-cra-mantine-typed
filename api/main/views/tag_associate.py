from typing import cast

from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer

from main.lib.responses import (
    created_response,
    invalid_request_data_response,
    ok_response,
)
from main.models.recipe import Recipe
from main.models.tag import Tag


class TagAssociateSerializer(ModelSerializer):
    class Meta:
        model = Tag
        fields = ("id", "name")


@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated])  # type: ignore[list-item]
def tag_associate(request: Request, recipe_id: int) -> Response:
    recipe = get_object_or_404(Recipe, pk=recipe_id, user=request.user)
    serializer = TagAssociateSerializer(data=request.data)

    if not serializer.is_valid():
        return invalid_request_data_response(serializer)

    tag = Tag.objects.filter(
        name__iexact=serializer.validated_data["name"], user=request.user
    ).first()

    created = False

    if not tag:
        tag = cast(Tag, serializer.save(user=request.user))
        created = True

    if not tag.recipes.contains(recipe):
        tag.recipes.add(recipe)

    serializer = TagAssociateSerializer(tag)

    if created:
        return created_response(data=serializer.data)
    else:
        return ok_response(data=serializer.data)
