from django.core import exceptions
from django.db.models import CASCADE, CharField, ForeignKey, Model, PositiveIntegerField
from django.utils.translation import gettext_lazy as _

from main.models.recipe import Recipe


class Time(Model):
    ADDITIONAL = "Additional"
    COOK = "Cook"
    PREPARATION = "Preparation"
    TOTAL = "Total"
    CATEGORY_CHOICES = [
        (ADDITIONAL, "Additional"),
        (COOK, "Cook"),
        (PREPARATION, "Preparation"),
        (TOTAL, "Total"),
    ]

    category = CharField(choices=CATEGORY_CHOICES, max_length=20)
    days = PositiveIntegerField(blank=True, null=True)
    hours = PositiveIntegerField(blank=True, null=True)
    minutes = PositiveIntegerField(blank=True, null=True)
    note = CharField(blank=True, default="", max_length=2**6)
    recipe = ForeignKey(Recipe, on_delete=CASCADE, related_name="recipe_times")

    def __str__(self) -> str:
        d = f"{self.days}d" if self.days else None
        h = f"{self.hours}h" if self.hours else None
        m = f"{self.minutes}m" if self.minutes else None
        times = " ".join([t for t in [d, h, m] if t])
        return f"{self.category}: {times}"

    def clean(self) -> None:
        units = ["days", "hours", "minutes"]
        if not any([getattr(self, u) for u in units]):
            error = _("At least one unit is required.")
            raise exceptions.ValidationError({u: error for u in units})
