from main.views.csrf_token import csrf_token
from main.views.login import login
from main.views.logout import logout
from main.views.recipe import recipe
from main.views.recipe_create import recipe_create
from main.views.recipe_destroy import recipe_destroy
from main.views.recipe_title_update import recipe_title_update
from main.views.recipes import recipes
from main.views.signup import signup
from main.views.signup_confirmation import signup_confirmation
from main.views.tag import tag
from main.views.tag_associate import tag_associate
from main.views.tag_dissociate import tag_dissociate
from main.views.tag_search import tag_search
from main.views.tag_update import tag_update

__all__ = [
    "csrf_token",
    "login",
    "logout",
    "recipe",
    "recipe_create",
    "recipe_destroy",
    "recipe_title_update",
    "recipes",
    "signup",
    "signup_confirmation",
    "tag",
    "tag_associate",
    "tag_dissociate",
    "tag_search",
    "tag_update",
]
