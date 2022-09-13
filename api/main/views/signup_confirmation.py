from datetime import datetime
from logging import getLogger
from zoneinfo import ZoneInfo

from django.conf import settings
from django.utils.translation import gettext_lazy as _
from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import CharField, ModelSerializer

from main.lib.responses import (
    invalid_request_data_response,
    ok_response,
    unprocessable_entity_response,
)
from main.models.token import Token

logger = getLogger(__name__)


class SignupConfirmationSerializer(ModelSerializer):
    class Meta:
        model = Token
        fields = ("token",)

    token = CharField(max_length=256, required=True)


@api_view(http_method_names=["POST"])
def signup_confirmation(request: Request) -> Response:
    serializer = SignupConfirmationSerializer(data=request.data)

    if not serializer.is_valid():
        return invalid_request_data_response(serializer)

    token_id = serializer.validated_data.get("token")

    try:
        token = Token.objects.get(token=token_id)
    except Token.DoesNotExist:
        logger.error(
            "sign up confirmation token from request not found: %(token)s",
            {"token": token_id},
        )
        return unprocessable_entity_response(
            message=_("The confirmation ID you provided was invalid.")
        )

    now = datetime.now().replace(tzinfo=ZoneInfo(settings.TIME_ZONE))

    if token.expiration < now:
        token.delete()
        return unprocessable_entity_response(
            message=_("The confirmation ID you provided was expired.")
        )

    user = token.user
    token.delete()
    user.email_confirmed_datetime = now
    user.is_active = True
    user.save()
    logger.info(
        "set user with ID %(user_id)s to active",
        {"user_id": user.id},  # type: ignore[attr-defined]
    )

    return ok_response(message=_("Your signup was successfully confirmed."))
