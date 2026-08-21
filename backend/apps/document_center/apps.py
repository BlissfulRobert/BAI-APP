"""Django application configuration for the document_center app."""

from django.apps import AppConfig


class DocumentCenterConfig(AppConfig):
    """App configuration for the document center.

    Manages document uploads, storage, and retrieval tied to loan applications.
    """
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'document_center'
