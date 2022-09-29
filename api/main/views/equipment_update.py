from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer

from main.lib.responses import invalid_request_data_response, no_content_response
from main.models.equipment import Equipment


class EquipmentUpdateSerializer(ModelSerializer):
    class Meta:
        model = Equipment
        fields = ("description",)


@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated])
def equipment_update(request: Request, equipment_id: int) -> Response:
    equipment = get_object_or_404(Equipment, pk=equipment_id, user=request.user)
    serializer = EquipmentUpdateSerializer(data=request.data, instance=equipment)

    if not serializer.is_valid():
        return invalid_request_data_response(serializer)

    serializer.save()
    return no_content_response()
