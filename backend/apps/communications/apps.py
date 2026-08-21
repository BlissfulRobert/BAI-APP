"""Django application configuration for the communications app."""

from django.apps import AppConfig


class CommunicationsConfig(AppConfig):
    """App configuration for communication logging.

    Defines the application label and default primary key type
    for all models in the communications app.
    """

    default_auto_field = 'django.db.models.BigAutoField'
    name = 'communications'
