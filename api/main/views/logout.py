from django.contrib.auth import logout as auth_logout
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response


@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated])  # type: ignore[list-item]
def logout(request: Request) -> Response:
    auth_logout(request)
    return Response(status=status.HTTP_204_NO_CONTENT)
