/**
 * ==============================================================================
 * COMPONENT: LoanStatusTab.tsx
 * Path: src/app/client/components/LoanStatusTab.tsx
 * Description: Client Loan Status tab showing active mortgage loan parameters,
 *              offset account balances, and remaining term stats.
 * ==============================================================================
 */

import React from "react";
import { Landmark, ArrowRight, Wallet, Percent, ShieldCheck } from "lucide-react";
import { Client } from "../../broker/components/MockData";

interface LoanStatusTabProps {
  client: Client;
}

export default function LoanStatusTab({ client }: LoanStatusTabProps) {
  
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
    </div>
  );
}
