"use client";

import React from "react";
import { useCompliance } from "../ComplianceContext";
import ReviewTab from "./ReviewTab";

export default function ComplianceReviewPage() {
  const { submittedDocs, setSubmittedDocs, handleLogAction } = useCompliance();

  return (
    <ReviewTab
      submittedDocs={submittedDocs}
      setSubmittedDocs={setSubmittedDocs}
      onLogAction={handleLogAction}
    />
  );
}
