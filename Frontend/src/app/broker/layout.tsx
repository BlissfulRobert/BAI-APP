"use client";

import React from "react";
import Sidebar from "./Sidebar";
import { BrokerProvider } from "./BrokerContext";
import { usePathname } from "next/navigation";

const getActiveTab = (pathname: string) => {
  if (pathname.includes("/broker/dashboard")) return "Dashboard";
  if (pathname.includes("/broker/clients")) return "Clients";
  if (pathname.includes("/broker/applications")) return "Applications";
  if (pathname.includes("/broker/bookings")) return "Bookings";
  if (pathname.includes("/broker/communication")) return "Communication";
  if (pathname.includes("/broker/calculator")) return "Calculators";
  if (pathname.includes("/broker/notifications")) return "Notifications";
  return "Dashboard";
};

export default function BrokerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const activeTab = getActiveTab(pathname);

  return (
    <BrokerProvider>
      <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900 selection:bg-blue-600 selection:text-white antialiased">
        
        {/* Sidebar Navigation */}
        <Sidebar activeTab={activeTab} />

        {/* Content Wrapper */}
        <div className="flex-1 flex flex-col min-w-0">
          


          {/* Page body content */}
          <main className="flex-1 overflow-y-auto p-8 max-w-[1600px] w-full mx-auto">
            {children}
          </main>

        </div>
      </div>
    </BrokerProvider>
  );
}
