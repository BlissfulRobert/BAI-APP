"use client";

import React from "react";
import { useCompliance } from "../ComplianceContext";
import NotificationsTab from "@/components/NotificationsTab";

export default function ComplianceNotificationsPage() {
  const { notifications } = useCompliance();

  return (
    <NotificationsTab
      notifications={notifications}
      variant="compliance"
    />
  );
}
