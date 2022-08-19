from typing import TypedDict

from django.conf import settings


# Help prevent the use of invalid routes.
class ClientRouteDict(TypedDict):
    home: str
    signup_confirmation: str


# Routes available on the client app.
urls: ClientRouteDict = {
    "home": settings.BASE_CLIENT_URI,
    "signup_confirmation": settings.BASE_CLIENT_URI + "/signup-confirmation/{token}",
}
