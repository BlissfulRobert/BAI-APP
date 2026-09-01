/**
 * ==============================================================================
 * COMPONENT: DashboardTab.tsx
 * Path: src/app/broker/dashboard/DashboardTab.tsx
 * Description: Reworked Dashboard tab featuring stats time-filters,
 *              a clickable Client Summary list, static notification side-box,
 *              meeting reminders, grouped activity logs with minimize switches,
 *              and inline range calendar filter.
 * ==============================================================================
 */

import React, { useState } from "react";
import { ClipboardList, Clock, AlertTriangle, CheckCircle, ArrowRight, Calendar, UserPlus, Percent, Bell, CalendarClock, ChevronDown, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Client } from "../MockData";
import ClientApplicationDashboard from "../applications/ClientApplicationDashboard";
import { useBroker } from "../BrokerContext";
import Link from "next/link";

export default function DashboardTab() {
  const { clients } = useBroker();
  
  // ------------------------------------------------------------------------------
  // STATE DEFINITIONS
  // ------------------------------------------------------------------------------
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  
  // Clickable stat card filter state
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "In review" | "Requested" | "Approved">("All");

  // Calendar filter and range filter states
  const [selectedDate, setSelectedDate] = useState<string | null>(null); // YYYY-MM-DD
  const [startDate, setStartDate] = useState<string | null>(null); // YYYY-MM-DD
  const [endDate, setEndDate] = useState<string | null>(null); // YYYY-MM-DD
  const [isRangeActive, setIsRangeActive] = useState(false);
  const [showRangeModal, setShowRangeModal] = useState(false);

  // Minimized dates state for activity logs list
  const [minimizedDates, setMinimizedDates] = useState<{ [date: string]: boolean }>({});

  // Range Picker form fields
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");

  // Month navigation (Defaults to August 2026 since mock data has August entries)
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 7, 1));

  // Static Mock Activity Logs (Spans current date 24th, yesterday 23rd, day before 22nd)
  const mockLogs = [
    { id: "1", date: "2026-08-24", time: "09:14 AM", message: "Sarah Jenkins approved Alice Smith's ID doc" },
    { id: "2", date: "2026-08-24", time: "11:30 AM", message: "Michael Chang application moved to Approved status" },
    { id: "3", date: "2026-08-23", time: "02:45 PM", message: "John Doe submitted proof of income" },
    { id: "4", date: "2026-08-23", time: "04:10 PM", message: "Alice Smith requested a callback on interest rates" },
    { id: "5", date: "2026-08-22", time: "10:15 AM", message: "Michael Brown profile created by system invite" },
    { id: "6", date: "2026-08-22", time: "02:20 PM", message: "Emma Wilson compliance check review started" },
  ];

  // Helper date parsing (assuming current date is 2026-08-24)
  const currentDateStr = "2026-08-24";
  
  // ------------------------------------------------------------------------------
  // DYNAMIC FILTERING LOGIC
  // ------------------------------------------------------------------------------
  const getFilteredClients = () => {
    return clients.filter((client) => {
      if (selectedDate) {
        return client.dateStarted === selectedDate;
      }
      if (isRangeActive && startDate && endDate) {
        return client.dateStarted >= startDate && client.dateStarted <= endDate;
      }
      return true; // All Time if no calendar filter
    });
  };

  const getFilteredLogs = () => {
    return mockLogs.filter((log) => {
      if (selectedDate) {
        return log.date === selectedDate;
      }
      if (isRangeActive && startDate && endDate) {
        return log.date >= startDate && log.date <= endDate;
      }
      return true; // No filter: show all
    });
  };

  const filteredClients = getFilteredClients();
  const filteredLogs = getFilteredLogs();

  // Sort filtered clients by dateStarted descending (most recent first)
  const sortedClients = [...filteredClients].sort((a, b) => 
    b.dateStarted.localeCompare(a.dateStarted)
  );

  // Calculate dynamic stats based on filter
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

  // Calendar date calculation helper variables
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  // Group filtered activity logs by date (Sorted by date descending)
  const groupedLogs: { [date: string]: typeof mockLogs } = {};
  filteredLogs.forEach((log) => {
    if (!groupedLogs[log.date]) {
      groupedLogs[log.date] = [];
    }
    groupedLogs[log.date].push(log);
  });
  const sortedLogDates = Object.keys(groupedLogs).sort((a, b) => b.localeCompare(a));

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
      
      {/* Split Grid Layout (Left: Stats & Banner & Table | Right: Calendar & Audit Logs) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-stretch">
        
        {/* LEFT COLUMN: STATISTICS, BANNER & CLIENT LIST TABLE */}
        <div className="xl:col-span-8 space-y-8">
          
          {/* Active Filter Indicators */}
          {(selectedDate || (isRangeActive && startDate && endDate)) && (
            <div className="bg-[#1429A9]/5 border border-[#1429A9]/20 p-4 flex justify-between items-center text-xs text-slate-700 font-bold select-none rounded-none">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#1429A9] rounded-full" />
                <span>
                  Filtering statistics for: <strong className="text-[#1429A9]">{selectedDate ? `Date: ${selectedDate}` : `Range: ${startDate} to ${endDate}`}</strong>
                </span>
              </div>
              <button 
                onClick={() => {
                  setSelectedDate(null);
                  setIsRangeActive(false);
                  setStartDate(null);
                  setEndDate(null);
                }}
                className="text-[#1429A9] hover:underline"
              >
                Clear Filter
              </button>
            </div>
          )}

          {/* SECTION 1.5: TOTAL LOAN VALUE BANNER (SHARP EDGES) */}
          <div className="bg-gradient-to-r from-[#0d1b6b] via-[#1429A9] to-[#253ee6] border border-white/10 rounded-none p-6 shadow-soft-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 select-none animate-fadeIn">
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

          {/* SECTION 2: STATS SUMMARY CARDS (SHARP EDGES, DYNAMIC CLICK STYLING) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* Card 1: Active Applications - Dynamic layout & Selection theme styling */}
            <div 
              onClick={() => setStatusFilter(statusFilter === "Active" ? "All" : "Active")}
              className={`relative rounded-none p-6 border shadow-soft-xl hover:shadow-md transition-all duration-300 cursor-pointer select-none ${
                statusFilter === "Active" 
                  ? "bg-[#1429A9] border-[#1429A9] text-white animate-scaleIn" 
                  : "bg-transparent border-slate-200 hover:border-[#1429A9]/40 text-[#1429A9]"
              }`}
            >
              <div className={`text-5xl font-black leading-none mb-2 ${statusFilter === "Active" ? "text-white" : "text-[#1429A9]"}`}>
                {activeAppsCount}
              </div>
              <span className={`text-[10px] font-extrabold uppercase tracking-wider block ${statusFilter === "Active" ? "text-white/85" : "text-[#1429A9]/75"}`}>
                Active applications
              </span>
              <div className={`absolute bottom-6 right-6 ${statusFilter === "Active" ? "text-white/20" : "text-[#1429A9]/20"}`}>
                <ClipboardList className="w-10 h-10" />
              </div>
            </div>

            {/* Card 2: In Review - Dynamic layout & Selection theme styling */}
            <div 
              onClick={() => setStatusFilter(statusFilter === "In review" ? "All" : "In review")}
              className={`relative rounded-none p-6 border shadow-soft-xl hover:shadow-md transition-all duration-300 cursor-pointer select-none ${
                statusFilter === "In review" 
                  ? "bg-[#1429A9] border-[#1429A9] text-white animate-scaleIn" 
                  : "bg-transparent border-slate-200 hover:border-[#1429A9]/40 text-[#1429A9]"
              }`}
            >
              <div className={`text-5xl font-black leading-none mb-2 ${statusFilter === "In review" ? "text-white" : "text-[#1429A9]"}`}>
                {inReviewCount}
              </div>
              <span className={`text-[10px] font-extrabold uppercase tracking-wider block ${statusFilter === "In review" ? "text-white/85" : "text-[#1429A9]/75"}`}>
                In review
              </span>
              <div className={`absolute bottom-6 right-6 ${statusFilter === "In review" ? "text-white/20" : "text-[#1429A9]/20"}`}>
                <Clock className="w-10 h-10" />
              </div>
            </div>

            {/* Card 3: Action Needed - Dynamic layout & Selection theme styling */}
            <div 
              onClick={() => setStatusFilter(statusFilter === "Requested" ? "All" : "Requested")}
              className={`relative rounded-none p-6 border shadow-soft-xl hover:shadow-md transition-all duration-300 cursor-pointer select-none ${
                statusFilter === "Requested" 
                  ? "bg-[#1429A9] border-[#1429A9] text-white animate-scaleIn" 
                  : "bg-transparent border-slate-200 hover:border-[#1429A9]/40 text-[#1429A9]"
              }`}
            >
              <div className={`text-5xl font-black leading-none mb-2 ${statusFilter === "Requested" ? "text-white" : "text-[#1429A9]"}`}>
                {actionNeededCount}
              </div>
              <span className={`text-[10px] font-extrabold uppercase tracking-wider block ${statusFilter === "Requested" ? "text-white/85" : "text-[#1429A9]/75"}`}>
                Action needed
              </span>
              <div className={`absolute bottom-6 right-6 ${statusFilter === "Requested" ? "text-white/20" : "text-[#1429A9]/20"}`}>
                <AlertTriangle className="w-10 h-10" />
              </div>
            </div>

            {/* Card 4: Approved - Dynamic layout & Selection theme styling */}
            <div 
              onClick={() => setStatusFilter(statusFilter === "Approved" ? "All" : "Approved")}
              className={`relative rounded-none p-6 border shadow-soft-xl hover:shadow-md transition-all duration-300 cursor-pointer select-none ${
                statusFilter === "Approved" 
                  ? "bg-[#1429A9] border-[#1429A9] text-white animate-scaleIn" 
                  : "bg-transparent border-slate-200 hover:border-[#1429A9]/40 text-[#1429A9]"
              }`}
            >
              <div className={`text-5xl font-black leading-none mb-2 ${statusFilter === "Approved" ? "text-white" : "text-[#1429A9]"}`}>
                {approvedCount}
              </div>
              <span className={`text-[10px] font-extrabold uppercase tracking-wider block ${statusFilter === "Approved" ? "text-white/85" : "text-[#1429A9]/75"}`}>
                Approved
              </span>
              <div className={`absolute bottom-6 right-6 ${statusFilter === "Approved" ? "text-white/20" : "text-[#1429A9]/20"}`}>
                <CheckCircle className="w-10 h-10" />
              </div>
            </div>

          </div>

          {/* SECTION 3: RECENT CLIENT SUMMARY TABLE */}
          <div className="bg-white rounded-none border border-slate-200/80 shadow-soft-xl overflow-hidden h-[482px] flex flex-col justify-between">
            <div className="p-5 bg-gradient-to-r from-[#0d1b6b] to-[#1429A9] border-b border-white/10 flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-extrabold text-amber-400 text-sm">
                  Recent Client Summary {statusFilter !== "All" && <span className="text-amber-300">({statusFilter})</span>}
                </h3>
                <p className="text-[10px] text-slate-300 font-medium">
                  {statusFilter !== "All" 
                    ? `Showing clients in "${statusFilter}" state. Click card again to reset.` 
                    : "Click on any client to view their detailed profile dashboard"}
                </p>
              </div>
              <Link 
                href="/broker/applications"
                className="text-[9px] font-bold text-amber-300 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1 rounded-none border border-amber-400/30 transition-all select-none"
              >
                View All
              </Link>
            </div>

            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-100 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                    <th className="py-3 px-5">Client Name</th>
                    <th className="py-3 px-5">Dossier Progress</th>
                    <th className="py-3 px-5">Status</th>
                    <th className="py-3 px-5">Loan Type</th>
                    <th className="py-3 px-5">Date Started</th>
                    <th className="py-3 px-5 text-right">Loan Amount</th>
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
                    recentClients.map((client, index) => (
                      <tr
                        key={client.id}
                        onClick={() => setSelectedClient(client)}
                        className={`cursor-pointer transition-colors group ${
                          index % 2 === 0 
                            ? "bg-white hover:bg-slate-50/80" 
                            : "bg-slate-50/40 hover:bg-slate-100/50"
                        }`}
                      >
                        <td className="py-3.5 px-5 font-bold text-slate-800 group-hover:text-[#1429A9]">
                          {client.name}
                        </td>
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                              <div 
                                className="h-full bg-[#1429A9] rounded-full" 
                                style={{ width: `${client.progress}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-slate-400 font-bold">{client.progress}%</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-5">
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
                        <td className="py-3.5 px-5 font-medium text-slate-500">
                          {client.applicationType}
                        </td>
                        <td className="py-3.5 px-5 text-slate-500">
                          {client.dateStarted}
                        </td>
                        <td className="py-3.5 px-5 text-right font-bold text-slate-800">
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

        {/* RIGHT COLUMN: CALENDAR FILTER & RECENT ACTIVITY LOGS */}
        <div className="xl:col-span-4 space-y-4">
          
          {/* Calendar Box Container (Sharp Edges, White/Blue palette) */}
          <div className="bg-white border border-slate-200/80 p-3.5 shadow-soft-xl rounded-none">
            
            {/* Calendar Header with navigation & Inline Filter/Accept button */}
            <div className="flex justify-between items-center mb-3 pb-2.5 border-b border-slate-100 select-none min-h-[32px]">
              {showRangeModal ? (
                /* Inline Date Range Picker (Inputs made larger to match screen layout) */
                <div className="flex items-center justify-between w-full gap-2 animate-fadeIn">
                  <div className="flex items-center gap-1">
                    <input 
                      type="date" 
                      value={rangeStart} 
                      onChange={(e) => setRangeStart(e.target.value)} 
                      className="bg-slate-50 border border-slate-200 text-xs px-2 py-1 rounded-none font-bold text-slate-800 focus:outline-none focus:border-[#1429A9] w-[105px]"
                    />
                    <span className="text-[10px] text-slate-400 font-bold">→</span>
                    <input 
                      type="date" 
                      value={rangeEnd} 
                      onChange={(e) => setRangeEnd(e.target.value)} 
                      className="bg-slate-50 border border-slate-200 text-xs px-2 py-1 rounded-none font-bold text-slate-800 focus:outline-none focus:border-[#1429A9] w-[105px]"
                    />
                  </div>
                  <button 
                    onClick={() => {
                      if (rangeStart && rangeEnd) {
                        setStartDate(rangeStart);
                        setEndDate(rangeEnd);
                        setIsRangeActive(true);
                        setSelectedDate(null);
                        setShowRangeModal(false);
                      } else {
                        setShowRangeModal(false);
                      }
                    }}
                    className="bg-[#1429A9] text-amber-400 hover:bg-[#1b32cc] font-extrabold text-[10px] px-3 py-1.5 rounded-none transition-all uppercase tracking-wider border border-[#1429A9] shrink-0"
                  >
                    Accept
                  </button>
                </div>
              ) : (
                /* Normal Header Month Navigation */
                <>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                      className="p-1 hover:bg-slate-100 rounded-none text-slate-500 hover:text-slate-800 transition-colors"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider">
                      {currentMonth.toLocaleString("default", { month: "long", year: "numeric" })}
                    </span>
                    <button 
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                      className="p-1 hover:bg-slate-100 rounded-none text-slate-500 hover:text-slate-800 transition-colors"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button 
                    onClick={() => setShowRangeModal(true)}
                    className="bg-[#1429A9] text-amber-400 hover:bg-[#1b32cc] font-extrabold text-[10px] px-3.5 py-1.5 rounded-none transition-all uppercase tracking-wider"
                  >
                    Filter
                  </button>
                </>
              )}
            </div>

            {/* Calendar Weekdays grid */}
            <div className="grid grid-cols-7 text-center text-[10px] font-black text-slate-400 uppercase mb-2 select-none">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Calendar Days grid */}
            <div className="grid grid-cols-7 gap-0.5 text-center text-xs">
              {/* Empty slots for spacing */}
              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <div key={`empty-${i}`} className="p-1.5 select-none" />
              ))}
              
              {/* Actual calendar day buttons */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                
                // Highlight state indicators
                const isSelected = dateStr === selectedDate;
                const isInRange = isRangeActive && startDate && endDate && dateStr >= startDate && dateStr <= endDate;
                const isCurrentDate = dateStr === currentDateStr;

                return (
                  <button
                    key={`day-${day}`}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedDate(null);
                      } else {
                        setSelectedDate(dateStr);
                        setIsRangeActive(false);
                        setStartDate(null);
                        setEndDate(null);
                      }
                    }}
                    className={`p-1.5 font-bold transition-all text-center rounded-none select-none cursor-pointer ${
                      isSelected || isInRange
                        ? "bg-[#1429A9] text-white"
                        : isCurrentDate
                        ? "bg-[#1429A9]/10 text-[#1429A9] ring-1 ring-[#1429A9]/40"
                        : "text-slate-700 hover:bg-[#1429A9]/10 hover:text-[#1429A9]"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

          </div>

          {/* Activity Logs Container (Height matches the client summary list height exactly: h-[482px]) */}
          <div className="bg-white border border-slate-200/80 p-3.5 shadow-soft-xl rounded-none flex flex-col h-[482px]">
            <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider mb-2.5 pb-2 border-b border-slate-100 flex justify-between items-center select-none shrink-0">
              <span>Activity Log</span>
              <span className="text-[10px] text-slate-400 font-bold font-mono">({filteredLogs.length} entries)</span>
            </h3>

            {/* Log item entries grouped and sorted by Date, with minimize buttons */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-3">
              {sortedLogDates.length === 0 ? (
                <p className="text-slate-400 text-center text-xs py-8 font-medium">No logs for selected timeframe.</p>
              ) : (
                sortedLogDates.map((date) => {
                  const isMinimized = !!minimizedDates[date];
                  const logsForDate = groupedLogs[date];
                  return (
                    <div key={date} className="space-y-2 border-b border-slate-100 pb-2 last:border-none">
                      {/* Date label slot with minimize/expand controls */}
                      <div className="flex justify-between items-center select-none bg-slate-50 px-2 py-1 rounded-none border border-slate-100">
                        <span className="text-[9px] font-black text-slate-500 tracking-wider">
                          {date === currentDateStr ? "Today" : date === "2026-08-23" ? "Yesterday" : "Previous"} ({date})
                        </span>
                        <button
                          onClick={() => setMinimizedDates({ ...minimizedDates, [date]: !isMinimized })}
                          className="text-[9px] font-extrabold text-[#1429A9] uppercase hover:underline"
                        >
                          {isMinimized ? "Expand" : "Minimize"}
                        </button>
                      </div>

                      {/* Grouped logs block details */}
                      {!isMinimized && (
                        <div className="space-y-2 pl-2">
                          {logsForDate.map((log) => (
                            <div key={log.id} className="border-l border-[#1429A9]/35 pl-2 py-0.5">
                              <div className="text-[9px] font-bold text-slate-400">{log.time}</div>
                              <p className="text-slate-600 text-[11px] font-semibold">{log.message}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
