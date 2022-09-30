from django.db.models import CASCADE, CharField, ForeignKey, Model

from main.models.user import User


class Unit(Model):
    name = CharField(max_length=256)
    user: ForeignKey[User] = ForeignKey(
        User,
        blank=False,
        null=False,
        on_delete=CASCADE,
        related_name="units",
    )

    class Meta:
        unique_together = ["name", "user"]

    def __str__(self) -> str:
        return self.name
