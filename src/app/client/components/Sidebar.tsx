/**
 * ==============================================================================
 * COMPONENT: Sidebar.tsx
 * Path: src/app/client/components/Sidebar.tsx
 * Description: Client Portal Navigation Sidebar styled with custom brand blue
 *              (#0024A8) background color.
 * ==============================================================================
 */

import React from "react";
import { User, Landmark, History, MessageSquare, Percent, Calendar, Bell } from "lucide-react";

export type ClientTabType = "Profile" | "LoanStatus" | "TransactionHistory" | "Communication" | "Bookings" | "Calculator" | "Notifications";

interface SidebarProps {
  activeTab: ClientTabType;
  setActiveTab: (tab: ClientTabType) => void;
  clientName: string;
}

export default function Sidebar({ activeTab, setActiveTab, clientName }: SidebarProps) {
  // Navigation tabs list
  const menuItems = [
    { id: "Profile" as ClientTabType, label: "Profile", icon: User },
    { id: "LoanStatus" as ClientTabType, label: "Loan Status", icon: Landmark },
    { id: "TransactionHistory" as ClientTabType, label: "Transaction History", icon: History },
    { id: "Communication" as ClientTabType, label: "Communication", icon: MessageSquare },
    { id: "Bookings" as ClientTabType, label: "Bookings", icon: Calendar },
    { id: "Calculator" as ClientTabType, label: "Calculator", icon: Percent },
    { id: "Notifications" as ClientTabType, label: "Notifications", icon: Bell },
  ];

  return (
    <aside className="w-64 bg-[#0024A8] text-white border-r border-white/10 min-h-screen flex flex-col shrink-0">
      
      {/* Brand Header */}
      <div className="p-6 border-b border-white/10 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#0024A8] font-black text-sm tracking-tighter">
          BAI
        </div>
        <div>
          <span className="font-extrabold text-white text-sm tracking-tight block">
            BAI FINANCE
          </span>
          <span className="text-[10px] text-sky-200/70 font-bold uppercase tracking-wider block">
            Client Hub
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
                  : "text-slate-200/80 hover:text-white hover:bg-white/10"
              }`}
            >
              {/* Left Active highlight indicator */}
              {isActive && (
                <div className="absolute left-0 top-3.5 bottom-3.5 w-1 bg-amber-400 rounded-r-md" />
              )}
              
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? "text-white" : "text-sky-200/50"
                }`}
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Profile summary at bottom */}
      <div className="p-4 border-t border-white/10 bg-black/10">
        <div className="flex items-center gap-3 p-2 rounded-xl">
          <div className="w-9 h-9 rounded-full bg-white text-[#0024A8] flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
            {clientName.split(" ").map(w => w[0]).join("")}
          </div>
          <div className="min-w-0">
            <span className="font-extrabold text-white text-xs truncate block">
              {clientName}
            </span>
            <span className="text-[10px] text-sky-200/60 font-semibold truncate block">
              Premium Account Holder
            </span>
          </div>
        </div>
      </div>

    </aside>
  );
}
