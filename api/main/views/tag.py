from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer

from main.models import Tag


class TagSerializer(ModelSerializer):
    class Meta:
        model = Tag
        fields = ("name",)


@api_view(http_method_names=["GET"])
@permission_classes([IsAuthenticated])  # type: ignore[list-item]
def tag(request: Request, tag_id: int) -> Response:
    tag = get_object_or_404(Tag, pk=tag_id, user=request.user)
    serializer = TagSerializer(tag)
    return Response({"data": serializer.data})
