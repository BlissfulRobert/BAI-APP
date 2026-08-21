"""Choice enumerations for the communications app."""

from django.db import models


class CommunicationsChannel(models.TextChoices):
    """Channel through which a communication message is delivered."""

    EMAIL = "email", "Email"
    SMS = "sms", "SMS"
    IN_APP = "in_app", "In-App Notification"
