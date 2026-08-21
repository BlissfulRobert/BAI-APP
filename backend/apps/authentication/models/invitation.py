# authentication/models/invitation.py
# -----------------------------------------------------------------------
# Invitation model — tracks invite tokens, status, and expiry for
# onboarding new users or granting access to an existing user.
# -----------------------------------------------------------------------

import secrets
import uuid

from django.conf import settings
from django.db import models

from authentication.choices import InviteStatus


class Invitation(models.Model):
    """Represents a single invitation, bound to a user, with a unique token and expiry."""

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="invitations",
    )

    token = models.CharField(
        max_length=255,
        unique=True,
        default=secrets.token_urlsafe,
        editable=False,
    )

    expires_at = models.DateTimeField()

    status = models.CharField(
        max_length=20,
        choices=InviteStatus.choices,
        default=InviteStatus.PENDING,
    )

    sent_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="sent_invitations",
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "invitations"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["status", "expires_at"]),
        ]

    def __str__(self):
        """Return a human-readable summary of the invitation."""
        return f"Invitation for {self.user_id} — {self.status}"