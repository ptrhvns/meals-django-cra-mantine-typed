from __future__ import annotations

from django.db.models import CASCADE, CharField, ForeignKey, ManyToManyField, Model

from .recipe import Recipe
from .user import User


class Tag(Model):
    RECIPE = "Recipe"
    KIND_CHOICES = [(RECIPE, RECIPE)]

    kind = CharField(choices=KIND_CHOICES, max_length=32)
    name = CharField(max_length=256)
    recipes: ManyToManyField[Recipe, "Tag"] = ManyToManyField(
        Recipe, related_name="tags"
    )
    user: ForeignKey[User] = ForeignKey(
        User, blank=False, null=False, on_delete=CASCADE, related_name="tags"
    )

    class Meta:
        unique_together = ["name", "user"]

    def __str__(self) -> str:
        return self.name
