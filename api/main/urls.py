from django.urls import path
from django.urls.resolvers import URLPattern, URLResolver

from main import views

urlpatterns: list[URLPattern | URLResolver] = [
    path("signup/", views.signup, name="signup"),
    path("csrf_token/", views.csrf_token, name="csrf_token"),
]
