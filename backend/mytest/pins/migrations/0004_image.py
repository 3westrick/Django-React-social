# Generated by Django 4.2.3 on 2023-07-22 19:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("pins", "0003_pin_url"),
    ]

    operations = [
        migrations.CreateModel(
            name="Image",
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
                ("image", models.ImageField(upload_to="")),
            ],
        ),
    ]
