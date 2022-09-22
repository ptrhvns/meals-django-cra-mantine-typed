# Generated by Django 4.1.1 on 2022-09-22 14:03

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("main", "0009_alter_time_recipe"),
    ]

    operations = [
        migrations.AddField(
            model_name="recipe",
            name="servings",
            field=models.DecimalField(
                blank=True,
                decimal_places=2,
                max_digits=6,
                null=True,
                validators=[django.core.validators.MinValueValidator(0)],
            ),
        ),
    ]
