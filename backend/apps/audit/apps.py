"""Django application configuration for the audit app."""

from django.apps import AppConfig


class AuditConfig(AppConfig):
    """App configuration for audit logging.

    Defines the application label and default primary key type
    for all models in the audit app.
    """

    default_auto_field = 'django.db.models.BigAutoField'
    name = 'audit'
