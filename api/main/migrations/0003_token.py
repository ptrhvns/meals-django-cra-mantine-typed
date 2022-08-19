# Generated by Django 4.1 on 2022-08-19 22:51

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import main.lib.tokens


class Migration(migrations.Migration):

    dependencies = [
        ("main", "0002_user_email_confirmed_datetime_alter_user_email_and_more"),
    ]

    operations = [
        migrations.CreateModel(
            name="Token",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("expiration", models.DateTimeField()),
                (
                    "token",
                    models.CharField(
                        default=main.lib.tokens.build_token, max_length=256, unique=True
                    ),
                ),
                (
                    "token_type",
                    models.CharField(
                        choices=[("email_confirmation", "Email Confirmation")],
                        max_length=32,
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="tokens",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
    ]
