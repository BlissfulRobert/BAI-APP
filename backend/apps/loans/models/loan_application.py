"""LoanApplication model.

Represents a single loan application submitted by a client, optionally
assigned to a broker, and tracked through a lifecycle of statuses.
"""

import uuid

from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models

from loans.choices import ApplicationStatus


class LoanApplication(models.Model):
    """A loan application tied to a client and optionally a broker.

    Tracks the requested amount, chosen lender, current status, and
    audit timestamps (``created_at`` / ``updated_at``).
    """
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    client = models.ForeignKey(
        "users.ClientProfile",
        on_delete=models.PROTECT,
        related_name="loan_applications",
    )

    broker = models.ForeignKey(
        "users.BrokerProfile",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="assigned_applications",
    )

    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(0.01)],
    )

    lender = models.CharField(max_length=255, blank=True)

    status = models.CharField(
        max_length=20,
        choices=ApplicationStatus.choices,
        default=ApplicationStatus.DRAFT,
    )

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="created_applications",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "loan_applications"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["client", "status"]),
            models.Index(fields=["broker", "status"]),
            models.Index(fields=["created_at"]),
        ]

    def __str__(self):
        """Return a human-readable label showing the application ID and status."""
        return f"Application {self.id} — {self.get_status_display()}"