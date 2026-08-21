"""Document model representing uploaded files for loan applications."""

import uuid

from django.conf import settings
from django.db import models


class Document(models.Model):
    """A file attached to a loan application.

    Tracks the storage path, document type, uploader, and requestor
    for each uploaded document.
    """
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    application = models.ForeignKey(
        "loans.LoanApplication",
        on_delete=models.CASCADE,
        related_name="documents",
    )

    storage_path = models.CharField(
        max_length=500,
        unique=True,
    )

    doc_type = models.CharField(max_length=100)

    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="uploaded_documents",
    )

    requested_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="requested_documents",
    )

    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "documents"
        ordering = ["-uploaded_at"]
        indexes = [
            models.Index(fields=["application", "doc_type"]),
        ]

    def __str__(self):
        """Return document type and UUID."""
        return f"{self.doc_type} ({self.id})"