"""Django application configuration for the users app."""

from django.apps import AppConfig


class UsersConfig(AppConfig):
    """App configuration for user management.

    Defines the application label and default primary key type
    for all models in the users app.
    """

    default_auto_field = "django.db.models.BigAutoField"
    name = "users"
