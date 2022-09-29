from django.db.models.functions import Length
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from main.lib.client import MAX_AUTOCOMPLETE_MATCHES
from main.lib.responses import data_response
from main.models.equipment import Equipment


@api_view(http_method_names=["GET"])
@permission_classes([IsAuthenticated])
def equipment_search(request: Request) -> Response:
    if not (search_term := request.query_params.get("search_term")):
        return data_response(data={"matches": []})

    equipment = Equipment.objects.filter(
        description__icontains=search_term, user=request.user
    ).order_by(Length("description").asc())[:MAX_AUTOCOMPLETE_MATCHES]

    return data_response(data={"matches": [r.description for r in equipment]})
