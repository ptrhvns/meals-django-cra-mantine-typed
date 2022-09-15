from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from main import models
from main.lib.responses import no_content_response


@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated])  # type: ignore[list-item]
def rating_destroy(request: Request, recipe_id: int) -> Response:
    recipe = get_object_or_404(models.Recipe, pk=recipe_id, user=request.user)
    recipe.rating = None
    recipe.save()
    return no_content_response()
