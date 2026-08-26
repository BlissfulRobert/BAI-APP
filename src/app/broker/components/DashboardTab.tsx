/**
 * ==============================================================================
 * COMPONENT: DashboardTab.tsx
 * Path: src/app/broker/components/DashboardTab.tsx
 * Description: Reworked Dashboard tab featuring stats time-filters,
 *              a clickable Client Summary list, static notification side-box,
 *              and meeting reminders.
 * ==============================================================================
 */

import React, { useState } from "react";
import { ClipboardList, Clock, AlertTriangle, CheckCircle, ArrowRight, Calendar, UserPlus, Percent, Bell, CalendarClock, ChevronDown } from "lucide-react";
import { Client, Booking } from "./MockData";
import ClientApplicationDashboard from "./ClientApplicationDashboard";

interface DashboardTabProps {
  clients: Client[];
  setActiveTab: (tab: any) => void;
}

type TimeRange = "Today" | "This Week" | "This Month" | "This Year" | "All Time";

export default function DashboardTab({ clients, setActiveTab }: DashboardTabProps) {
  // ------------------------------------------------------------------------------
  // STATE DEFINITIONS
  // ------------------------------------------------------------------------------
  const [timeFilter, setTimeFilter] = useState<TimeRange>("All Time");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Helper date parsing (assuming current date is 2026-08-24)
  const currentDateStr = "2026-08-24";
  
  // ------------------------------------------------------------------------------
  // FILTERING LOGIC
  // ------------------------------------------------------------------------------
  const getFilteredClients = () => {
    return clients.filter((client) => {
      if (timeFilter === "Today") {
        return client.dateStarted === currentDateStr;
      }
      if (timeFilter === "This Week") {
        // Last 7 days: 2026-08-17 to 2026-08-24
        return client.dateStarted >= "2026-08-17" && client.dateStarted <= currentDateStr;
      }
      if (timeFilter === "This Month") {
        // August 2026
        return client.dateStarted.startsWith("2026-08");
      }
      if (timeFilter === "This Year") {
        return client.dateStarted.startsWith("2026");
      }
      return true; // All Time
    });
  };

  const filteredClients = getFilteredClients();

  // Sort filtered clients by dateStarted descending (most recent first)
  const sortedClients = [...filteredClients].sort((a, b) => 
    b.dateStarted.localeCompare(a.dateStarted)
  );

  // Capped at max of 5 recent clients
  const recentClients = sortedClients.slice(0, 5);

  // Calculate dynamic stats based on time filter
  const activeAppsCount = filteredClients.filter(c => c.documentState !== "Settled" && c.documentState !== "Declined").length;
  const inReviewCount = filteredClients.filter(c => c.documentState === "In review").length;
  const actionNeededCount = filteredClients.filter(c => c.documentState === "Requested").length;
  const approvedCount = filteredClients.filter(c => c.documentState === "Approved").length;



  // ------------------------------------------------------------------------------
  // CONDITIONAL ROUTING: IF A CLIENT IS CLICKED, SHOW CLIENT APPLICATION DASHBOARD
  // ------------------------------------------------------------------------------
  if (selectedClient) {
    return (
      <ClientApplicationDashboard 
        client={selectedClient} 
        onBack={() => setSelectedClient(null)} 
      />
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* ---------------------------------------------------------------------- */}
      {/* SECTION 1: HEADER & TIME FILTER DROPDOWN                               */}
      {/* ---------------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800">Broker Dashboard</h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Real-time analytics and dossier tracking filtered by timeframe.
          </p>
        </div>

        {/* Timeframe Filter Button (Top Right of Dashboard Content area) */}
        <div className="relative self-start sm:self-auto z-20">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 rounded-xl transition-all shadow-xs"
          >
            <span>Timeframe: <strong>{timeFilter}</strong></span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isFilterOpen && (
            <div className="absolute right-0 mt-1.5 w-40 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5">
              {(["Today", "This Week", "This Month", "This Year", "All Time"] as TimeRange[]).map((range) => (
                <button
                  key={range}
                  onClick={() => {
                    setTimeFilter(range);
                    setIsFilterOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-xs font-semibold hover:bg-slate-50 transition-colors ${
                    timeFilter === range ? "text-[#0B2369] bg-slate-50" : "text-slate-600"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* SECTION 2: STATS SUMMARY CARDS                                         */}
      {/* ---------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Active Applications */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft-xl hover:shadow-md transition-all duration-200">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0B2369] flex items-center justify-center mb-4 border border-blue-100/50">
            <ClipboardList className="w-5 h-5" />
          </div>
          <span className="text-4xl font-extrabold text-[#0B2369] tracking-tight block mb-1">
            {activeAppsCount}
          </span>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Active applications
          </span>
        </div>

        {/* Card 2: In Review */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft-xl hover:shadow-md transition-all duration-200">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0B2369] flex items-center justify-center mb-4 border border-blue-100/50">
            <Clock className="w-5 h-5" />
          </div>
          <span className="text-4xl font-extrabold text-[#0B2369] tracking-tight block mb-1">
            {inReviewCount}
          </span>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            In review
          </span>
        </div>

        {/* Card 3: Action Needed */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft-xl hover:shadow-md transition-all duration-200">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0B2369] flex items-center justify-center mb-4 border border-blue-100/50">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <span className="text-4xl font-extrabold text-[#0B2369] tracking-tight block mb-1">
            {actionNeededCount}
          </span>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Action needed
          </span>
        </div>

        {/* Card 4: Approved */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft-xl hover:shadow-md transition-all duration-200">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0B2369] flex items-center justify-center mb-4 border border-blue-100/50">
            <CheckCircle className="w-5 h-5" />
          </div>
          <span className="text-4xl font-extrabold text-[#0B2369] tracking-tight block mb-1">
            {approvedCount}
          </span>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Approved
          </span>
        </div>

      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* SECTION 3: SPLIT GRID LAYOUT                                          */}
      {/* ---------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: REWORKED CLIENT SUMMARY TABLE (REPLACES SUBMITTED APPS)   */}
        <div className="lg:col-span-12 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft-xl overflow-hidden">
            
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-800 text-base">
                  Recent Client Summary
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  Click on any client to view their detailed profile dashboard
                </p>
              </div>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/50">
                Capped at 5 Records
              </span>
            </div>

            {/* Client list table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-100 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                    <th className="py-4 px-6">Client Name</th>
                    <th className="py-4 px-6">Dossier Progress</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6">Loan Type</th>
                    <th className="py-4 px-6">Date Started</th>
                    <th className="py-4 px-6 text-right">Loan Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 text-xs">
                  {recentClients.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                        No clients found for this timeframe filter.
                      </td>
                    </tr>
                  ) : (
                    recentClients.map((client) => (
                      <tr
                        key={client.id}
                        onClick={() => setSelectedClient(client)}
                        className="hover:bg-slate-50/75 cursor-pointer transition-colors group"
                      >
                        {/* Name */}
                        <td className="py-4 px-6 font-bold text-slate-800 group-hover:text-[#0B2369]">
                          {client.name}
                        </td>

                        {/* Progress */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                              <div 
                                className="h-full bg-[#0B2369] rounded-full" 
                                style={{ width: `${client.progress}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-slate-400 font-bold">{client.progress}%</span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-6">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
                            client.documentState === "Approved" || client.documentState === "Settled"
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                              : client.documentState === "Declined"
                              ? "bg-rose-50 text-rose-600 border border-rose-100"
                              : "bg-amber-50 text-amber-600 border border-amber-100"
                          }`}>
                            {client.documentState === "Requested" ? "Action Req." : client.documentState}
                          </span>
                        </td>

                        {/* Loan Type */}
                        <td className="py-4 px-6 font-medium text-slate-500">
                          {client.applicationType}
                        </td>

                        {/* Date Started */}
                        <td className="py-4 px-6 text-slate-500">
                          {client.dateStarted}
                        </td>

                        {/* Loan Amount */}
                        <td className="py-4 px-6 text-right font-bold text-slate-800">
                          ${client.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </div>



      </div>
    </div>
  );
}
