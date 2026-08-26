/**
 * ==============================================================================
 * FILE: MockClientData.ts
 * Path: src/app/client/components/MockClientData.ts
 * Description: Mock Data & Type Definitions for the Client Portal.
 * ==============================================================================
 */

export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  description: string;
  amount: number;
  balance: number;
  status: "Cleared" | "Pending";
}

export interface ClientMessage {
  id: string;
  sender: "client" | "broker";
  senderName: string;
  text: string;
  timestamp: string; // e.g. "10:15 AM", "Yesterday"
}

// ------------------------------------------------------------------------------
// INITIAL OFFSET ACCOUNT TRANSACTIONS
// ------------------------------------------------------------------------------
export const initialTransactions: Transaction[] = [
  {
    id: "tx-1",
    date: "2026-08-15",
    description: "Monthly Mortgage Interest Charge",
    amount: -3750.00,
    balance: 496250.00,
    status: "Cleared"
  },
  {
    id: "tx-2",
    date: "2026-08-15",
    description: "Mortgage Offset Deposit (Salary credit)",
    amount: 8500.00,
    balance: 500000.00,
    status: "Cleared"
  },
  {
    id: "tx-3",
    date: "2026-08-01",
    description: "Macquarie Bank Offset Fee",
    amount: -15.00,
    balance: 491500.00,
    status: "Cleared"
  },
  {
    id: "tx-4",
    date: "2026-07-28",
    description: "Brokerage Valuation Service Fee Ref",
    amount: -250.00,
    balance: 491515.00,
    status: "Cleared"
  },
  {
    id: "tx-5",
    date: "2026-07-15",
    description: "Monthly Mortgage Interest Charge",
    amount: -3750.00,
    balance: 491765.00,
    status: "Cleared"
  },
  {
    id: "tx-6",
    date: "2026-07-15",
    description: "Mortgage Offset Deposit (Salary credit)",
    amount: 8500.00,
    balance: 495515.00,
    status: "Cleared"
  }
];

// ------------------------------------------------------------------------------
// INITIAL BROKER-CLIENT DISCUSSION THREADS
// ------------------------------------------------------------------------------
export const initialMessages: ClientMessage[] = [
  {
    id: "msg-1",
    sender: "broker",
    senderName: "Sarah Jenkins",
    text: "Hi Emma, I've received your updated bank statement, but page 3 is missing. Could you please upload the full statement so I can forward it to the bank assessors?",
    timestamp: "1 day ago"
  },
  {
    id: "msg-2",
    sender: "client",
    senderName: "Emma Wilson",
    text: "Hi Sarah, my apologies! I will scan and upload the complete PDF of my bank statement right away.",
    timestamp: "Yesterday"
  },
  {
    id: "msg-3",
    sender: "broker",
    senderName: "Sarah Jenkins",
    text: "Perfect! Once that's verified, we will trigger the formal valuation check.",
    timestamp: "Yesterday"
  },
  {
    id: "msg-4",
    sender: "client",
    senderName: "Emma Wilson",
    text: "I also uploaded the certified copy of my ID card. Let me know if that works.",
    timestamp: "2 hours ago"
  }
];
