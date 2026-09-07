/**
 * ==============================================================================
 * COMPONENT: LoanStatusTab.tsx
 * Path: src/app/client/components/LoanStatusTab.tsx
 * Description: Client Loan Status tab showing active mortgage loan parameters,
 *              offset account balances, and remaining term stats.
 * ==============================================================================
 */

import React, { useState } from "react";
import Link from "next/link";
import { Landmark, ArrowRight, Wallet, Percent, ShieldCheck, Mail, Calendar, ArrowLeft, Reply } from "lucide-react";
import { Client } from "../../broker/MockData";
import { BrokerEmail, initialBrokerEmails } from "../MockClientData";

interface LoanStatusTabProps {
  client: Client;
}

export default function LoanStatusTab({ client }: LoanStatusTabProps) {
  // ------------------------------------------------------------------------------
  // 1. STATE DEFINITIONS
  // ------------------------------------------------------------------------------
  // Selected email for the inline viewer within the Loan Status communications container
  const [selectedEmail, setSelectedEmail] = useState<BrokerEmail | null>(null);
  
  // Format currency helper
  const formatCurrency = (val: number) => {
    return `A$ ${val.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header section */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-800">My Loan Status</h2>
        <p className="text-xs text-slate-400 font-medium mt-0.5">
          Review mortgage terms, offset account details, and repayment summaries.
        </p>
      </div>

      {/* Main active loan details panel */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-soft-xl space-y-6">
        
        {/* Active Loan title */}
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Landmark className="w-5 h-5 text-[#0024A8]" />
            <h3 className="text-base font-extrabold text-slate-800">
              Active Construction Mortgage
            </h3>
          </div>
          <span className="text-[10px] font-extrabold uppercase text-[#0024A8] bg-sky-50 border border-sky-200 px-2 py-0.5 rounded">
            Pre-Approval Stage
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs font-semibold">
          
          <div className="space-y-0.5 bg-slate-50 p-4 rounded-xl border border-slate-200/40">
            <span className="text-[10px] text-slate-400 uppercase">Loan Amount Requested</span>
            <span className="text-base font-black text-[#0024A8] block">
              {formatCurrency(client.loan.requestedAmount)}
            </span>
          </div>

          <div className="space-y-0.5 bg-slate-50 p-4 rounded-xl border border-slate-200/40">
            <span className="text-[10px] text-slate-400 uppercase">Interest Rate</span>
            <span className="text-base font-black text-[#0024A8] block">
              5.85% p.a.
            </span>
          </div>

          <div className="space-y-0.5 bg-slate-50 p-4 rounded-xl border border-slate-200/40">
            <span className="text-[10px] text-slate-400 uppercase">Preferred Term</span>
            <span className="text-base font-black text-[#0024A8] block">
              {client.loan.preferredTerm} Years
            </span>
          </div>

          <div className="space-y-0.5 bg-slate-50 p-4 rounded-xl border border-slate-200/40">
            <span className="text-[10px] text-slate-400 uppercase">Est. Monthly Repayments</span>
            <span className="text-base font-black text-[#0024A8] block">
              {formatCurrency(client.loan.preferredMonthlyPayment)}
            </span>
          </div>

        </div>

        {/* Offset Balance Box */}
        <div className="bg-[#0024A8] text-white p-6 rounded-2xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm shadow-[#0024A8]/10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex gap-4 items-center">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-100/70 block">
                Linked Mortgage Offset Account Balance
              </span>
              <span className="text-2xl font-black block">
                {formatCurrency(500000)}
              </span>
            </div>
          </div>

          <div className="text-left sm:text-right shrink-0 bg-white/10 p-3.5 rounded-xl border border-white/10 text-xs font-semibold">
            <span className="text-sky-100/60 block text-[9px] uppercase">Effective Net Loan Balance</span>
            <span className="text-base font-black block">A$ 250,000</span>
          </div>
        </div>

        {/* Dynamic checks checklist details */}
        <div className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3 bg-slate-50/50 p-5 rounded-2xl border border-slate-200/30">
            <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider pb-1.5 border-b border-slate-100">
              Assessed Serviceability Details
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-500">
              <li className="flex justify-between">
                <span>Property Purchase Price</span>
                <span className="text-slate-800">{formatCurrency(client.collateral.estimatedValue)}</span>
              </li>
              <li className="flex justify-between">
                <span>Client Contribution (Deposit)</span>
                <span className="text-slate-800">{formatCurrency(500000)}</span>
              </li>
              <li className="flex justify-between">
                <span>Loan to Value Ratio (LVR)</span>
                <span className="text-emerald-600 font-extrabold">60.00%</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3 bg-slate-50/50 p-5 rounded-2xl border border-slate-200/30">
            <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider pb-1.5 border-b border-slate-100">
              Regulatory Security Audits
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-500">
              <li className="flex justify-between">
                <span>Dossier Validation Checklist</span>
                <span className="text-slate-800">Pending final ID check</span>
              </li>
              <li className="flex justify-between">
                <span>Formal Valuation Status</span>
                <span className="text-slate-800">Approved by Macquarie Bank</span>
              </li>
              <li className="flex justify-between">
                <span>Assessment Status</span>
                <span className="text-amber-500 font-extrabold">Conditional Offer Received</span>
              </li>
            </ul>
          </div>
        </div>

      </div>

      {/* ==================================================================== */}
      {/* SECTION 2: RECENT BROKER COMMUNICATIONS CONTAINER                    */}
      {/* Displays recent emails sent by the assigned broker with View All link */}
      {/* to the Communications tab and inline email reader with identical UI.  */}
      {/* ==================================================================== */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-soft-xl space-y-6">
        
        {/* ------------------------------------------------------------------ */}
        {/* Container Header: Title & View All Redirection Link                */}
        {/* ------------------------------------------------------------------ */}
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Mail className="w-5 h-5 text-[#0024A8] shrink-0" />
            <div className="min-w-0">
              <h3 className="text-base font-extrabold text-slate-800 tracking-tight">
                Recent Received Emails
              </h3>
              <p className="text-[11px] text-slate-400 font-medium truncate">
                Official mortgage updates, lender document requests, and notifications
              </p>
            </div>
          </div>

          {/* "View all" link redirecting to Client Communication tab */}
          <Link
            href="/client/communication"
            className="flex items-center gap-1.5 text-xs font-bold text-[#0024A8] hover:text-[#001D85] hover:underline shrink-0 group transition-colors"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Conditional View: Inline Full Email Reader OR List of Emails       */}
        {/* ------------------------------------------------------------------ */}
        {selectedEmail ? (
          /* ================================================================ */
          /* SUBSECTION 2A: INLINE FULL EMAIL VIEWER (Same UI as container)   */
          /* ================================================================ */
          <div className="space-y-5 animate-fadeIn">
            {/* Back navigation header */}
            <div className="flex items-center justify-between gap-4 pb-3 border-b border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedEmail(null)}
                className="flex items-center gap-1.5 text-xs font-bold text-[#0024A8] hover:text-[#001D85] bg-blue-50/80 hover:bg-blue-100/70 border border-blue-200/60 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to recent emails</span>
              </button>

              <span className="text-[10px] font-extrabold text-[#0024A8] bg-blue-50 border border-blue-200/60 px-2.5 py-1 rounded-full uppercase tracking-wider">
                Secure Message Viewer
              </span>
            </div>

            {/* Email Subject Title */}
            <div>
              <h4 className="text-base sm:text-lg font-extrabold text-slate-800 leading-snug">
                {selectedEmail.subject}
              </h4>
            </div>

            {/* Sender and Date Metadata Box */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/40 text-xs font-semibold">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#0024A8]/10 text-[#0024A8] flex items-center justify-center font-bold text-xs border border-[#0024A8]/15">
                  SJ
                </div>
                <div>
                  <span className="text-slate-800 font-bold block">{selectedEmail.sender}</span>
                  <span className="text-[10px] text-slate-400 font-medium block">{selectedEmail.senderEmail}</span>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] text-slate-400 block uppercase">Received Date</span>
                <span className="text-slate-700 block font-bold">{selectedEmail.date}</span>
              </div>
            </div>

            {/* Email Body */}
            <div className="p-5 rounded-2xl bg-slate-50/50 border border-slate-100 text-xs text-slate-600 font-medium leading-relaxed whitespace-pre-line">
              {selectedEmail.body}
            </div>

            {/* Bottom Actions: Close Reader & Reply Button */}
            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 text-[10px] font-extrabold uppercase">
              <button
                type="button"
                onClick={() => setSelectedEmail(null)}
                className="py-2.5 px-5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 transition-all cursor-pointer"
              >
                Close Email
              </button>

              {/* Blue Reply button with white text (Placeholder: does nothing for now) */}
              <button
                type="button"
                onClick={() => {
                  // Intentional placeholder: does nothing for now as requested
                }}
                className="py-2.5 px-6 rounded-xl bg-[#0024A8] hover:bg-[#001D85] text-white font-extrabold shadow-md shadow-[#0024A8]/15 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Reply className="w-3.5 h-3.5" />
                <span>Reply</span>
              </button>
            </div>
          </div>
        ) : (
          /* ================================================================ */
          /* SUBSECTION 2B: RECENT RECEIVED EMAILS LIST VIEW                  */
          /* ================================================================ */
          <div className="space-y-3">
            {initialBrokerEmails.map((email) => (
              <div
                key={email.id}
                onClick={() => setSelectedEmail(email)}
                className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 hover:bg-blue-50/40 border border-slate-200/60 hover:border-[#0024A8]/30 transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs hover:shadow-xs"
              >
                {/* Email details preview */}
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-[#0024A8]/10 text-[#0024A8] font-black text-xs flex items-center justify-center shrink-0 border border-[#0024A8]/15 group-hover:scale-105 transition-transform">
                    SJ
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-extrabold text-slate-800 group-hover:text-[#0024A8] transition-colors">
                        {email.subject}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        • {email.sender}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1 font-medium">
                      {email.snippet}
                    </p>
                  </div>
                </div>

                {/* Date & Open Arrow CTA */}
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-semibold">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{email.date}</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-white group-hover:bg-[#0024A8] text-slate-400 group-hover:text-white border border-slate-200/60 group-hover:border-transparent transition-all">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
