from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer

from main.lib.responses import data_response
from main.models.time import Time


class TimeSerializer(ModelSerializer):
    class Meta:
        model = Time
        fields = ("category", "days", "hours", "id", "minutes", "note")


@api_view(http_method_names=["GET"])
@permission_classes([IsAuthenticated])  # type: ignore[list-item]
def time(request: Request, time_id: int) -> Response:
    time = get_object_or_404(Time, pk=time_id, recipe__user=request.user)
    serializer = TimeSerializer(time)
    return data_response(data=serializer.data)
