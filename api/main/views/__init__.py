from main.views.csrf_token import csrf_token
from main.views.login import login
from main.views.logout import logout
from main.views.signup import signup
from main.views.signup_confirmation import signup_confirmation
from main.views.recipes import recipes

__all__ = [
    "csrf_token",
    "login",
    "logout",
    "recipes",
    "signup",
    "signup_confirmation",
]
