/**
 * ==============================================================================
 * COMPONENT: Sidebar.tsx
 * Path: src/app/broker/Sidebar.tsx
 * Description: Sidebar navigation component styled with dark blue background
 *              indicating dedicated Broker Portal zone. Uses Next.js Links.
 * ==============================================================================
 */

"use client";

import React from "react";
import Link from "next/link";
import { Home, Users, ClipboardList, Calendar, MessageSquare, Percent } from "lucide-react";

export type TabType = "Dashboard" | "Clients" | "Applications" | "Bookings" | "Communication" | "Calculators" | "Notifications";

interface SidebarProps {
  activeTab: TabType;
}

export default function Sidebar({ activeTab }: SidebarProps) {
  // Navigation tabs definition (Removed Notifications and Logout)
  const menuItems = [
    { id: "Dashboard" as TabType, label: "Dashboard", icon: Home, href: "/broker/dashboard" },
    { id: "Clients" as TabType, label: "Clients", icon: Users, href: "/broker/clients" },
    { id: "Applications" as TabType, label: "Applications", icon: ClipboardList, href: "/broker/applications" },
    { id: "Bookings" as TabType, label: "Bookings", icon: Calendar, href: "/broker/bookings" },
    { id: "Communication" as TabType, label: "Communication", icon: MessageSquare, href: "/broker/communication" },
    { id: "Calculators" as TabType, label: "Calculators", icon: Percent, href: "/broker/calculator" },
  ];

  return (
    <aside className="w-64 bg-[#1429A9] text-white border-r border-white/10 min-h-screen flex flex-col shrink-0">
      
      {/* Brand Header (New color theme styling) */}
      <div className="p-6 border-b border-white/10 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#1429A9] font-extrabold text-sm tracking-tighter">
          BAI
        </div>
        <div>
          <span className="font-extrabold text-white text-sm tracking-tight block">
            BAI FINANCE
          </span>
          <span className="text-[10px] text-blue-200 font-bold uppercase tracking-wider block">
            Broker Portal
          </span>
        </div>
      </div>

      {/* Navigation Menu (New theme active states) */}
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
                  ? "bg-white/10 text-white shadow-xs"
                  : "text-blue-100 hover:text-white hover:bg-white/5"
              }`}
            >
              {/* Gold/Amber Indicator bar on the left (visible when active) */}
              {isActive && (
                <div className="absolute left-0 top-3 bottom-3 w-1 bg-amber-400 rounded-r-md" />
              )}
              
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? "text-white" : "text-blue-300 group-hover:text-white"
                }`}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
