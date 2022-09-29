from django.shortcuts import get_object_or_404
from django.utils.translation import gettext_lazy as _
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer

from main.lib.responses import (
    invalid_request_data_response,
    no_content_response,
    unprocessable_entity_response,
)
from main.models import Tag


class TagUpdateForRecipeSerializer(ModelSerializer):
    class Meta:
        model = Tag
        fields = ("name",)


@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated])
def tag_update(request: Request, tag_id: int) -> Response:
    tag = get_object_or_404(Tag, pk=tag_id, user=request.user)
    serializer = TagUpdateForRecipeSerializer(instance=tag, data=request.data)

    if not serializer.is_valid():
        return invalid_request_data_response(serializer)

    # Use the following test instead of a serializer validator to ensure a
    # better user experience.
    if Tag.objects.filter(
        name=serializer.validated_data["name"], user=request.user
    ).exists():
        return unprocessable_entity_response(
            errors={"name": [_("This name is already taken.")]},
            message=_("The information you provided could not be saved."),
        )

    serializer.save()
    return no_content_response()
