/**
 * ==============================================================================
 * COMPONENT: Sidebar.tsx
 * Path: src/app/broker/Sidebar.tsx
 * Description: Sidebar navigation component styled with dark blue background
 *              indicating dedicated Broker Portal zone. Uses Next.js Links.
 * ==============================================================================
 */

import React from "react";
import Link from "next/link";
import { Home, Users, ClipboardList, Calendar, MessageSquare, Percent, Bell } from "lucide-react";

export type TabType = "Dashboard" | "Clients" | "Applications" | "Bookings" | "Communication" | "Calculators" | "Notifications";

interface SidebarProps {
  activeTab: TabType;
}

export default function Sidebar({ activeTab }: SidebarProps) {
  // Navigation tabs definition
  const menuItems = [
    { id: "Dashboard" as TabType, label: "Dashboard", icon: Home, href: "/broker/dashboard" },
    { id: "Clients" as TabType, label: "Clients", icon: Users, href: "/broker/clients" },
    { id: "Applications" as TabType, label: "Applications", icon: ClipboardList, href: "/broker/applications" },
    { id: "Bookings" as TabType, label: "Bookings", icon: Calendar, href: "/broker/bookings" },
    { id: "Communication" as TabType, label: "Communication", icon: MessageSquare, href: "/broker/communication" },
    { id: "Calculators" as TabType, label: "Calculators", icon: Percent, href: "/broker/calculator" },
    { id: "Notifications" as TabType, label: "Notifications", icon: Bell, href: "/broker/notifications" },
  ];

  return (
    <aside className="w-64 bg-[#071644] text-white border-r border-[#0B2369]/30 min-h-screen flex flex-col shrink-0">
      
      {/* Brand Header (Dark blue styling) */}
      <div className="p-6 border-b border-[#0B2369]/30 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#071644] font-extrabold text-sm tracking-tighter">
          BAI
        </div>
        <div>
          <span className="font-extrabold text-white text-sm tracking-tight block">
            BAI FINANCE
          </span>
          <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider block">
            Broker Portal
          </span>
        </div>
      </div>

      {/* Navigation Menu (Dark theme) */}
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-left text-sm font-semibold transition-all relative ${
                isActive
                  ? "bg-[#163691]/50 text-white shadow-xs"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
            >
              {/* Gold Indicator bar on the left (visible when active) */}
              {isActive && (
                <div className="absolute left-0 top-3 bottom-3 w-1 bg-[#D97706] rounded-r-md" />
              )}
              
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? "text-white" : "text-slate-400 group-hover:text-white"
                }`}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Broker User Profile Card (Bottom of Sidebar, Dark theme) */}
      <div className="p-4 border-t border-[#0B2369]/30 bg-black/10">
        <div className="flex items-center gap-3 p-2 rounded-xl">
          <div className="w-9 h-9 rounded-full bg-white/15 text-white flex items-center justify-center font-bold text-sm shrink-0 border border-white/10">
            SJ
          </div>
          <div className="min-w-0">
            <span className="font-bold text-white text-xs truncate block">
              Sarah Jenkins
            </span>
            <span className="text-[10px] text-slate-300 font-medium truncate block">
              Senior Mortgage Broker
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
