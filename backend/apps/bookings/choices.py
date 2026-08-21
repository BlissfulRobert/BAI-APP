"""Choice enumerations for the bookings app."""

from django.db import models


class BookingStatus(models.TextChoices):
    """Lifecycle states for a booking appointment."""

    SCHEDULED = "scheduled", "Scheduled"
    CONFIRMED = "confirmed", "Confirmed"
    CANCELLED = "cancelled", "Cancelled"
    COMPLETED = "completed", "Completed"