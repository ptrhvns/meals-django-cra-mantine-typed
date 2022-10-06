from django.db.models import CASCADE, ForeignKey, Model, TextField

from main.models.recipe import Recipe


class Direction(Model):
    description = TextField()
    recipe: ForeignKey[Recipe] = ForeignKey(
        Recipe, on_delete=CASCADE, related_name="directions"
    )

    def __str__(self) -> str:
        if len(self.description) > 25:
            return f"{self.description[:25]}..."
        else:
            return self.description
