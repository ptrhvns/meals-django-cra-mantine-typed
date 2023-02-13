from django.db.transaction import atomic
from django.utils.translation import gettext_lazy as _
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer

from main.lib.responses import invalid_request_data_response, no_content_response, unprocessable_entity_response
from main.models.direction import Direction


class DirectionUpdateSerializer(ModelSerializer):
    class Meta:
        model = Direction
        fields = ("description", "order")


@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated])
def direction_update(request: Request, direction_id: int) -> Response:
    direction = get_object_or_404(Direction, pk=direction_id, recipe__user=request.user)
    serializer = DirectionUpdateSerializer(data=request.data, instance=direction)

    if not serializer.is_valid():
        return invalid_request_data_response(serializer)

    request_order = serializer.validated_data["order"]
    max_order = Direction.objects.filter(recipe=direction.recipe).count()

    if request_order < 1 or request_order > max_order:
        return unprocessable_entity_response(message=_("The order selected is invalid."))

    if request_order != direction.order:
        direction2 = Direction.objects.filter(
            order=serializer.validated_data["order"],
            recipe=direction.recipe,
        ).first()
        if direction2:
            with atomic():
                direction.order, direction2.order = direction2.order, direction.order
                direction.save()
                direction2.save()

    serializer.save()
    return no_content_response()
