"""Profile models for client and broker user types."""

from django.conf import settings
from django.db import models

from users.choices import VerificationStatus


class ClientProfile(models.Model):
    """Verification profile linked one-to-one with a client User.

    Tracks the client's verification status and records which admin
    verified the client and when.
    """
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        primary_key=True,
        on_delete=models.CASCADE,
        related_name="client_profile",
    )

    verification_status = models.CharField(
        max_length=20,
        choices=VerificationStatus.choices,
        default=VerificationStatus.PENDING,
    )

    verified_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="verified_clients",
    )

    verified_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "client_profiles"

    def __str__(self):
        """Return a human-readable label for the client profile."""
        return f"Client profile: {self.user_id}"


class BrokerProfile(models.Model):
    """Approval profile linked one-to-one with a broker User.

    Stores the broker's license number and records which admin
    approved the broker and when.
    """
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        primary_key=True,
        on_delete=models.CASCADE,
        related_name="broker_profile",
    )

    license_no = models.CharField(
        max_length=100,
        unique=True,
    )

    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="approved_brokers",
    )

    approved_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "broker_profiles"

    def __str__(self):
        """Return the broker's license number as the string representation."""
        return f"Broker profile: {self.license_no}"