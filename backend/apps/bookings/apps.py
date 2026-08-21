"""Django application configuration for the bookings app."""

from django.apps import AppConfig


class BookingsConfig(AppConfig):
    """App configuration for appointment and booking management.

    Defines the application label and default primary key type
    for all models in the bookings app.
    """

    default_auto_field = 'django.db.models.BigAutoField'
    name = 'bookings'
