/**
 * ==============================================================================
 * MAIN ROUTE PAGE: /client
 * Path: src/app/client/page.tsx
 * Description: Client Portal root page. Simulates the customer dashboard
 *              experience (logged in as Emma Wilson) styled with `#0024A8`.
 * ==============================================================================
 */

"use client";

import React, { useState } from "react";
import Sidebar, { ClientTabType } from "./components/Sidebar";
import ProfileTab from "./components/ProfileTab";
import LoanStatusTab from "./components/LoanStatusTab";
import TransactionHistoryTab from "./components/TransactionHistoryTab";
import CommunicationTab from "./components/CommunicationTab";
import BookingsTab from "./components/BookingsTab";

// Reuse CalculatorsTab and NotificationsTab from broker components
import CalculatorsTab from "../broker/components/CalculatorsTab";
import NotificationsTab from "../broker/components/NotificationsTab";

// Mock data imports
import { 
  initialClients, 
  initialBookings, 
  Client, 
  Booking 
} from "../broker/components/MockData";

import { 
  initialTransactions, 
  initialMessages, 
  Transaction, 
  ClientMessage 
} from "./components/MockClientData";

export default function ClientPortalPage() {
  // ------------------------------------------------------------------------------
  // SECTION 1: GLOBAL VIEW/TAB STATE
  // ------------------------------------------------------------------------------
  const [activeTab, setActiveTab] = useState<ClientTabType>("Profile");

  // ------------------------------------------------------------------------------
  // SECTION 2: CLIENT PORTAL STATE (Logged in as Emma Wilson - ID "c4")
  // ------------------------------------------------------------------------------
  const [client, setClient] = useState<Client>(
    initialClients.find((c) => c.id === "c4") || initialClients[0]
  );
  
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [messages, setMessages] = useState<ClientMessage[]>(initialMessages);
  
  // Load initial notifications log for Emma Wilson
  const [notifications, setNotifications] = useState([
    { type: "upload", message: "Emma Wilson uploaded certified UMID ID document.", time: "2 hours ago" },
    { type: "alert", message: "System alert: Bank Statement document uploaded is missing page 3.", time: "1 day ago" },
    { type: "system", message: "Welcome to BAI Finance Secure Client Hub! Your broker is Sarah Jenkins.", time: "3 days ago" }
  ]);

  // Find Emma's scheduled meeting from mock bookings
  const [booking, setBooking] = useState<Booking | null>(
    initialBookings.find((b) => b.clientId === "c4") || null
  );

  // New booking registration callback
  const handleNewBooking = (dateStr: string, timeStr: string, typeStr: string, platformStr: string) => {
    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      clientId: "c4",
      clientName: "Emma Wilson",
      date: dateStr,
      time: timeStr,
      type: typeStr,
      platform: platformStr
    };
    setBooking(newBooking);
  };

  // ------------------------------------------------------------------------------
  // SECTION 3: SYSTEM ACTIONS LOGGING HANDLER
  // ------------------------------------------------------------------------------
  const handleLogAction = (actionText: string) => {
    const newNotif = {
      type: "user",
      message: actionText,
      time: "Just Now"
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // ------------------------------------------------------------------------------
  // SECTION 4: ROUTE CONTROLLER RENDERER
  // ------------------------------------------------------------------------------
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "Profile":
        return (
          <ProfileTab
            client={client}
            setClient={setClient}
            onLogAction={handleLogAction}
          />
        );
      case "LoanStatus":
        return <LoanStatusTab client={client} />;
      case "TransactionHistory":
        return <TransactionHistoryTab transactions={transactions} />;
      case "Communication":
        return <CommunicationTab />;
      case "Bookings":
        return (
          <BookingsTab
            onLogAction={handleLogAction}
            onNewBooking={handleNewBooking}
          />
        );
      case "Calculator":
        return <CalculatorsTab variant="client" />;
      case "Notifications":
        return <NotificationsTab notifications={notifications} variant="client" />;
      default:
        return (
          <ProfileTab
            client={client}
            setClient={setClient}
            onLogAction={handleLogAction}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900 selection:bg-blue-600 selection:text-white antialiased">
      
      {/* ==================================================================== */}
      {/* LAYOUT PART 1: DEEP BLUE (#0024A8) NAVIGATION SIDEBAR                */}
      {/* ==================================================================== */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        clientName={client.name} 
      />

      {/* ==================================================================== */}
      {/* LAYOUT PART 2: CONTENT WINDOW AREA                                   */}
      {/* ==================================================================== */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* top header bar */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-sm font-extrabold text-slate-800 tracking-tight">
              Customer Hub — {activeTab === "LoanStatus" ? "Loan Status" : activeTab === "TransactionHistory" ? "Transactions Ledger" : activeTab}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] text-[#0024A8] font-bold uppercase tracking-wider bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-md">
              Secure SSL Session Active
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-[#0024A8] animate-pulse" />
          </div>
        </header>

        {/* main scrollable dashboard viewport */}
        <main className="flex-1 overflow-y-auto p-8 max-w-7xl w-full mx-auto">
          {renderActiveTabContent()}
        </main>

      </div>
    </div>
  );
}
