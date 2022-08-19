from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response


@ensure_csrf_cookie
@api_view(http_method_names=["GET"])
def csrf_token(request: Request) -> Response:
    return Response(status=status.HTTP_204_NO_CONTENT)
