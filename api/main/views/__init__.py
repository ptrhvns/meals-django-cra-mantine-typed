from main.views.brand_search import brand_search
from main.views.csrf_token import csrf_token
from main.views.direction import direction
from main.views.direction_create import direction_create
from main.views.direction_destroy import direction_destroy
from main.views.direction_update import direction_update
from main.views.equipment import equipment
from main.views.equipment_associate import equipment_associate
from main.views.equipment_dissociate import equipment_dissociate
from main.views.equipment_search import equipment_search
from main.views.equipment_update import equipment_update
from main.views.food_search import food_search
from main.views.ingredient import ingredient
from main.views.ingredient_associate import ingredient_associate
from main.views.ingredient_destroy import ingredient_destroy
from main.views.ingredient_update import ingredient_update
from main.views.login import login
from main.views.logout import logout
from main.views.notes import notes
from main.views.notes_destroy import notes_destroy
from main.views.notes_update import notes_update
from main.views.rating import rating
from main.views.rating_destroy import rating_destroy
from main.views.rating_update import rating_update
from main.views.recipe import recipe
from main.views.recipe_create import recipe_create
from main.views.recipe_destroy import recipe_destroy
from main.views.recipe_title_update import recipe_title_update
from main.views.recipes import recipes
from main.views.servings import servings
from main.views.servings_destroy import servings_destroy
from main.views.servings_update import servings_update
from main.views.signup import signup
from main.views.signup_confirmation import signup_confirmation
from main.views.tag import tag
from main.views.tag_associate import tag_associate
from main.views.tag_dissociate import tag_dissociate
from main.views.tag_search import tag_search
from main.views.tag_update import tag_update
from main.views.time import time
from main.views.time_create import time_create
from main.views.time_destroy import time_destroy
from main.views.time_update import time_update
from main.views.unit_search import unit_search

__all__ = [
    "brand_search",
    "csrf_token",
    "direction",
    "direction_create",
    "direction_destroy",
    "direction_update",
    "equipment",
    "equipment_associate",
    "equipment_dissociate",
    "equipment_search",
    "equipment_update",
    "food_search",
    "ingredient",
    "ingredient_associate",
    "ingredient_destroy",
    "ingredient_update",
    "login",
    "logout",
    "notes",
    "notes_destroy",
    "notes_update",
    "rating",
    "rating_destroy",
    "rating_update",
    "recipe",
    "recipe_create",
    "recipe_destroy",
    "recipe_title_update",
    "recipes",
    "servings",
    "servings_destroy",
    "servings_update",
    "signup",
    "signup_confirmation",
    "tag",
    "tag_associate",
    "tag_dissociate",
    "tag_search",
    "tag_update",
    "time",
    "time_create",
    "time_destroy",
    "time_update",
    "unit_search",
]
