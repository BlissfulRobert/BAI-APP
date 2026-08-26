/**
 * ==============================================================================
 * COMPONENT: BookingsTab.tsx
 * Path: src/app/broker/components/BookingsTab.tsx
 * Description: Interactive Calendar UI and meeting scheduler.
 *              Allows selecting a date, slot, and scheduling meetings.
 * ==============================================================================
 */

import React, { useState } from "react";
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Video, Phone, Plus, MapPin } from "lucide-react";
import { Client, Booking } from "../MockData";

interface BookingsTabProps {
  clients: Client[];
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
}

export default function BookingsTab({ clients, bookings, setBookings }: BookingsTabProps) {
  // Calendar state - default to August 2026 (based on local time)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(7); // 0-indexed: 7 = August

  const [selectedDate, setSelectedDate] = useState("2026-08-25"); // YYYY-MM-DD
  const [bookingTime, setBookingTime] = useState("10:00 AM");
  const [selectedClientId, setSelectedClientId] = useState("");
  const [meetingType, setMeetingType] = useState("Document Clarification Meeting");
  const [meetingPlatform, setMeetingPlatform] = useState("Zoom Video Call");
  const [meetingNotes, setMeetingNotes] = useState("");

  const [notification, setNotification] = useState<string | null>(null);

  // Month metadata
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  // Create days array
  const calendarDays = [];
  // Padding for days of previous month
  for (let i = 0; i < firstDayIndex; i++) {
    calendarDays.push(null);
  }
  // Days of current month
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(d);
  }

  // Format date helper
  const formatDateString = (day: number) => {
    const year = currentYear;
    const month = String(currentMonth + 1).padStart(2, "0");
    const date = String(day).padStart(2, "0");
    return `${year}-${month}-${date}`;
  };

  // Check if a day has bookings
  const getBookingsForDay = (day: number) => {
    const dateStr = formatDateString(day);
    return bookings.filter(b => b.date === dateStr);
  };

  // Nav month handlers
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  // Submit Booking handler
  const handleScheduleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId) {
      alert("Please select a client.");
      return;
    }

    const client = clients.find(c => c.id === selectedClientId);
    if (!client) return;

    const newBooking: Booking = {
      id: `b-${Date.now()}`,
      clientId: selectedClientId,
      clientName: client.name,
      date: selectedDate,
      time: bookingTime,
      type: meetingType,
      platform: meetingPlatform,
      notes: meetingNotes
    };

    setBookings(prev => [newBooking, ...prev]);
    setNotification(`Successfully scheduled a meeting with ${client.name} on ${selectedDate} at ${bookingTime}.`);
    
    // Reset form fields
    setSelectedClientId("");
    setMeetingNotes("");
    
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* ---------------------------------------------------------------------- */}
      {/* HEADER SECTION                                                         */}
      {/* ---------------------------------------------------------------------- */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-800">Bookings Calendar</h2>
        <p className="text-xs text-slate-400 font-medium mt-0.5">
          Schedule client consultation slots, edit booking dates, and review meeting details.
        </p>
      </div>

      {/* Success Notification Alert */}
      {notification && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl animate-fadeIn">
          {notification}
        </div>
      )}

      {/* Main Grid: Left = Interactive Calendar, Right = Form & Agenda */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ==================================================================== */}
        {/* LEFT COLUMN: INTERACTIVE MONTHLY CALENDAR GRID                       */}
        {/* ==================================================================== */}
        <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-soft-xl space-y-6">
          
          {/* Calendar Controller Header */}
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-800 text-sm">
              {monthNames[currentMonth]} {currentYear}
            </h3>
            
            <div className="flex items-center gap-1.5">
              <button 
                onClick={handlePrevMonth}
                className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/50 text-slate-500"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={handleNextMonth}
                className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/50 text-slate-500"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Calendar Weekday Names */}
          <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Calendar Grid Cells */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className="aspect-square bg-slate-50/30 rounded-2xl" />;
              }

              const dateStr = formatDateString(day);
              const isSelected = selectedDate === dateStr;
              const dayBookings = getBookingsForDay(day);
              const hasBookings = dayBookings.length > 0;

              // Holiday checking rules
              const checkIfHoliday = (m: number, d: number) => {
                if (m === 7) { // August (0-indexed)
                  if (d === 10) return { isHoliday: true, name: "Bank Holiday" };
                  if (d === 21) return { isHoliday: true, name: "Ninoy Aquino Day" };
                  if (d === 31) return { isHoliday: true, name: "National Heroes Day" };
                }
                if (m === 11 && d === 25) return { isHoliday: true, name: "Christmas Day" };
                if (m === 0 && d === 1) return { isHoliday: true, name: "New Year's Day" };
                return { isHoliday: false, name: "" };
              };

              const holiday = checkIfHoliday(currentMonth, day);

              // Styling resolution based on meetings and holidays
              let tileClass = "bg-white text-slate-700 border-slate-100 hover:border-slate-300";
              if (hasBookings) {
                tileClass = "bg-[#0B2369] text-white border-[#0B2369] shadow-sm";
              } else if (holiday.isHoliday) {
                tileClass = "bg-rose-600 text-white border-rose-600 shadow-sm";
              }

              // Selected day highlights
              const selectedHighlight = isSelected 
                ? "ring-4 ring-amber-400 border-amber-400 z-10 scale-102 font-black shadow-md" 
                : "";

              return (
                <button
                  key={`day-${day}`}
                  onClick={() => setSelectedDate(dateStr)}
                  title={holiday.isHoliday ? holiday.name : undefined}
                  className={`aspect-square rounded-2xl flex flex-col items-center justify-center relative font-bold text-xs transition-all border ${tileClass} ${selectedHighlight}`}
                >
                  <span>{day}</span>
                  
                  {/* Small sub-label/dot indicators */}
                  {holiday.isHoliday && !hasBookings && (
                    <span className="text-[7px] font-black uppercase text-rose-200 mt-0.5 max-w-full truncate px-1">
                      HOL
                    </span>
                  )}
                  {hasBookings && (
                    <span className="text-[7px] font-black uppercase text-amber-300 mt-0.5 max-w-full truncate px-1">
                      {dayBookings.length} MTG
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Agenda of selected date */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h4 className="font-extrabold text-slate-800 text-xs">
              Meetings on: <span className="text-[#0B2369]">{selectedDate}</span>
            </h4>
            
            <div className="space-y-2">
              {bookings.filter(b => b.date === selectedDate).length === 0 ? (
                <p className="text-[11px] text-slate-400 font-medium">No bookings on this day.</p>
              ) : (
                bookings.filter(b => b.date === selectedDate).map((b) => (
                  <div key={b.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/50 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-slate-800 block">
                        {b.clientName}
                      </span>
                      <span className="text-[10px] text-[#0B2369] font-bold block">
                        {b.type}
                      </span>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {b.notes}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-slate-700 block">{b.time}</span>
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase mt-0.5">
                        {b.platform.includes("Zoom") ? (
                          <Video className="w-2.5 h-2.5 text-blue-500" />
                        ) : (
                          <Phone className="w-2.5 h-2.5 text-emerald-500" />
                        )}
                        {b.platform}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* ==================================================================== */}
        {/* RIGHT COLUMN: BOOKING FORM & FULL SCHEDULE                          */}
        {/* ==================================================================== */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Scheduling Form */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-soft-xl">
            <h3 className="font-extrabold text-slate-800 text-sm mb-4">
              Schedule New Booking
            </h3>

            <form onSubmit={handleScheduleBooking} className="space-y-4">
              {/* Select Date Info */}
              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block mb-1">
                  Selected Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#0B2369]/30 text-xs font-bold text-slate-700"
                />
              </div>

              {/* Select Client Dropdown */}
              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block mb-1">
                  Client
                </label>
                <select
                  required
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#0B2369]/30 text-xs font-semibold text-slate-600"
                >
                  <option value="">Choose a client...</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Set Time (Text Input styled nicely) */}
              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block mb-1">
                  Booking Time
                </label>
                <div className="relative">
                  <Clock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. 10:00 AM or 02:30 PM"
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#0B2369]/30 text-xs font-semibold text-slate-700 placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Meeting Type Dropdown */}
              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block mb-1">
                  Meeting Type
                </label>
                <select
                  value={meetingType}
                  onChange={(e) => setMeetingType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#0B2369]/30 text-xs font-semibold text-slate-600"
                >
                  <option value="Document Clarification Meeting">Document Clarification Meeting</option>
                  <option value="Initial Strategy Consultation">Initial Strategy Consultation</option>
                  <option value="Pre-Approval Review">Pre-Approval Review</option>
                  <option value="Settlement Prep Session">Settlement Prep Session</option>
                </select>
              </div>

              {/* Platform Method Selection */}
              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block mb-1">
                  Meeting Method
                </label>
                <select
                  value={meetingPlatform}
                  onChange={(e) => setMeetingPlatform(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#0B2369]/30 text-xs font-semibold text-slate-600"
                >
                  <option value="Zoom Video Call">Zoom Video Call</option>
                  <option value="Google Meet">Google Meet</option>
                  <option value="Phone Call">Phone Call</option>
                  <option value="In-Office Consultation">In-Office Consultation</option>
                </select>
              </div>

              {/* Meeting Notes */}
              <div>
                <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block mb-1">
                  Internal Notes
                </label>
                <textarea
                  placeholder="Review LVR, self-employed earnings..."
                  value={meetingNotes}
                  onChange={(e) => setMeetingNotes(e.target.value)}
                  rows={2}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#0B2369]/30 text-xs font-semibold text-slate-700 placeholder:text-slate-400 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#0B2369] text-white hover:bg-[#071644] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-[#0B2369]/10 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Create Booking Slot</span>
              </button>
            </form>
          </div>

          {/* Upcoming Bookings Agenda */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-soft-xl space-y-4">
            <h3 className="font-extrabold text-slate-800 text-sm">
              All Scheduled Meetings
            </h3>
            
            <div className="space-y-3.5 divide-y divide-slate-100 max-h-[300px] overflow-y-auto pr-1">
              {bookings.map((b, idx) => (
                <div key={b.id} className={`flex items-start justify-between gap-3 text-xs ${idx > 0 ? "pt-3.5" : ""}`}>
                  <div className="space-y-1">
                    <span className="font-bold text-slate-800 block">{b.clientName}</span>
                    <span className="text-[10px] text-[#0B2369] font-bold block">{b.type}</span>
                    <span className="text-[10px] text-slate-400 font-medium block">Date: {b.date}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-bold text-slate-700 block">{b.time}</span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase">{b.platform}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
