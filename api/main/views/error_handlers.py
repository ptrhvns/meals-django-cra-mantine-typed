from typing import Optional

from django.http import HttpRequest, JsonResponse
from rest_framework import status


def bad_request(
    request: HttpRequest, exception: Optional[Exception] = None
) -> JsonResponse:
    return JsonResponse(
        {"message": "Your request was invalid."}, status=status.HTTP_400_BAD_REQUEST
    )


def forbidden(
    request: HttpRequest, exception: Optional[Exception] = None
) -> JsonResponse:
    return JsonResponse(
        {"message": "Your request was not authorized."},
        status=status.HTTP_403_FORBIDDEN,
    )


def not_found(
    request: HttpRequest, exception: Optional[Exception] = None
) -> JsonResponse:
    return JsonResponse(
        {"message": "A resource matching your request was not found."},
        status=status.HTTP_404_NOT_FOUND,
    )


def internal_server_error(
    request: HttpRequest, exception: Optional[Exception] = None
) -> JsonResponse:
    return JsonResponse(
        {"message": "An error occurred while processing your request."},
        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )
