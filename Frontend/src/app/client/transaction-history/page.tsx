"use client";

import React from "react";
import { useClient } from "../ClientContext";
import TransactionHistoryTab from "./TransactionHistoryTab";

export default function ClientTransactionHistoryPage() {
  const { transactions } = useClient();

  return <TransactionHistoryTab transactions={transactions} />;
}
