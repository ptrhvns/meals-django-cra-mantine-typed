from django.db.models import Deferrable  # type: ignore[attr-defined]
from django.db.models import (
    CASCADE,
    ForeignKey,
    Model,
    PositiveIntegerField,
    TextField,
    UniqueConstraint,
)

from main.models.recipe import Recipe


class Direction(Model):
    description = TextField()
    order = PositiveIntegerField(default=0)
    recipe: ForeignKey[Recipe] = ForeignKey(
        Recipe, on_delete=CASCADE, related_name="directions"
    )

    class Meta:
        constraints = [
            UniqueConstraint(
                deferrable=Deferrable.DEFERRED,  # type: ignore[call-arg]
                fields=["order", "recipe"],
                name="direction_unique_order_recipe",
            )
        ]

    def __str__(self) -> str:
        if len(self.description) > 25:
            return f"{self.description[:25]}..."
        else:
            return self.description
