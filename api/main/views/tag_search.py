from django.db.models.functions import Length
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from main.client import MAX_AUTOCOMPLETE_MATCHES
from main.models import Tag


@api_view(http_method_names=["GET"])
@permission_classes([IsAuthenticated])  # type: ignore[list-item]
def tag_search(request: Request) -> Response:
    if not (search_term := request.query_params.get("search_term")):
        return Response({"data": {"matches": []}})

    tags = Tag.objects.filter(name__icontains=search_term, user=request.user).order_by(
        Length("name").asc()
    )[:MAX_AUTOCOMPLETE_MATCHES]

    return Response({"data": {"matches": [t.name for t in tags]}})
