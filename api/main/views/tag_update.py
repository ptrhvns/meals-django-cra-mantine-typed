from django.shortcuts import get_object_or_404
from django.utils.translation import gettext_lazy as _
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer

from main.models import Tag


class TagUpdateForRecipeSerializer(ModelSerializer):
    class Meta:
        model = Tag
        fields = ("name",)


@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated])  # type: ignore[list-item]
def tag_update(request: Request, tag_id: int) -> Response:
    tag = get_object_or_404(Tag, pk=tag_id, user=request.user)
    serializer = TagUpdateForRecipeSerializer(instance=tag, data=request.data)

    if not serializer.is_valid():
        return Response(
            {
                "errors": serializer.errors,
                "message": _("The information you provided was invalid."),
            },
            status=status.HTTP_422_UNPROCESSABLE_ENTITY,
        )

    if Tag.objects.filter(
        name__iexact=serializer.validated_data["name"], user=request.user
    ).exists():
        return Response(
            {
                "errors": {"name": [_("This name is already taken.")]},
                "message": _("The information you provided could not be saved."),
            },
            status=status.HTTP_422_UNPROCESSABLE_ENTITY,
        )

    serializer.save()
    return Response(status=status.HTTP_204_NO_CONTENT)
