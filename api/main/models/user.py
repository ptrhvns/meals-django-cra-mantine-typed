from django.contrib.auth.models import AbstractUser
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.db.models import BooleanField, CharField, DateTimeField, EmailField
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    username_validator = UnicodeUsernameValidator()

    email = EmailField(_("email address"), blank=False)
    email_confirmed_datetime = DateTimeField(blank=True, null=True)
    is_active = BooleanField(
        _("active"),
        default=False,
        help_text=_(
            "Designates whether this user should be treated as active. "
            "Unselect this instead of deleting accounts."
        ),
    )
    username = CharField(
        _("username"),
        error_messages={"unique": _("That username already exists.")},
        help_text=_("At most 150 characters. Letters, numbers, @/./+/-/_."),
        max_length=150,
        unique=True,
        validators=[username_validator],
    )

    def __str__(self) -> str:
        return self.username
