from main.views.csrf_token import csrf_token
from main.views.login import login
from main.views.logout import logout
from main.views.recipe_create import recipe_create
from main.views.recipes import recipes
from main.views.signup import signup
from main.views.signup_confirmation import signup_confirmation

__all__ = [
    "csrf_token",
    "login",
    "logout",
    "recipe_create",
    "recipes",
    "signup",
    "signup_confirmation",
]
