/**
 * ==============================================================================
 * COMPONENT: Sidebar.tsx
 * Path: src/app/client/Sidebar.tsx
 * Description: Client Portal Navigation Sidebar styled with custom brand blue
 *              (#0024A8) background color. Supports collapsible mode — clicking
 *              the right-edge toggle button shrinks to icon-only view with
 *              hover tooltips. Collapse state is lifted to layout.tsx.
 * ==============================================================================
 */

"use client";

import React from "react";
import Link from "next/link";
import {
  User,
  Landmark,
  History,
  MessageSquare,
  Percent,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export type ClientTabType =
  | "Profile"
  | "LoanStatus"
  | "PaymentHistory"
  | "Communication"
  | "Bookings"
  | "Calculator"
  | "Notifications";

interface SidebarProps {
  activeTab: ClientTabType;
  clientName: string;
  isCollapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ activeTab, isCollapsed, onToggle }: SidebarProps) {
  const menuItems = [
    { id: "Profile"        as ClientTabType, label: "Profile",         icon: User,          href: "/client/profile"         },
    { id: "LoanStatus"     as ClientTabType, label: "Loan Status",     icon: Landmark,      href: "/client/loan-status"     },
    { id: "PaymentHistory" as ClientTabType, label: "Payment History", icon: History,       href: "/client/payment-history" },
    { id: "Communication"  as ClientTabType, label: "Communication",   icon: MessageSquare, href: "/client/communication"   },
    { id: "Bookings"       as ClientTabType, label: "Bookings",        icon: Calendar,      href: "/client/bookings"        },
    { id: "Calculator"     as ClientTabType, label: "Calculator",      icon: Percent,       href: "/client/calculator"      },
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
    document.cookie = "jwt-access-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "jwt-refresh-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "user-role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/";
  };

  return (
    <aside
      className={`sticky top-0 h-screen bg-[#0024A8] text-white border-r border-white/10 flex flex-col shrink-0 transition-all duration-300 ease-in-out z-40 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* ------------------------------------------------------------------ */}
      {/* Brand Header                                                         */}
      {/* ------------------------------------------------------------------ */}
      <div
        className={`p-4 border-b border-white/10 flex items-center gap-3 overflow-hidden ${
          isCollapsed ? "justify-center" : ""
        }`}
      >
        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#0024A8] font-black text-sm tracking-tighter shrink-0">
          BAI
        </div>
        {!isCollapsed && (
          <div>
            <span className="font-extrabold text-white text-sm tracking-tight block">
              BAI FINANCE
            </span>
            <span className="text-[10px] text-sky-200/70 font-bold uppercase tracking-wider block">
              Client Hub
            </span>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Navigation Menu                                                      */}
      {/* ------------------------------------------------------------------ */}
      <nav className="flex-1 py-6 space-y-1.5 px-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <div key={item.id} className="relative group">
              <Link
                href={item.href}
                className={`w-full flex items-center gap-3.5 px-3 py-3 rounded-xl text-left text-sm font-extrabold transition-all relative ${
                  isCollapsed ? "justify-center" : ""
                } ${
                  isActive
                    ? "bg-white/15 text-white shadow-xs"
                    : "text-slate-200/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {/* Left active highlight indicator */}
                {isActive && (
                  <div className="absolute left-0 top-3.5 bottom-3.5 w-1 bg-amber-400 rounded-r-md" />
                )}

                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? "text-white" : "text-sky-200/50"
                  }`}
                />

                {!isCollapsed && <span>{item.label}</span>}
              </Link>

              {/* Tooltip — only visible in collapsed mode on hover */}
              {isCollapsed && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 bg-slate-800 text-white text-xs font-bold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-50 shadow-lg">
                  {item.label}
                  {/* Tooltip arrow */}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-800" />
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* ------------------------------------------------------------------ */}
      {/* FULL-HEIGHT SQUARE COLLAPSE BUTTON STRIP                           */}
      {/* Seamless full-height square strip attached flush to the sidebar    */}
      {/* container, styled in lower-opacity blue with centered arrow icon.  */}
      {/* ------------------------------------------------------------------ */}
      <button
        type="button"
        onClick={onToggle}
        className="absolute top-0 bottom-0 -right-5 w-5 z-30 flex items-center justify-center bg-[#0024A8]/40 hover:bg-[#0024A8]/75 text-white border-r border-white/20 hover:border-white/40 transition-all cursor-pointer group focus:outline-none rounded-none shadow-sm backdrop-blur-xs"
        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {/* Dead-center arrow icon both horizontally and vertically */}
        <div className="sticky top-1/2 -translate-y-1/2 flex items-center justify-center w-full text-white/80 group-hover:text-white group-hover:scale-125 transition-all">
          {isCollapsed ? (
            <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5 stroke-[2.5]" />
          )}
        </div>
      </button>
    </aside>
  );
}
