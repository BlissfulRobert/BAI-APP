"use client";

import React from "react";
import { useCompliance } from "../ComplianceContext";
import AuditLogTab from "./AuditLogTab";

export default function ComplianceAuditLogPage() {
  const { auditLogs } = useCompliance();

  return <AuditLogTab auditLogs={auditLogs} />;
}
