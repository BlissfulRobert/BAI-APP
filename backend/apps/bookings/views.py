# bookings/views.py
# -----------------------------------------------------------------------
# Define your booking-related API views here.
#
# Examples:
#   - BookingListView          – GET  /api/bookings/
#   - BookingDetailView        – GET  /api/bookings/<id>/
#   - BookingCreateView        – POST /api/bookings/
#   - BookingUpdateView        – PUT  /api/bookings/<id>/
#   - BookingCancelView        – POST /api/bookings/<id>/cancel/
#
# Use DRF generics or viewsets:
#   from rest_framework import generics, viewsets
# -----------------------------------------------------------------------
 # apps/bookings/views.py

from datetime import datetime
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from django.utils import timezone

from users.choices import UserRole
from users.models import BrokerProfile
from bookings.models import Booking
from bookings.choices import BookingStatus
from bookings.serializers import (
    ClientBookingCreateSerializer,
    BookingDetailSerializer,
    BookingStatusUpdateSerializer,
    BrokerOptionSerializer
)

class AvailableSlotsView(APIView):
    """Returns available consultation slots for the logged-in client's designated broker."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        date_str = "".join(request.query_params.get("date", "").split()) # YYYY-MM-DD
        if not date_str:
            return Response(
                {"error": "Query parameter 'date' (YYYY-MM-DD) is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        broker_id = request.query_params.get("broker_id") or request.query_params.get("broker")
        if broker_id:
            broker_id = "".join(broker_id.split())
        user = request.user
        designated_broker = None

        if broker_id:
            designated_broker = BrokerProfile.objects.filter(user_id=broker_id, user__is_active=True).first()
            if not designated_broker:
                return Response (
                    {"error": f"Broker with id '{broker_id}' not found or inactive."},
                    status=status.HTTP_404_NOT_FOUND,
                )
        elif user.role == UserRole.CLIENT:
            client_profile = user.client_profile
            latest_app = client_profile.loan_applications.first()
            if latest_app and latest_app.broker:
                designated_broker = latest_app.broker
            elif user.invited_by and user.invited_by.role == UserRole.BROKER:
                designated_broker = getattr(user.invited_by, "broker_profile", None)
        elif user.role == UserRole.BROKER:
            designated_broker = user.broker_profile

        if not designated_broker:
            designated_broker = BrokerProfile.objects.filter(user__is_active=True).first()

        if not designated_broker:
            return Response({"date": date_str, "available_slots": []})

        standard_slots = ["09:00", "10:00", "11:30", "14:00", "15:30", "16:30"]
        available_slots = []

        for slot in standard_slots:
            slot_dt_str = f"{date_str} {slot}:00"
            try:
                naive_dt = datetime.strptime(slot_dt_str, "%Y-%m-%d %H:%M:%S")
                slot_dt = timezone.make_aware(naive_dt) if getattr(settings, "USE_TZ", False) else naive_dt
            except ValueError:
                continue
            if slot_dt <= timezone.now():
                continue

            is_booked = Booking.objects.filter(
                broker=designated_broker,
                slot_time=slot_dt,
                 status__in=[BookingStatus.SCHEDULED, BookingStatus.CONFIRMED],
            ).exists()

            if not is_booked:
                available_slots.append(slot)
                
        return Response({
            "date": date_str,
            "broker_id": str(designated_broker.user_id),
            "broker_name": f"{designated_broker.user.first_name} {designated_broker.user.last_name}".strip() or designated_broker.user.email,
            "available_slots": available_slots,
        })

class BookingListCreateView(generics.ListCreateAPIView):
    """List bookings for the logged-in user or allow client to book a consultation."""
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return ClientBookingCreateSerializer
        return BookingDetailSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == UserRole.BROKER:
            return Booking.objects.filter(broker__user=user)
        elif user.role == UserRole.CLIENT:
            return Booking.objects.filter(client__user=user)
        elif user.role == UserRole.COMPLIANCE:
            return Booking.objects.all()
        return Booking.objects.none()


class BookingDetailView(generics.RetrieveUpdateAPIView):
    """Retrieve or update (cancel/reschedule/confirm) a booking."""
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method in ["PUT", "PATCH"]:
            return BookingStatusUpdateSerializer
        return BookingDetailSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == UserRole.BROKER:
            return Booking.objects.filter(broker__user=user)
        elif user.role == UserRole.CLIENT:
            return Booking.objects.filter(client__user=user)
        elif user.role == UserRole.COMPLIANCE:
            return Booking.objects.all()
        return Booking.objects.none()

class BrokerListView(generics.ListAPIView):
    """Returns a list of active brokers for dropdown selection."""
    permission_classes = [IsAuthenticated]
    serializer_class = BrokerOptionSerializer
    queryset = BrokerProfile.objects.filter(user__is_active=True)