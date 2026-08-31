from django.urls import path
from bookings.views import (
        AvailableSlotsView,
        BookingListCreateView,
        BookingDetailView,
        BrokerListView
    )

urlpatterns = [
    path("", BookingListCreateView.as_view(), name="booking-list-create"),
    path("available-slots/", AvailableSlotsView.as_view(), name="booking-available-slots"),
    path("<uuid:pk>/", BookingDetailView.as_view(), name="booking-detail"),
    path("brokers/", BrokerListView.as_view(), name="broker-list")
]