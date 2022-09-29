from typing import Any

from django import shortcuts
from django.utils.translation import gettext_lazy as _
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer, ValidationError

from main.lib.responses import invalid_request_data_response, no_content_response
from main.models.time import Time


class TimeUpdateSerializer(ModelSerializer):
    class Meta:
        model = Time
        fields = ("category", "days", "hours", "minutes", "note")

    def validate(self, data: dict[str, Any]) -> dict[str, Any]:
        units = ["days", "hours", "minutes"]
        error = _("At least one unit is required.")
        if not any([data.get(u) for u in units]):
            raise ValidationError({u: error for u in units})
        return data


@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated])
def time_update(request: Request, time_id: int) -> Response:
    time = shortcuts.get_object_or_404(Time, pk=time_id, recipe__user=request.user)

    data = request.data.copy()

    # Convert unit fields with an empty string value to None.
    for k, v in request.data.items():
        if k in ["days", "hours", "minutes"]:
            if not v:
                data[k] = None

    serializer = TimeUpdateSerializer(data=data, instance=time)

    if not serializer.is_valid():
        return invalid_request_data_response(serializer)

    time = serializer.save()
    return no_content_response()
