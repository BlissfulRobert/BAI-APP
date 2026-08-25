/**
 * ==============================================================================
 * MAIN ROUTE PAGE: /broker
 * Path: src/app/broker/page.tsx
 * Description: Root Broker Portal page. Manages active views and handles
 *              interactive state for clients, applications, meetings, and emails.
 * ==============================================================================
 */

"use client";

import React, { useState } from "react";
import Sidebar, { TabType } from "./components/Sidebar";
import DashboardTab from "./components/DashboardTab";
import ClientsTab from "./components/ClientsTab";
import ApplicationsTab from "./components/ApplicationsTab";
import BookingsTab from "./components/BookingsTab";
import CommunicationTab from "./components/CommunicationTab";
import CalculatorsTab from "./components/CalculatorsTab";
import NotificationsTab from "./components/NotificationsTab";

// Import types and initial static datasets
import { 
  initialClients, 
  initialApplications, 
  initialBookings, 
  initialEmails, 
  Client, 
  Application, 
  Booking, 
  Email 
} from "./components/MockData";

export default function BrokerPortalPage() {
  // ------------------------------------------------------------------------------
  // SECTION 1: GLOBAL VIEW/TAB NAVIGATION STATE
  // ------------------------------------------------------------------------------
  const [activeTab, setActiveTab] = useState<TabType>("Dashboard");

  // ------------------------------------------------------------------------------
  // SECTION 2: CLIENT PORTAL STATE (Shared across tabs for interactivity)
  // ------------------------------------------------------------------------------
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [emails, setEmails] = useState<Email[]>(initialEmails);
  const [autoCompose, setAutoCompose] = useState(false);

  // Broker Notifications state
  const [notifications, setNotifications] = useState([
    { type: "Dossier Update", message: "Alice Smith uploaded corporate bank logs and income statement.", time: "10 mins ago" },
    { type: "Outstanding File", message: "Emma Wilson's construction file is missing certified builder insurance.", time: "1 hour ago" },
    { type: "Valuation Scheduled", message: "John Doe's property appraisal booking is locked for tomorrow.", time: "3 hours ago" }
  ]);

  // ------------------------------------------------------------------------------
  // SECTION 3: RENDER ACTIVE VIEW HANDLER
  // ------------------------------------------------------------------------------
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return (
          <DashboardTab
            clients={clients}
            setActiveTab={setActiveTab}
          />
        );
      case "Clients":
        return <ClientsTab clients={clients} />;
      case "Applications":
        return (
          <ApplicationsTab
            clients={clients}
            applications={applications}
            setApplications={setApplications}
            onSendEmail={() => {
              setActiveTab("Communication");
              setAutoCompose(true);
            }}
            setClients={setClients}
          />
        );
      case "Bookings":
        return (
          <BookingsTab
            clients={clients}
            bookings={bookings}
            setBookings={setBookings}
          />
        );
      case "Communication":
        return (
          <CommunicationTab
            clients={clients}
            emails={emails}
            setEmails={setEmails}
            autoCompose={autoCompose}
            clearAutoCompose={() => setAutoCompose(false)}
          />
        );
      case "Calculators":
        return <CalculatorsTab />;
      case "Notifications":
        return <NotificationsTab notifications={notifications} variant="broker" />;
      default:
        return (
          <DashboardTab
            clients={clients}
            setActiveTab={setActiveTab}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900 selection:bg-blue-600 selection:text-white antialiased">
      
      {/* ==================================================================== */}
      {/* LAYOUT PART 1: SIDEBAR NAVIGATION                                    */}
      {/* ==================================================================== */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* ==================================================================== */}
      {/* LAYOUT PART 2: MAIN CONTAINER AREA                                   */}
      {/* ==================================================================== */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* top header bar */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-sm font-extrabold text-slate-800 tracking-tight">
              {activeTab} Overview
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider bg-slate-50 border border-slate-200/50 px-2 py-0.5 rounded-md">
              Session Active
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </header>

        {/* scrollable page body content */}
        <main className="flex-1 overflow-y-auto p-8 max-w-7xl w-full mx-auto">
          {renderActiveTabContent()}
        </main>

      </div>
    </div>
  );
}
