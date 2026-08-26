"use client";

import React from "react";
import Sidebar from "./Sidebar";
import { ComplianceProvider } from "./ComplianceContext";
import { usePathname } from "next/navigation";

const getActiveTab = (pathname: string) => {
  if (pathname.includes("/compliance/dashboard")) return "Dashboard";
  if (pathname.includes("/compliance/review")) return "Review";
  if (pathname.includes("/compliance/application")) return "Application";
  if (pathname.includes("/compliance/audit-log")) return "AuditLog";
  if (pathname.includes("/compliance/calculator")) return "Calculator";
  if (pathname.includes("/compliance/notifications")) return "Notifications";
  return "Dashboard";
};

export default function ComplianceLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const activeTab = getActiveTab(pathname);

  const getHeaderTitle = () => {
    switch (activeTab) {
      case "AuditLog": return "Audit Log";
      case "Review": return "Review Workspace";
      default: return activeTab;
    }
  };

  return (
    <ComplianceProvider>
      <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900 selection:bg-blue-600 selection:text-white antialiased">
        
        {/* Sidebar Navigation */}
        <Sidebar activeTab={activeTab} />

        {/* Content Wrapper */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Top header bar */}
          <header className="h-16 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between shrink-0">
            <div>
              <h1 className="text-sm font-extrabold text-slate-800 tracking-tight">
                Compliance Overview — {getHeaderTitle()}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                Secure Auditor Audit Mode
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </header>

          {/* Scrollable page body */}
          <main className="flex-1 overflow-y-auto p-8 max-w-[1600px] w-full mx-auto">
            {children}
          </main>

        </div>
      </div>
    </ComplianceProvider>
  );
}
