"""Loans app configuration.

Registers the ``loans`` application and sets default model options.
"""

from django.apps import AppConfig


class LoansConfig(AppConfig):
    """Django application configuration for the loans module."""

    default_auto_field = 'django.db.models.BigAutoField'
    name = 'loans'
