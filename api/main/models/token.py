from django.db.models import CASCADE, CharField, DateTimeField, ForeignKey, Model

from main.lib.tokens import build_token
from main.models.user import User


class Token(Model):
    EMAIL_CONFIRMATION = "email_confirmation"
    TOKEN_TYPE_CHOICES = [(EMAIL_CONFIRMATION, "Email Confirmation")]

    expiration = DateTimeField()
    token = CharField(max_length=256, default=build_token, unique=True)
    token_type = CharField(choices=TOKEN_TYPE_CHOICES, max_length=32)
    user: ForeignKey[User] = ForeignKey(User, on_delete=CASCADE, related_name="tokens")

    def __str__(self) -> str:
        return self.token
