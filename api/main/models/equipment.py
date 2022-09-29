from __future__ import annotations

from django.conf import settings
from django.db.models import CASCADE, CharField, ForeignKey, ManyToManyField, Model

from main.models.recipe import Recipe
from main.models.user import User


class Equipment(Model):
    description = CharField(max_length=256)
    recipes: ManyToManyField[Recipe, "Equipment"] = ManyToManyField(
        Recipe, related_name="equipment"
    )
    user: ForeignKey[User] = ForeignKey(
        settings.AUTH_USER_MODEL,
        blank=False,
        null=False,
        on_delete=CASCADE,
        related_name="equipment",
    )

    class Meta:
        unique_together = ["description", "user"]

    def __str__(self) -> str:
        return self.description
