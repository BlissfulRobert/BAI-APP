"use client";

import React from "react";
import { useCompliance } from "../ComplianceContext";
import ApplicationsTab from "@/app/broker/applications/ApplicationsTab";

export default function ComplianceApplicationPage() {
  const { clients, applications, setApplications, setClients } = useCompliance();

  return (
    <ApplicationsTab
      clients={clients}
      applications={applications}
      setApplications={setApplications}
      setClients={setClients}
      onSendEmail={() => {
        alert("Compliance officers are not authorized to compose or send customer emails directly.");
      }}
      variant="compliance"
    />
  );
}
