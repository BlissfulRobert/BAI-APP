/**
 * ==============================================================================
 * MAIN ROUTE PAGE: /compliance
 * Path: src/app/compliance/page.tsx
 * Description: Root Compliance Portal page. Coordinates tab selection,
 *              Teal/Cyan themed layout, and document validation states.
 * ==============================================================================
 */

"use client";

import React, { useState, useEffect } from "react";
import Sidebar, { ComplianceTabType } from "./components/Sidebar";
import DashboardTab from "./components/DashboardTab";
import ReviewTab from "./components/ReviewTab";
import AuditLogTab from "./components/AuditLogTab";

// Import calculators, applications, and notifications components from broker to reuse
import CalculatorsTab from "../broker/components/CalculatorsTab";
import ApplicationsTab from "../broker/components/ApplicationsTab";
import NotificationsTab from "../broker/components/NotificationsTab";

// Mock data imports
import { 
  initialSubmittedDocs, 
  initialAuditLogs, 
  SubmittedDocument, 
  AuditLogEntry 
} from "./components/MockComplianceData";

// Broker state imports to populate Application tab cleanly
import { 
  initialClients, 
  initialApplications, 
  Client, 
  Application 
} from "../broker/components/MockData";

export default function CompliancePortalPage() {
  // ------------------------------------------------------------------------------
  // SECTION 1: TAB NAVIGATION STATE
  // ------------------------------------------------------------------------------
  const [activeTab, setActiveTab] = useState<ComplianceTabType>("Dashboard");

  // ------------------------------------------------------------------------------
  // SECTION 2: COMPLIANCE PORTAL STATE
  // ------------------------------------------------------------------------------
  const [submittedDocs, setSubmittedDocs] = useState<SubmittedDocument[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("new_registrations");
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as SubmittedDocument[];
          return [...initialSubmittedDocs, ...parsed];
        } catch (e) {
          console.error("Failed to parse registrations:", e);
        }
      }
    }
    return initialSubmittedDocs;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(initialAuditLogs);
  
  // Reused Broker states
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [applications, setApplications] = useState<Application[]>(initialApplications);

  // Sync back to local storage if submitted documents state changes
  useEffect(() => {
    const newRegs = submittedDocs.filter(doc => doc.id.startsWith("reg-"));
    localStorage.setItem("new_registrations", JSON.stringify(newRegs));
  }, [submittedDocs]);

  // Compliance Notifications state log
  const [notifications, setNotifications] = useState([
    { type: "Audit Alert", message: "System audit complete for Alice Smith's folder.", time: "1 hour ago" },
    { type: "Flagged File", message: "Flagged document: Bank statement missing page 3.", time: "2 hours ago" },
    { type: "New Submission", message: "New application submitted by Emma Wilson.", time: "1 day ago" }
  ]);

  // ------------------------------------------------------------------------------
  // SECTION 3: AUDIT TRAIL LOGGING HANDLER
  // ------------------------------------------------------------------------------
  const handleLogAction = (actionText: string) => {
    const now = new Date();
    
    // YYYY-MM-DD Date
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    
    // HH:MM AM/PM Time
    const formattedTime = `${String(now.getHours() % 12 || 12).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")} ${now.getHours() >= 12 ? "PM" : "AM"}`;

    const newLog: AuditLogEntry = {
      id: `audit-${Date.now()}`,
      action: actionText,
      date: formattedDate,
      time: formattedTime
    };

    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // ------------------------------------------------------------------------------
  // SECTION 4: ROUTE CONTROLLER RENDERER
  // ------------------------------------------------------------------------------
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return (
          <DashboardTab
            submittedDocs={submittedDocs}
            setActiveTab={setActiveTab}
          />
        );
      case "Review":
        return (
          <ReviewTab
            submittedDocs={submittedDocs}
            setSubmittedDocs={setSubmittedDocs}
            onLogAction={handleLogAction}
          />
        );
      case "Application":
        return (
          <ApplicationsTab
            clients={clients}
            applications={applications}
            setApplications={setApplications}
            onSendEmail={() => {
              alert("Compliance officers are not authorized to compose or send customer emails directly.");
            }}
            variant="compliance"
            setClients={setClients}
          />
        );
      case "AuditLog":
        return <AuditLogTab auditLogs={auditLogs} />;
      case "Calculator":
        return <CalculatorsTab variant="compliance" />;
      case "Notifications":
        return <NotificationsTab notifications={notifications} variant="compliance" />;
      default:
        return (
          <DashboardTab
            submittedDocs={submittedDocs}
            setActiveTab={setActiveTab}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900 selection:bg-blue-600 selection:text-white antialiased">
      
      {/* ==================================================================== */}
      {/* LAYOUT PART 1: TEAL (#3CDAE2) NAVIGATION SIDEBAR                     */}
      {/* ==================================================================== */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* ==================================================================== */}
      {/* LAYOUT PART 2: CONTENT WINDOW AREA                                   */}
      {/* ==================================================================== */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* top header bar */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-sm font-extrabold text-slate-800 tracking-tight">
              Compliance Overview — {activeTab === "AuditLog" ? "Audit Log" : activeTab === "Review" ? "Review Workspace" : activeTab}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
              Secure Auditor Audit Mode
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </header>

        {/* main scrollable audit content body */}
        <main className="flex-1 overflow-y-auto p-8 max-w-7xl w-full mx-auto">
          {renderActiveTabContent()}
        </main>

      </div>
    </div>
  );
}
