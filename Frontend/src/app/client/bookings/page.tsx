"use client";

import React from "react";
import { useClient } from "../ClientContext";
import BookingsTab from "./BookingsTab";

export default function ClientBookingsPage() {
  const { handleLogAction, handleNewBooking } = useClient();

  return (
    <BookingsTab
      onLogAction={handleLogAction}
      onNewBooking={handleNewBooking}
    />
  );
}
