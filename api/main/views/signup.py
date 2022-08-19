import logging
from datetime import timedelta
from typing import Any, cast

from django.utils.timezone import now
from django.utils.translation import gettext_lazy as _
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import CharField, EmailField, ModelSerializer
from rest_framework.validators import UniqueValidator

from main.lib import client
from main.models.token import Token
from main.models.user import User
from main.tasks.send_signup_confirmation import send_signup_confirmation

logger = logging.getLogger(__name__)


class SignupSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email", "password")

    email = EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())],
    )

    username = CharField(validators=[UniqueValidator(queryset=User.objects.all())])

    password = CharField(required=True, min_length=8)

    def create(self, validated_data: Any) -> User:
        user = User.objects.create_user(  # type: ignore[attr-defined]
            validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )

        logger.info("created new user with ID %(user_id)s", {"user_id": user.id})
        return cast(User, user)


@api_view(http_method_names=["POST"])
def signup(request: Request) -> Response:
    serializer = SignupSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(
            {
                "errors": serializer.errors,
                "message": _("The information you provided was invalid."),
            },
            status=status.HTTP_422_UNPROCESSABLE_ENTITY,
        )

    user = serializer.save()

    token = Token.objects.create(
        expiration=now() + timedelta(hours=24),
        token_type=Token.EMAIL_CONFIRMATION,
        user=user,
    )

    site_url = client.urls["home"]
    confirmation_url = client.urls["signup_confirmation"].format(token=token.token)

    logger.info(
        "dispatching task send_signup_confirmation for user ID %(user_id)s",
        {"user_id": user.id},
    )

    send_signup_confirmation.delay(user.id, site_url, confirmation_url)

    return Response(
        {
            "message": _(
                "You were signed up successfully. Check your email to confirm your account."
            )
        },
        status=status.HTTP_201_CREATED,
    )
