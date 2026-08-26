/**
 * ==============================================================================
 * COMPONENT: StatusScreen.tsx
 * Path: src/app/auth/activate/components/StatusScreen.tsx
 * Description: Feedback screen components showing success or error states
 *              during the user activation/registration flow.
 * ==============================================================================
 */

import React from "react";
import { AlertCircle, CheckCircle, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

interface StatusScreenProps {
  type: "error" | "success";
  title: string;
  message: string;
  token?: string;
}

export default function StatusScreen({ type, title, message, token }: StatusScreenProps) {
  const isError = type === "error";

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 selection:bg-blue-600 selection:text-white font-sans text-slate-100 relative overflow-hidden">
      
      {/* ---------------------------------------------------------------------- */}
      {/* BACKGROUND GRAPHIC ORNAMENTS (Vibrant color gradients)                 */}
      {/* ---------------------------------------------------------------------- */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-indigo-900/30 rounded-full blur-3xl pointer-events-none" />

      {/* ---------------------------------------------------------------------- */}
      {/* MAIN CONTAINER CARD (Glassmorphic visual styling)                     */}
      {/* ---------------------------------------------------------------------- */}
      <div className="bg-white/[0.03] backdrop-blur-lg border border-white/[0.08] shadow-2xl rounded-[32px] p-8 max-w-md w-full text-center space-y-6 animate-scaleIn relative z-10">
        
        {/* Header Icon */}
        <div className="flex justify-center">
          {isError ? (
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center">
              <AlertCircle className="w-8 h-8" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle className="w-8 h-8" />
            </div>
          )}
        </div>

        {/* Text Details */}
        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            {title}
          </h2>
          <p className="text-xs text-slate-400 font-medium leading-relaxed">
            {message}
          </p>
        </div>

        {/* Action Button/Links */}
        <div className="pt-2">
          {isError ? (
            <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
              Verification Required
            </div>
          ) : (
            <div className="space-y-4">
              {/* Proceed to Compliance button */}
              <Link
                href="/compliance"
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer shadow-blue-500/10"
              >
                <span>Proceed to Compliance Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Sent for Auditing</span>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
