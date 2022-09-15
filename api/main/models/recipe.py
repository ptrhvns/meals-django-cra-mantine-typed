from django.core.validators import MaxValueValidator, MinValueValidator
from django.db.models import (
    CASCADE,
    CharField,
    ForeignKey,
    Model,
    PositiveSmallIntegerField,
)

from main.models.user import User


class Recipe(Model):
    rating = PositiveSmallIntegerField(
        blank=True, null=True, validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    title = CharField(max_length=256)
    user: ForeignKey[User] = ForeignKey(User, on_delete=CASCADE, related_name="recipes")

    def __str__(self) -> str:
        return self.title
