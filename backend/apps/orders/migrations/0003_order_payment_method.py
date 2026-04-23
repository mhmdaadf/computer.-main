from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("orders", "0002_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="order",
            name="payment_method",
            field=models.CharField(
                choices=[("COD", "Cash on Delivery"), ("CARD", "Card")],
                default="COD",
                max_length=20,
            ),
        ),
    ]
