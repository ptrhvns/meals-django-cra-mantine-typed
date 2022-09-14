from typing import Final, TypedDict

from django.conf import settings

# The default limit for the Mantine Autocomplete component.
MAX_AUTOCOMPLETE_MATCHES: Final = 5


class ClientRouteDict(TypedDict):
    """Help prevent the use if invalid routes."""

    home: str
    signup_confirmation: str


# Routes available on the client app.
urls: ClientRouteDict = {
    "home": settings.BASE_CLIENT_URI,
    "signup_confirmation": settings.BASE_CLIENT_URI + "/signup-confirmation/{token}",
}
