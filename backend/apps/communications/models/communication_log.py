"""CommunicationLog model – audit trail for outbound messages."""

import uuid

from django.conf import settings
from django.db import models

from communications.choices import CommunicationsChannel


class CommunicationLog(models.Model):
    """Audit record for a single communication message.

    Tracks the sender, recipient, delivery channel, and timestamp
    for every message sent through the platform. Optionally linked
    to a loan application for context.
    """

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    application = models.ForeignKey(
        "loans.LoanApplication",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="communications",
    )

    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="sent_messages",
    )

    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="received_messages",
    )

    channel = models.CharField(
        max_length=20,
        choices=CommunicationsChannel.choices,
    )

    subject = models.CharField(max_length=255, blank=True)
    sent_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "communication_logs"
        ordering = ["-sent_at"]
        indexes = [
            models.Index(fields=["application", "sent_at"]),
            models.Index(fields=["recipient", "sent_at"]),
        ]

    def __str__(self):
        """Return a human-readable summary of the communication."""
        return (
            f"{self.get_channel_display()} "
            f"to {self.recipient_id} at {self.sent_at}"
        )
