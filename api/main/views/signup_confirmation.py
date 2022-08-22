from datetime import datetime
from logging import getLogger
from zoneinfo import ZoneInfo

from django.conf import settings
from django.utils.translation import gettext_lazy as _
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import CharField, ModelSerializer

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
        return Response(
            {
                "errors": serializer.errors,
                "message": _("The information you provided was invalid."),
            },
            status=status.HTTP_422_UNPROCESSABLE_ENTITY,
        )

    token_id = serializer.validated_data.get("token")
    try:
        token = Token.objects.get(token=token_id)
    except Token.DoesNotExist:
        logger.error(
            "sign up confirmation token from request not found: %(token)s",
            {"token": token_id},
        )
        return Response(
            {"message": _("The confirmation ID you provided was invalid.")},
            status=status.HTTP_422_UNPROCESSABLE_ENTITY,
        )

    now = datetime.now().replace(tzinfo=ZoneInfo(settings.TIME_ZONE))
    if token.expiration < now:
        token.delete()
        return Response(
            {"message": _("The confirmation ID you provided was expired.")},
            status=status.HTTP_422_UNPROCESSABLE_ENTITY,
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
    return Response(
        {"message": _("Your signup was successfully confirmed.")},
        status=status.HTTP_200_OK,
    )
