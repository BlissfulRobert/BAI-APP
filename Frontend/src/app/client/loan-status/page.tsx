"use client";

import React from "react";
import { useClient } from "../ClientContext";
import LoanStatusTab from "./LoanStatusTab";

export default function ClientLoanStatusPage() {
  const { client } = useClient();

  return <LoanStatusTab client={client} />;
}
