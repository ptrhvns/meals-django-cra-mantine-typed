from django.urls import path
from django.urls.resolvers import URLPattern, URLResolver

from main import views

# fmt: off
urlpatterns: list[URLPattern | URLResolver] = [
    path("csrf_token/", views.csrf_token, name="csrf_token"),
    path("login/", views.login, name="login"),
    path("logout/", views.logout, name="logout"),
    path("recipe/<int:recipe_id>/", views.recipe, name="recipe"),
    path("recipe/<int:recipe_id>/destroy/", views.recipe_destroy, name="recipe_destroy"),
    path("recipe/create/", views.recipe_create, name="recipe_create"),
    path("recipe_title/<int:recipe_id>/update/", views.recipe_title_update, name="recipe_title_update"),
    path("recipes/", views.recipes, name="recipes"),
    path("signup/", views.signup, name="signup"),
    path("signup_confirmation/", views.signup_confirmation, name="signup_confirmation"),
]
