/**
 * ==============================================================================
 * COMPONENT: Sidebar.tsx
 * Path: src/app/client/Sidebar.tsx
 * Description: Client Portal Navigation Sidebar styled with custom brand blue
 *              (#0024A8) background color. Uses Next.js Links.
 * ==============================================================================
 */

"use client";

import React from "react";
import Link from "next/link";
import { User, Landmark, History, MessageSquare, Percent, Calendar, Bell, LogOut } from "lucide-react";

export type ClientTabType = "Profile" | "LoanStatus" | "TransactionHistory" | "Communication" | "Bookings" | "Calculator" | "Notifications";

interface SidebarProps {
  activeTab: ClientTabType;
  clientName: string;
}

export default function Sidebar({ activeTab, clientName }: SidebarProps) {
  // Navigation tabs list
  const menuItems = [
    { id: "Profile" as ClientTabType, label: "Profile", icon: User, href: "/client/profile" },
    { id: "LoanStatus" as ClientTabType, label: "Loan Status", icon: Landmark, href: "/client/loan-status" },
    { id: "TransactionHistory" as ClientTabType, label: "Transaction History", icon: History, href: "/client/transaction-history" },
    { id: "Communication" as ClientTabType, label: "Communication", icon: MessageSquare, href: "/client/communication" },
    { id: "Bookings" as ClientTabType, label: "Bookings", icon: Calendar, href: "/client/bookings" },
    { id: "Calculator" as ClientTabType, label: "Calculator", icon: Percent, href: "/client/calculator" },
  ];

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8000/api/auth/logout/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
    } catch (err) {
      console.error("Failed to log out from backend:", err);
    }
    // Clear cookies
    document.cookie = "jwt-access-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "jwt-refresh-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "user-role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
    // Redirect to landing page
    window.location.href = "/";
  };

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
            <Link
              key={item.id}
              href={item.href}
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
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
