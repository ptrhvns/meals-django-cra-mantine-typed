# Generated by Django 4.1.1 on 2022-09-30 21:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("main", "0013_brand_food_unit_ingredient"),
    ]

    operations = [
        migrations.AlterField(
            model_name="ingredient",
            name="amount",
            field=models.CharField(blank=True, max_length=16),
        ),
    ]
