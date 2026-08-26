/**
 * ==============================================================================
 * COMPONENT: DashboardTab.tsx
 * Path: src/app/compliance/components/DashboardTab.tsx
 * Description: Compliance Dashboard displaying document analytics cards
 *              and recently submitted files logs.
 * ==============================================================================
 */

import React from "react";
import { FileSearch, CheckCircle, FileWarning, HelpCircle } from "lucide-react";
import { SubmittedDocument } from "../MockComplianceData";
import { useCompliance } from "../ComplianceContext";
import { useRouter } from "next/navigation";

export default function DashboardTab() {
  const { submittedDocs } = useCompliance();
  const router = useRouter();
  
  // ------------------------------------------------------------------------------
  // COMPUTE ANALYTICS COUNT FROM SHARED STATE
  // ------------------------------------------------------------------------------
  const toBeReviewedCount = submittedDocs.filter(doc => doc.status === "To Be Reviewed").length;
  const additionalRequestCount = submittedDocs.filter(doc => doc.status === "Additional Request").length;
  const approvedCount = submittedDocs.filter(doc => doc.status === "Approved").length;
  const declineCount = submittedDocs.filter(doc => doc.status === "Decline").length;

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* ==================================================================== */}
      {/* SECTION 1: ANALYTICS FOR DOCUMENTS (TOP CONTAINER)                   */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* To Be Reviewed Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft-xl hover:shadow-md transition-all duration-200">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1429A9] flex items-center justify-center mb-4 border border-blue-100/50">
            <FileSearch className="w-5 h-5" />
          </div>
          <span className="text-4xl font-extrabold text-[#1429A9] tracking-tight block mb-1">
            {toBeReviewedCount}
          </span>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            To Be Reviewed
          </span>
        </div>

        {/* Additional Request Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft-xl hover:shadow-md transition-all duration-200">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 border border-amber-100/50">
            <HelpCircle className="w-5 h-5" />
          </div>
          <span className="text-4xl font-extrabold text-amber-600 tracking-tight block mb-1">
            {additionalRequestCount}
          </span>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Additional Request
          </span>
        </div>

        {/* Approved Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft-xl hover:shadow-md transition-all duration-200">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 border border-emerald-100/50">
            <CheckCircle className="w-5 h-5" />
          </div>
          <span className="text-4xl font-extrabold text-emerald-600 tracking-tight block mb-1">
            {approvedCount}
          </span>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Approved
          </span>
        </div>

        {/* Decline Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft-xl hover:shadow-md transition-all duration-200">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 border border-rose-100/50">
            <FileWarning className="w-5 h-5" />
          </div>
          <span className="text-4xl font-extrabold text-rose-600 tracking-tight block mb-1">
            {declineCount}
          </span>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Decline
          </span>
        </div>

      </div>

      {/* ==================================================================== */}
      {/* SECTION 2: SUBMITTED DOCUMENTS (UNDER DASHBOARD CONTAINER)           */}
      {/* ==================================================================== */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft-xl overflow-hidden">
        
        {/* Header bar */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-slate-800 text-base">
              Recently Submitted Documents
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              Real-time audit checklist of client folder submissions
            </p>
          </div>
          <button 
            onClick={() => router.push("/compliance/review")}
            className="text-xs font-bold text-[#1429A9] bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3.5 py-1.5 rounded-xl transition-colors hover:border-[#1429A9]/30"
          >
            Go to Review Audits
          </button>
        </div>

        {/* Table layout */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-100 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                <th className="py-4 px-6">Client Name</th>
                <th className="py-4 px-6">Loan Type</th>
                <th className="py-4 px-6">Document Name Submitted</th>
                <th className="py-4 px-6">Date Submitted</th>
                <th className="py-4 px-6 text-right">Status State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 text-xs">
              {submittedDocs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 font-medium">
                    No submitted files logs.
                  </td>
                </tr>
              ) : (
                submittedDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/30 transition-colors">
                    {/* Client Name */}
                    <td className="py-4 px-6 font-bold text-slate-800">
                      {doc.clientName}
                    </td>

                    {/* Loan Type */}
                    <td className="py-4 px-6 font-medium text-slate-500">
                      {doc.loanType}
                    </td>

                    {/* Document Name */}
                    <td className="py-4 px-6 font-bold text-slate-700">
                      {doc.documentName}
                    </td>

                    {/* Date Submitted */}
                    <td className="py-4 px-6 text-slate-500 font-medium">
                      {doc.dateSubmitted}
                    </td>

                    {/* Review Status badge */}
                    <td className="py-4 px-6 text-right">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
                        doc.status === "Approved"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          : doc.status === "Decline"
                          ? "bg-rose-50 text-rose-600 border border-rose-100"
                          : doc.status === "Additional Request"
                          ? "bg-amber-50 text-amber-600 border border-amber-100"
                          : "bg-blue-50 text-blue-600 border border-blue-100 animate-pulse"
                      }`}>
                        {doc.status === "Decline" ? "Declined" : doc.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
