# Generated by Django 2.2.1 on 2019-07-17 01:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_auto_20190716_2005'),
    ]

    operations = [
        migrations.AlterField(
            model_name='egresado',
            name='friends',
            field=models.ManyToManyField(blank=True, related_name='_egresado_friends_+', to='users.Egresado'),
        ),
    ]