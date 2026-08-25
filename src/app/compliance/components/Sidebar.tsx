/**
 * ==============================================================================
 * COMPONENT: Sidebar.tsx
 * Path: src/app/compliance/components/Sidebar.tsx
 * Description: Sidebar component styled with custom steel teal (#1C6D8D) background
 *              indicating the dedicated Compliance Portal zone.
 * ==============================================================================
 */

import React from "react";
import { LayoutDashboard, CheckSquare, ClipboardList, ShieldAlert, Percent, Bell } from "lucide-react";

export type ComplianceTabType = "Dashboard" | "Review" | "Application" | "AuditLog" | "Calculator" | "Notifications";

interface SidebarProps {
  activeTab: ComplianceTabType;
  setActiveTab: (tab: ComplianceTabType) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  // Menu items for Compliance portal
  const menuItems = [
    { id: "Dashboard" as ComplianceTabType, label: "Dashboard", icon: LayoutDashboard },
    { id: "Review" as ComplianceTabType, label: "Review Tab", icon: CheckSquare },
    { id: "Application" as ComplianceTabType, label: "Application", icon: ClipboardList },
    { id: "AuditLog" as ComplianceTabType, label: "Audit Log", icon: ShieldAlert },
    { id: "Calculator" as ComplianceTabType, label: "Calculator", icon: Percent },
    { id: "Notifications" as ComplianceTabType, label: "Notifications", icon: Bell },
  ];

  return (
    <aside className="w-64 bg-[#1429A9] text-white border-r border-black/10 min-h-screen flex flex-col shrink-0">
      
      {/* Brand Header (Contrast logo on blue background) */}
      <div className="p-6 border-b border-white/10 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#1429A9] font-black text-sm tracking-tighter">
          BAI
        </div>
        <div>
          <span className="font-extrabold text-white text-sm tracking-tight block">
            BAI FINANCE
          </span>
          <span className="text-[10px] text-slate-100/70 font-bold uppercase tracking-wider block">
            Compliance Portal
          </span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-left text-sm font-extrabold transition-all relative ${
                isActive
                  ? "bg-white/15 text-white shadow-xs"
                  : "text-slate-100/75 hover:text-white hover:bg-white/10"
              }`}
            >
              {/* Golden active indicator on the left */}
              {isActive && (
                <div className="absolute left-0 top-3.5 bottom-3.5 w-1 bg-amber-400 rounded-r-md" />
              )}
              
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? "text-white" : "text-slate-100/60"
                }`}
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Info (Bottom of Sidebar) */}
      <div className="p-4 border-t border-white/10 bg-black/10">
        <div className="flex items-center gap-3 p-2 rounded-xl">
          <div className="w-9 h-9 rounded-full bg-white text-[#1429A9] flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
            CM
          </div>
          <div className="min-w-0">
            <span className="font-extrabold text-white text-xs truncate block">
              Marcus Carter
            </span>
            <span className="text-[10px] text-slate-200/70 font-semibold truncate block">
              Chief Compliance Auditor
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
