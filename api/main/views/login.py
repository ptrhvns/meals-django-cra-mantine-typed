from logging import getLogger

from django.conf import settings
from django.contrib.auth import authenticate
from django.contrib.auth import login as auth_login
from django.utils.translation import gettext_lazy as _
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import CharField, Serializer

from main.models.user import User

logger = getLogger(__name__)


class LoginSerializer(Serializer):
    password = CharField(
        max_length=User._meta.get_field("password").max_length, required=True
    )
    username = CharField(
        max_length=User._meta.get_field("username").max_length, required=True
    )


@api_view(http_method_names=["POST"])
def login(request: Request) -> Response:
    username = request.data.get("username")
    logger.info("attempting login for username %(username)s", {"username": username})
    serializer = LoginSerializer(data=request.data)

    if not serializer.is_valid():
        logger.warning(
            "login failed with invalid request data for username %(username)s",
            {"username": username},
        )
        return Response(
            {
                "errors": serializer.errors,
                "message": _("The information you provided was invalid."),
            },
            status=status.HTTP_422_UNPROCESSABLE_ENTITY,
        )

    # Authentication will fail if user isn't active.
    user = authenticate(
        request,
        password=serializer.validated_data["password"],
        username=serializer.validated_data["username"],
    )

    if user is None:
        logger.warning(
            "login failed authentication check for username %(username)s",
            {"username": username},
        )
        return Response(
            {
                "message": _(
                    "We couldn't authentication you. Your username or"
                    " password might be wrong, or there might be an"
                    " issue with your account."
                )
            },
            status=status.HTTP_422_UNPROCESSABLE_ENTITY,
        )

    logger.info("login succeeded for username %(username)s", {"username": username})
    auth_login(request, user)

    if request.data.get("remember_me"):
        request.session.set_expiry(settings.SESSION_COOKIE_AGE)
    else:
        request.session.set_expiry(0)

    return Response(status=status.HTTP_204_NO_CONTENT)
