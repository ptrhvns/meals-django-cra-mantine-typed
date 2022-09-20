from django.urls import path
from django.urls.resolvers import URLPattern, URLResolver

from main import views

# fmt: off
urlpatterns: list[URLPattern | URLResolver] = [
    path("csrf_token/", views.csrf_token, name="csrf_token"),
    path("login/", views.login, name="login"),
    path("logout/", views.logout, name="logout"),
    path("rating/<int:recipe_id>/", views.rating, name="rating"),
    path("rating/<int:recipe_id>/destroy/", views.rating_destroy, name="rating_destroy"),
    path("rating/<int:recipe_id>/update/", views.rating_update, name="rating_update"),
    path("recipe/<int:recipe_id>/", views.recipe, name="recipe"),
    path("recipe/<int:recipe_id>/destroy/", views.recipe_destroy, name="recipe_destroy"),
    path("recipe/<int:recipe_id>/time/create/", views.time_create, name="time_create"),
    path("recipe/create/", views.recipe_create, name="recipe_create"),
    path("recipe_title/<int:recipe_id>/update/", views.recipe_title_update, name="recipe_title_update"),
    path("recipes/", views.recipes, name="recipes"),
    path("signup/", views.signup, name="signup"),
    path("signup_confirmation/", views.signup_confirmation, name="signup_confirmation"),
    path("tag/<int:tag_id>/", views.tag, name="tag"),
    path("tag/<int:tag_id>/recipe/<int:recipe_id>/dissociate/", views.tag_dissociate, name="tag_dissociate"),
    path("tag/<int:tag_id>/update/", views.tag_update, name="tag_update"),
    path("tag/recipe/<int:recipe_id>/associate/", views.tag_associate, name="tag_associate"),
    path("tag/search/", views.tag_search, name="tag_search"),
    path("time/<int:time_id>/", views.time, name="time"),
    path("time/<int:time_id>/destroy/", views.time_destroy, name="time_destroy"),
    path("time/<int:time_id>/update/", views.time_update, name="time_update"),
]
