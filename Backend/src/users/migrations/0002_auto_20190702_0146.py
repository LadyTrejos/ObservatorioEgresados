# Generated by Django 2.2.1 on 2019-07-02 06:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='egresado',
            name='date_of_birth',
            field=models.DateField(default='01-01-2000'),
        ),
    ]