from __future__ import annotations

from django.db.models import CASCADE, SET_NULL, CharField, ForeignKey, Model

from main.models.brand import Brand
from main.models.food import Food
from main.models.recipe import Recipe
from main.models.unit import Unit


class Ingredient(Model):
    amount = CharField(max_length=16)
    brand: ForeignKey[Brand | None] = ForeignKey(
        Brand,
        blank=True,
        null=True,
        on_delete=SET_NULL,
        related_name="ingredients",
    )
    food: ForeignKey[Food] = ForeignKey(
        Food, on_delete=CASCADE, related_name="ingredients"
    )
    recipe: ForeignKey[Recipe] = ForeignKey(
        Recipe, on_delete=CASCADE, related_name="ingredients"
    )
    unit: ForeignKey[Unit | None] = ForeignKey(
        Unit,
        blank=True,
        null=True,
        on_delete=CASCADE,
        related_name="ingredients",
    )

    def __str__(self) -> str:
        return " ".join(
            a
            for a in [
                self.amount,
                self.unit.name if self.unit else None,
                self.brand.name if self.brand else None,
                self.food.name if self.food else None,
            ]
            if a
        )
