"""Serializers for the bookings app.
"""

from rest_framework import serializers
from django.utils import timezone
from bookings.models import Booking
from bookings.choices import BookingStatus
from users.models import BrokerProfile
from users.choices import UserRole

class ClientBookingCreateSerializer(serializers.ModelSerializer):
    """Allows an authenticated client to book a slot with their designated broker."""

    broker = serializers.PrimaryKeyRelatedField(
        queryset=BrokerProfile.objects.filter(user__is_active=True),
        required=False,
        allow_null=True
    )
    slot_time = serializers.DateTimeField(required=True)
    consultation_type = serializers.CharField(max_length=100, default="Strategy Consultation")
    meeting_platform = serializers.CharField(max_length=50, default="Google Meet")
    notes = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = Booking
        fields = [
            "id",
            "broker",
            "slot_time",
            "consultation_type",
            "meeting_platform",
            "notes",
            "status",
            "created_at",
        ]
        read_only_fields = ["id", "status", "created_at"]

    def validate_slot_time(self, value):
        if value <= timezone.now():
            raise serializers.ValidationError("Booking slot must be in the future.")
        return value

    def create(self, validated_data):
        request = self.context["request"]
        user = request.user

        if user.role != UserRole.CLIENT:
            raise serializers.ValidationError("Only clients can book consultation slots.")

        client_profile = user.client_profile
        slot_time = validated_data["slot_time"]

        selected_broker = validated_data.pop("broker", None)

        designated_broker = selected_broker
        if not designated_broker:
            # Fallback 1: Loan application broker
            latest_app = client_profile.loan_applications.first()
            if latest_app and latest_app.broker:
                designated_broker = latest_app.broker
            # Fallback 2: Inviting broker
            elif user.invited_by and user.invited_by.role == UserRole.BROKER:
                designated_broker = getattr(user.invited_by, "broker_profile", None)
            # Fallback 3: First active broker
            else:
                designated_broker = BrokerProfile.objects.filter(user__is_active=True).first()

        if not designated_broker:
            raise serializers.ValidationError({"broker": "No available broker found forbooking."})

        # Check if broker already has a booking at this time
        if Booking.objects.filter(
            broker=designated_broker,
            slot_time=slot_time,
            status__in=[BookingStatus.SCHEDULED, BookingStatus.CONFIRMED]
        ).exists():
             raise serializers.ValidationError({"slot_time": "The selected broker already has a meeting scheduled at this time."})

        return Booking.objects.create(
            broker=designated_broker,
            client=client_profile,
            status=BookingStatus.SCHEDULED,
            **validated_data
        )
class BookingDetailSerializer(serializers.ModelSerializer):
    """Serializer for displaying booking details on calendars/dashboards."""

    broker_name = serializers.SerializerMethodField()
    broker_email = serializers.SerializerMethodField()
    client_name = serializers.SerializerMethodField()
    client_email = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = [
            "id",
            "broker_id",
            "broker_name",
            "broker_email",
            "client_id",
            "client_name",
            "client_email",
            "slot_time",
            "consultation_type",
            "meeting_platform",
            "notes",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def get_broker_name(self, obj):
        if obj.broker and obj.broker.user:
            u = obj.broker.user
            return f"{u.first_name} {u.last_name}".strip() or u.email
        return "Unknown Broker"

    def get_broker_email(self, obj):
        return obj.broker.user.email if obj.broker and obj.broker.user else None

    def get_client_name(self, obj):
        if obj.client and obj.client.user:
            u = obj.client.user
            return f"{u.first_name} {u.last_name}".strip() or u.email

        return "Unknown Client"

    def get_client_email(self, obj):
        return obj.client.user.email if obj.client and obj.client.user else None

class BookingStatusUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating status (cancel, confirm, reschedule)."""

    class Meta:
        model = Booking
        fields = ["status", "slot_time", "notes"]

class BrokerOptionSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    email = serializers.EmailField(source="user.email")

    class Meta:
        model = BrokerProfile
        fields = ["user_id", "name", "email", "license_no"]

    def get_name(self, obj):
        name = f"{obj.user.first_name} {obj.user.last_name}".strip()
        return name if name else obj.user.email
    