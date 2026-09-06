"use client";

/**
 * ==============================================================================
 * COMPONENT: AIChatWidget.tsx
 * Section: Floating Bottom-Right A.I Assistant Chat Widget
 * Location: src/components/LandingPage/AIChatWidget.tsx
 * ==============================================================================
 * Features:
 *  - Floating circular button at the bottom-right of the screen displaying "A.I"
 *  - Interactive toggle state to open/close the conversation box
 *  - Modern, responsive chat container window with headers, sample messages,
 *    quick prompts, and message input field
 *  - Fully styled to match BAI Finance theme (#0B2369, gradient highlights)
 *  - Code organized into annotated sections with clear comments
 */

import { useState } from "react";
import { Sparkles, X, Send, Bot, User, RefreshCw, Paperclip, MessageSquare } from "lucide-react";

export default function AIChatWidget() {
  // ----------------------------------------------------------------------------
  // SECTION 1: STATE MANAGEMENT
  // ----------------------------------------------------------------------------
  // Controls the visibility of the conversation box popup
  const [isOpen, setIsOpen] = useState(false);
  // Holds the message typed by the user in the input box
  const [inputMessage, setInputMessage] = useState("");

  // Handler for form submit (UI mock only - functionality disabled as requested)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    // Clears input for UI demo feel
    setInputMessage("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* ---------------------------------------------------------------------- */}
      {/* SECTION 2: CHAT CONVERSATION CONTAINER BOX (POPUP)                      */}
      {/* ---------------------------------------------------------------------- */}
      {isOpen && (
        <div
          className="mb-4 w-[90vw] sm:w-[380px] h-[520px] max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-slate-200/80 flex flex-col overflow-hidden transition-all duration-300 transform animate-in fade-in slide-in-from-bottom-5"
          style={{ boxShadow: "0 20px 50px -10px rgba(11, 35, 105, 0.25)" }}
        >
          {/* ================================================================== */}
          {/* SUBSECTION 2A: CHAT CONTAINER HEADER                               */}
          {/* ================================================================== */}
          <div className="bg-gradient-to-r from-[#0B2369] via-[#0D2A7F] to-[#1429A9] text-white p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              {/* AI Avatar Icon */}
              <div className="w-9 h-9 rounded-full bg-white/15 border border-white/20 flex items-center justify-center text-amber-400 shadow-inner">
                <Sparkles className="w-5 h-5" />
              </div>
              
              {/* Header Title & Status */}
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm tracking-wide text-white">BAI A.I Assistant</h3>
                  <span className="bg-amber-400/20 text-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-400/30">
                    BETA
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] text-slate-200 font-medium">Online & Ready to Help</span>
                </div>
              </div>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Reset Conversation"
                aria-label="Reset Conversation"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Close Chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* ================================================================== */}
          {/* SUBSECTION 2B: MESSAGES DISPLAY AREA                                */}
          {/* ================================================================== */}
          <div className="flex-1 p-4 overflow-y-auto bg-slate-50/70 flex flex-col gap-3.5">
            
            {/* AI Welcome Bubble */}
            <div className="flex items-start gap-2.5 max-w-[85%]">
              <div className="w-7 h-7 rounded-full bg-[#0B2369] text-white flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-sm">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white p-3.5 rounded-2xl rounded-tl-xs shadow-sm border border-slate-100 text-xs text-slate-700 leading-relaxed">
                <p className="font-semibold text-[#0B2369] mb-1">Hello! 👋</p>
                Welcome to BAI Finance. How can I assist you with your mortgage or loan inquiry today?
              </div>
            </div>

            {/* Sample User Bubble (Demonstration UI) */}
            <div className="flex items-start justify-end gap-2.5 max-w-[85%] self-end">
              <div className="bg-[#0B2369] text-white p-3.5 rounded-2xl rounded-tr-xs shadow-sm text-xs leading-relaxed">
                What home loan rates do you offer?
              </div>
              <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            </div>

            {/* Sample AI Response Bubble */}
            <div className="flex items-start gap-2.5 max-w-[85%]">
              <div className="w-7 h-7 rounded-full bg-[#0B2369] text-white flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-sm">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white p-3.5 rounded-2xl rounded-tl-xs shadow-sm border border-slate-100 text-xs text-slate-700 leading-relaxed">
                We offer competitive rates for residential and commercial loans starting at fixed and variable terms. Use our Repayment Calculator on the page to estimate your monthly payments!
              </div>
            </div>

          </div>

          {/* ================================================================== */}
          {/* SUBSECTION 2C: QUICK SUGGESTED PROMPTS                            */}
          {/* ================================================================== */}
          <div className="px-3 py-2 bg-slate-100/80 border-t border-slate-200/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
              Suggested:
            </span>
            <button
              type="button"
              className="text-[11px] bg-white hover:bg-blue-50 text-[#0B2369] border border-slate-200 hover:border-blue-300 px-2.5 py-1 rounded-full whitespace-nowrap transition-all shrink-0 font-medium"
            >
              Loan Eligibility 💡
            </button>
            <button
              type="button"
              className="text-[11px] bg-white hover:bg-blue-50 text-[#0B2369] border border-slate-200 hover:border-blue-300 px-2.5 py-1 rounded-full whitespace-nowrap transition-all shrink-0 font-medium"
            >
              Book Consultation 📅
            </button>
            <button
              type="button"
              className="text-[11px] bg-white hover:bg-blue-50 text-[#0B2369] border border-slate-200 hover:border-blue-300 px-2.5 py-1 rounded-full whitespace-nowrap transition-all shrink-0 font-medium"
            >
              Calculate Rates 🧮
            </button>
          </div>

          {/* ================================================================== */}
          {/* SUBSECTION 2D: MESSAGE INPUT FIELD & SEND BUTTON                   */}
          {/* ================================================================== */}
          <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-slate-100">
            <div className="flex items-center gap-2 bg-slate-100/90 rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-[#0B2369]/30 focus-within:bg-white transition-all border border-slate-200/70">
              <button
                type="button"
                className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                title="Attach Document"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask A.I a question..."
                className="flex-1 bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none py-1.5"
              />

              <button
                type="submit"
                className={`p-2 rounded-lg transition-all duration-200 ${
                  inputMessage.trim()
                    ? "bg-[#0B2369] text-white hover:bg-[#071644] shadow-sm"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
                disabled={!inputMessage.trim()}
                aria-label="Send Message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <p className="text-[10px] text-slate-400 text-center mt-2">
              BAI A.I responses are generated for assistance purposes.
            </p>
          </form>

        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* SECTION 3: FLOATING AI CIRCLE BUTTON (BOTTOM-RIGHT)                    */}
      {/* ---------------------------------------------------------------------- */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[#0B2369] via-[#0D2A7F] to-[#1429A9] text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-white/30 focus:outline-none focus:ring-4 focus:ring-[#0B2369]/30"
        style={{ boxShadow: "0 10px 30px rgba(11, 35, 105, 0.4)" }}
        aria-label="Open A.I Assistant"
      >
        {/* Subtle glowing ring background animation */}
        <span className="absolute inset-0 rounded-full bg-blue-400/20 animate-ping opacity-75 pointer-events-none" />

        {/* Floating Circle Button Content */}
        {isOpen ? (
          <X className="w-7 h-7 text-white transition-transform duration-200" />
        ) : (
          <div className="flex flex-col items-center justify-center leading-none">
            {/* Sparkles Icon */}
            <Sparkles className="w-4 h-4 text-amber-400 mb-0.5 group-hover:rotate-12 transition-transform duration-300" />
            
            {/* "A.I" Label */}
            <span className="font-extrabold text-sm sm:text-base tracking-wider text-white">
              A.I
            </span>
          </div>
        )}

        {/* Online Indicator Badge */}
        {!isOpen && (
          <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full" />
        )}
      </button>

    </div>
  );
}
