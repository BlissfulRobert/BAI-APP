/**
 * ==============================================================================
 * COMPONENT: BookingsTab.tsx
 * Path: src/app/client/components/BookingsTab.tsx
 * Description: Client Bookings tab displaying available broker slots in a
 *              calendar view, enabling booking confirmations and exits.
 * ==============================================================================
 */

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Video, User, Check, X, Clock, MapPin } from "lucide-react";

interface MeetingSlot {
  id: string;
  day: number; // e.g. 20 (August 20)
  time: string;
  type: string;
  platform: string;
  status: "Available" | "Booked";
}

interface BookingsTabProps {
  onLogAction: (actionText: string) => void;
  onNewBooking: (dateStr: string, timeStr: string, typeStr: string, platformStr: string) => void;
}

export default function BookingsTab({ onLogAction, onNewBooking }: BookingsTabProps) {
  // ------------------------------------------------------------------------------
  // STATIC AVAILABLE MEETING SLOTS DEFINITION FOR AUGUST 2026
  // ------------------------------------------------------------------------------
  const [slots, setSlots] = useState<MeetingSlot[]>([
    { id: "slot-1", day: 20, time: "10:00 AM", type: "First Consultation Review", platform: "Google Meet", status: "Available" },
    { id: "slot-2", day: 25, time: "02:00 PM", type: "LVR Assessment Valuation Review", platform: "Microsoft Teams", status: "Available" },
    { id: "slot-3", day: 28, time: "11:30 AM", type: "Document Checklist Compliance Review", platform: "Google Meet", status: "Available" }
  ]);

  // ------------------------------------------------------------------------------
  // CALENDAR CONFIG & STATE
  // ------------------------------------------------------------------------------
  const currentMonth = 7; // August (0-indexed)
  const currentYear = 2026;
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // August 2026 starts on Saturday (6 empty cells before August 1)
  const emptyDaysBefore = 6;
  const daysInMonth = 31;

  // Compile calendar days array (null = empty cell)
  const calendarDays: (number | null)[] = [
    ...Array(emptyDaysBefore).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1)
  ];

  // ------------------------------------------------------------------------------
  // STATE DEFINITIONS
  // ------------------------------------------------------------------------------
  const [selectedSlot, setSelectedSlot] = useState<MeetingSlot | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // ------------------------------------------------------------------------------
  // SLOT BOOKING TRIGGER
  // ------------------------------------------------------------------------------
  const handleDateClick = (dayNum: number) => {
    const matchedSlot = slots.find(s => s.day === dayNum);
    if (matchedSlot) {
      setSelectedSlot(matchedSlot);
    }
  };

  const executeBooking = () => {
    if (!selectedSlot) return;

    // Transition slot status in-memory
    setSlots(prev => prev.map(s => s.id === selectedSlot.id ? { ...s, status: "Booked" } : s));

    const dateStr = `2026-08-${String(selectedSlot.day).padStart(2, "0")}`;
    
    // Trigger global state update in parent page.tsx
    onNewBooking(dateStr, selectedSlot.time, selectedSlot.type, selectedSlot.platform);
    onLogAction(`Booked broker consultation on ${dateStr} at ${selectedSlot.time}`);

    setNotification(`Successfully booked "${selectedSlot.type}" with Sarah Jenkins on ${dateStr} at ${selectedSlot.time}.`);
    setSelectedSlot(null);

    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      
      {/* Header section */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-800">Book a Consultation</h2>
        <p className="text-xs text-slate-400 font-medium mt-0.5">
          Select an available date slot created by your broker Sarah Jenkins to coordinate reviews.
        </p>
      </div>

      {/* Success Notification Alert */}
      {notification && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl animate-fadeIn">
          {notification}
        </div>
      )}

      {/* Main Calendar Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-soft-xl space-y-6">
        
        {/* Calendar Title Controller */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-extrabold text-slate-800 text-sm">
            {monthNames[currentMonth]} {currentYear}
          </h3>
          <div className="flex gap-2">
            <span className="text-[10px] font-extrabold uppercase text-[#0024A8] bg-sky-50 border border-sky-200 px-3 py-1 rounded-xl">
              August Available Slots
            </span>
          </div>
        </div>

        {/* Calendar Weekdays Header */}
        <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Calendar Day Cells Grid */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className="aspect-square bg-slate-50/30 rounded-2xl" />;
            }

            const matchedSlot = slots.find(s => s.day === day);
            
            // Check styling overrides:
            // - Solid `#0024A8` if booked.
            // - Outline `#0024A8` with pulse animation if available.
            // - Standard gray otherwise.
            let cellStyle = "bg-slate-50/50 text-slate-400 border-transparent cursor-not-allowed";
            if (matchedSlot) {
              if (matchedSlot.status === "Booked") {
                cellStyle = "bg-[#0024A8] text-white border-[#0024A8] shadow-sm cursor-pointer hover:bg-[#001D85]";
              } else {
                cellStyle = "bg-white text-[#0024A8] border-[#0024A8] hover:bg-[#0024A8]/5 cursor-pointer ring-2 ring-offset-2 ring-[#0024A8]/20 animate-pulse";
              }
            }

            return (
              <button
                key={`day-${day}`}
                disabled={!matchedSlot}
                onClick={() => handleDateClick(day)}
                className={`aspect-square rounded-2xl flex flex-col items-center justify-center relative font-bold text-xs border transition-all ${cellStyle}`}
              >
                <span>{day}</span>
                
                {/* Available vs Booked mini status labels */}
                {matchedSlot && (
                  <span className="text-[7px] font-extrabold uppercase mt-1 truncate max-w-full px-1">
                    {matchedSlot.status === "Booked" ? "Booked" : "Open Slot"}
                  </span>
                )}
              </button>
            );
          })}
        </div>

      </div>

      {/* ==================================================================== */}
      {/* 4. DETAIL POPUP BOOKING CONFIRMATION WINDOW                          */}
      {/* ==================================================================== */}
      {selectedSlot && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/50 space-y-6 animate-scaleIn">
            
            {/* Header */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-extrabold text-[#0024A8] uppercase tracking-wider block">
                  Auditor Meeting Slots
                </span>
                <h3 className="text-base font-extrabold text-[#0024A8]">
                  {selectedSlot.status === "Booked" ? "Scheduled Meeting Details" : "Book Broker Consultation"}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedSlot(null)}
                className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 border border-slate-200/50 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Event Info Details */}
            <div className="space-y-3.5 bg-slate-50 p-4.5 rounded-2xl border border-slate-200/30 text-xs font-semibold text-slate-600">
              
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-[#0024A8] shrink-0" />
                <div>
                  <span className="text-[9px] text-slate-400 uppercase block">Broker Consultant</span>
                  <span className="text-slate-800 font-bold block">Sarah Jenkins</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-[#0024A8] shrink-0" />
                <div>
                  <span className="text-[9px] text-slate-400 uppercase block">Meeting DateTime</span>
                  <span className="text-slate-800 font-bold block">August {selectedSlot.day}, 2026 at {selectedSlot.time}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Video className="w-4 h-4 text-[#0024A8] shrink-0" />
                <div>
                  <span className="text-[9px] text-slate-400 uppercase block">Platform Channel</span>
                  <span className="text-slate-800 font-bold block">{selectedSlot.platform}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-[#0024A8] shrink-0" />
                <div>
                  <span className="text-[9px] text-slate-400 uppercase block">Meeting Topic</span>
                  <span className="text-slate-800 font-bold block">{selectedSlot.type}</span>
                </div>
              </div>

            </div>

            {/* Operations */}
            <div className="flex justify-end gap-2 text-[10px] font-extrabold uppercase">
              <button
                onClick={() => setSelectedSlot(null)}
                className="py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 transition-all"
              >
                Exit
              </button>

              {selectedSlot.status === "Available" ? (
                <button
                  onClick={executeBooking}
                  className="py-2.5 px-5 bg-[#0024A8] hover:bg-[#001D85] text-white rounded-xl shadow-md shadow-[#0024A8]/10 transition-all"
                >
                  Book Meeting Slot
                </button>
              ) : (
                <div className="py-2.5 px-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Booked</span>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
