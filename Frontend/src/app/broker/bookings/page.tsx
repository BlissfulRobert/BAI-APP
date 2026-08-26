"use client";

import React from "react";
import { useBroker } from "../BrokerContext";
import BookingsTab from "./BookingsTab";

export default function BrokerBookingsPage() {
  const { clients, bookings, setBookings } = useBroker();

  return (
    <BookingsTab
      clients={clients}
      bookings={bookings}
      setBookings={setBookings}
    />
  );
}
