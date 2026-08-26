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
import { ClipboardList, Clock, AlertTriangle, CheckCircle, ArrowRight, Calendar, UserPlus, Percent, Bell, CalendarClock, ChevronDown, ArrowUpRight } from "lucide-react";
import { Client, Booking } from "../MockData";
import ClientApplicationDashboard from "../applications/ClientApplicationDashboard";
import { useBroker } from "../BrokerContext";
import Link from "next/link";

type TimeRange = "Today" | "This Week" | "This Month" | "This Year" | "All Time" | "Custom Range";

export default function DashboardTab() {
  const { clients } = useBroker();
  // ------------------------------------------------------------------------------
  // STATE DEFINITIONS
  // ------------------------------------------------------------------------------
  const [timeFilter, setTimeFilter] = useState<TimeRange>("All Time");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  
  // Custom date range state
  const [customStartDate, setCustomStartDate] = useState("2026-08-01");
  const [customEndDate, setCustomEndDate] = useState("2026-08-24");

  // Clickable stat card filter state
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "In review" | "Requested" | "Approved">("All");

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
      if (timeFilter === "Custom Range") {
        return client.dateStarted >= customStartDate && client.dateStarted <= customEndDate;
      }
      return true; // All Time
    });
  };

  const filteredClients = getFilteredClients();

  // Sort filtered clients by dateStarted descending (most recent first)
  const sortedClients = [...filteredClients].sort((a, b) => 
    b.dateStarted.localeCompare(a.dateStarted)
  );

  // Calculate dynamic stats based on time filter (always shows count of all matches for the timeframe)
  const activeAppsCount = filteredClients.filter(c => c.documentState !== "Settled" && c.documentState !== "Declined").length;
  const inReviewCount = filteredClients.filter(c => c.documentState === "In review").length;
  const actionNeededCount = filteredClients.filter(c => c.documentState === "Requested").length;
  const approvedCount = filteredClients.filter(c => c.documentState === "Approved").length;

  // Sum and counts for approved loans
  const approvedClients = filteredClients.filter(c => c.documentState === "Approved");
  const totalApprovedLoanValue = approvedClients.reduce((sum, c) => sum + c.amount, 0);
  const approvedLoansCount = approvedClients.length;

  // Filter sorted clients by status filter if active
  const statusFilteredClients = sortedClients.filter(c => {
    if (statusFilter === "All") return true;
    if (statusFilter === "Active") return c.documentState !== "Settled" && c.documentState !== "Declined";
    if (statusFilter === "In review") return c.documentState === "In review";
    if (statusFilter === "Requested") return c.documentState === "Requested";
    if (statusFilter === "Approved") return c.documentState === "Approved";
    return true;
  });

  // Capped at max of 6 recent clients
  const recentClients = statusFilteredClients.slice(0, 6);



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
        <div className="relative self-start sm:self-auto z-20 flex flex-col sm:flex-row items-start sm:items-center gap-2">
          {timeFilter === "Custom Range" && (
            <div className="flex items-center gap-2 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-xs text-xs font-bold text-slate-700">
              <span className="text-slate-400 font-medium">From:</span>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                onDoubleClick={(e) => { try { e.currentTarget.showPicker(); } catch (err) {} }}
                title="Double click to open calendar"
                className="bg-transparent border-none outline-none font-bold text-slate-800 cursor-pointer"
              />
              <span className="text-slate-400 font-medium ml-1">To:</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                onDoubleClick={(e) => { try { e.currentTarget.showPicker(); } catch (err) {} }}
                title="Double click to open calendar"
                className="bg-transparent border-none outline-none font-bold text-slate-800 cursor-pointer"
              />
            </div>
          )}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 rounded-xl transition-all shadow-xs"
          >
            <span>Timeframe: <strong>{timeFilter}</strong></span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isFilterOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-40 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5">
              {(["Today", "This Week", "This Month", "This Year", "All Time", "Custom Range"] as TimeRange[]).map((range) => (
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
      {/* SECTION 1.5: TOTAL LOAN VALUE BANNER                                   */}
      {/* ---------------------------------------------------------------------- */}
      <div className="bg-[#071644] border border-[#0B2369]/30 rounded-3xl p-6 shadow-soft-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 select-none animate-fadeIn">
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-amber-300/80 uppercase tracking-wider block">
            Total Approved Loan Value
          </span>
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="text-4xl font-extrabold text-amber-400 tracking-tight">
              A$ {totalApprovedLoanValue.toLocaleString()}
            </span>
            <div className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-white/10 px-2 py-0.5 rounded-lg border border-amber-400/20">
              <ArrowUpRight className="w-3 h-3 text-amber-400" />
              <span>+14.8% increase</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start md:items-end gap-0.5">
          <span className="text-xs font-bold text-amber-300/80 uppercase tracking-wider">
            Approved Loan Volume
          </span>
          <span className="text-lg font-extrabold text-amber-400">
            {approvedLoansCount} Approved Loans Totaled
          </span>
          <p className="text-[10px] text-slate-300 font-medium">
            Calculated dynamically based on timeframe filter
          </p>
        </div>
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* SECTION 2: STATS SUMMARY CARDS                                         */}
      {/* ---------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Active Applications */}
        <div 
          onClick={() => setStatusFilter(statusFilter === "Active" ? "All" : "Active")}
          className={`rounded-3xl p-6 border shadow-soft-xl hover:shadow-md transition-all duration-200 cursor-pointer select-none ${
            statusFilter === "Active" 
              ? "bg-[#163691] border-amber-400 ring-2 ring-amber-400/20" 
              : "bg-[#071644] border-[#0B2369]/30 hover:bg-[#071644]/90"
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center mb-4 border border-amber-400/20">
            <ClipboardList className="w-5 h-5" />
          </div>
          <span className="text-4xl font-extrabold text-amber-400 tracking-tight block mb-1">
            {activeAppsCount}
          </span>
          <span className="text-xs font-bold text-amber-300/80 uppercase tracking-wider">
            Active applications
          </span>
        </div>

        {/* Card 2: In Review */}
        <div 
          onClick={() => setStatusFilter(statusFilter === "In review" ? "All" : "In review")}
          className={`rounded-3xl p-6 border shadow-soft-xl hover:shadow-md transition-all duration-200 cursor-pointer select-none ${
            statusFilter === "In review" 
              ? "bg-[#163691] border-amber-400 ring-2 ring-amber-400/20" 
              : "bg-[#071644] border-[#0B2369]/30 hover:bg-[#071644]/90"
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center mb-4 border border-amber-400/20">
            <Clock className="w-5 h-5" />
          </div>
          <span className="text-4xl font-extrabold text-amber-400 tracking-tight block mb-1">
            {inReviewCount}
          </span>
          <span className="text-xs font-bold text-amber-300/80 uppercase tracking-wider">
            In review
          </span>
        </div>

        {/* Card 3: Action Needed */}
        <div 
          onClick={() => setStatusFilter(statusFilter === "Requested" ? "All" : "Requested")}
          className={`rounded-3xl p-6 border shadow-soft-xl hover:shadow-md transition-all duration-200 cursor-pointer select-none ${
            statusFilter === "Requested" 
              ? "bg-[#163691] border-amber-400 ring-2 ring-amber-400/20" 
              : "bg-[#071644] border-[#0B2369]/30 hover:bg-[#071644]/90"
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center mb-4 border border-amber-400/20">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <span className="text-4xl font-extrabold text-amber-400 tracking-tight block mb-1">
            {actionNeededCount}
          </span>
          <span className="text-xs font-bold text-amber-300/80 uppercase tracking-wider">
            Action needed
          </span>
        </div>

        {/* Card 4: Approved */}
        <div 
          onClick={() => setStatusFilter(statusFilter === "Approved" ? "All" : "Approved")}
          className={`rounded-3xl p-6 border shadow-soft-xl hover:shadow-md transition-all duration-200 cursor-pointer select-none ${
            statusFilter === "Approved" 
              ? "bg-[#163691] border-amber-400 ring-2 ring-amber-400/20" 
              : "bg-[#071644] border-[#0B2369]/30 hover:bg-[#071644]/90"
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center mb-4 border border-amber-400/20">
            <CheckCircle className="w-5 h-5" />
          </div>
          <span className="text-4xl font-extrabold text-amber-400 tracking-tight block mb-1">
            {approvedCount}
          </span>
          <span className="text-xs font-bold text-amber-300/80 uppercase tracking-wider">
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
            <div className="p-6 bg-[#071644] border-b border-[#0B2369]/30 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-amber-400 text-base">
                  Recent Client Summary {statusFilter !== "All" && <span className="text-amber-300">({statusFilter})</span>}
                </h3>
                <p className="text-xs text-slate-300 font-medium">
                  {statusFilter !== "All" 
                    ? `Showing clients in "${statusFilter}" state. Click card again to reset.` 
                    : "Click on any client to view their detailed profile dashboard"}
                </p>
              </div>
              <Link 
                href="/broker/applications"
                className="text-[10px] font-bold text-amber-300 hover:text-white bg-white/10 hover:bg-white/20 px-3.5 py-1.5 rounded-xl border border-amber-400/30 transition-all select-none"
              >
                View All
              </Link>
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
