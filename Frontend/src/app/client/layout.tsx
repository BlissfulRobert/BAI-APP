"use client";

import React from "react";
import Sidebar from "./Sidebar";
import { ClientProvider, useClient } from "./ClientContext";
import { usePathname } from "next/navigation";

const getActiveTab = (pathname: string) => {
  if (pathname.includes("/client/profile")) return "Profile";
  if (pathname.includes("/client/loan-status")) return "LoanStatus";
  if (pathname.includes("/client/transaction-history")) return "TransactionHistory";
  if (pathname.includes("/client/communication")) return "Communication";
  if (pathname.includes("/client/bookings")) return "Bookings";
  if (pathname.includes("/client/calculator")) return "Calculator";
  if (pathname.includes("/client/notifications")) return "Notifications";
  return "Profile";
};

function ClientLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const activeTab = getActiveTab(pathname);
  const { client } = useClient();

  const getHeaderTitle = () => {
    switch (activeTab) {
      case "LoanStatus": return "Loan Status";
      case "TransactionHistory": return "Transactions Ledger";
      default: return activeTab;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900 selection:bg-blue-600 selection:text-white antialiased">
      
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        clientName={client.name} 
      />

      {/* Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top header bar */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-sm font-extrabold text-slate-800 tracking-tight">
              Customer Hub — {getHeaderTitle()}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] text-[#0024A8] font-bold uppercase tracking-wider bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-md">
              Secure SSL Session Active
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-[#0024A8] animate-pulse" />
          </div>
        </header>

        {/* Scrollable page body */}
        <main className="flex-1 overflow-y-auto p-8 max-w-[1600px] w-full mx-auto">
          {children}
        </main>

      </div>
    </div>
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClientProvider>
      <ClientLayoutContent>{children}</ClientLayoutContent>
    </ClientProvider>
  );
}
