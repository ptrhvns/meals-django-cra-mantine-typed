from django.urls import path
from django.urls.resolvers import URLPattern, URLResolver

from main import views

urlpatterns: list[URLPattern | URLResolver] = [
    path("csrf_token/", views.csrf_token, name="csrf_token"),
    path("login/", views.login, name="login"),
    path("logout/", views.logout, name="logout"),
    path("recipes/", views.recipes, name="recipes"),
    path("signup/", views.signup, name="signup"),
    path("signup_confirmation/", views.signup_confirmation, name="signup_confirmation"),
]
