# authentication/choices.py
# -----------------------------------------------------------------------
# Text-choice enumerations used by authentication models.
# -----------------------------------------------------------------------

from django.db import models


class InviteStatus(models.TextChoices):
    """Lifecycle states for an invitation record."""

    PENDING = "pending", "Pending"
    ACCEPTED = "accepted", "Accepted"
    EXPIRED = "expired", "Expired"
    REVOKED = "revoked", "Revoked"