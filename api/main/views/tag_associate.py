from typing import cast

from django.shortcuts import get_object_or_404
from django.utils.translation import gettext_lazy as _
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer

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
        return Response(
            {
                "errors": serializer.errors,
                "message": _("The information you provided was invalid."),
            },
            status=status.HTTP_422_UNPROCESSABLE_ENTITY,
        )

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

    return Response(
        {"data": serializer.data},
        status=(status.HTTP_201_CREATED if created else status.HTTP_200_OK),
    )
