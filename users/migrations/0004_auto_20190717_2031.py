# Generated by Django 2.2.1 on 2019-07-18 01:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_auto_20190716_2015'),
    ]

    operations = [
        migrations.AlterField(
            model_name='evento',
            name='url',
            field=models.ImageField(upload_to='event_img'),
        ),
    ]