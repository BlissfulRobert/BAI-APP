# authentication/apps.py
# -----------------------------------------------------------------------
# Django application configuration for the authentication app.
# -----------------------------------------------------------------------

from django.apps import AppConfig


class AuthenticationConfig(AppConfig):
    """Django app configuration for authentication."""

    default_auto_field = "django.db.models.BigAutoField"
    name = "authentication"
