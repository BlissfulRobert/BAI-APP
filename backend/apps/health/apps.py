"""Health app configuration for BAI-APP."""

from django.apps import AppConfig


class HealthConfig(AppConfig):
    """Django app configuration for the health check module."""
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'health'
