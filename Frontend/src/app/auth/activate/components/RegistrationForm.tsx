/**
 * ==============================================================================
 * COMPONENT: RegistrationForm.tsx
 * Path: src/app/auth/activate/components/RegistrationForm.tsx
 * Description: The invite-only client registration form. Users enter ID credentials
 *              which are submitted for compliance audit/verification.
 * ==============================================================================
 */

import React, { useState } from "react";
import { Lock, FileText, ChevronDown, Check, ShieldAlert } from "lucide-react";

interface RegistrationFormProps {
  token: string;
  onSuccess: (clientName: string, idType: string, idNumber: string) => void;
}

export default function RegistrationForm({ token, onSuccess }: RegistrationFormProps) {
  // ------------------------------------------------------------------------------
  // FORM FIELDS STATE
  // ------------------------------------------------------------------------------
  const [fullName, setFullName] = useState(""); // Asked to link it cleanly to a client
  const [idType, setIdType] = useState("Driver License");
  const [idNumber, setIdNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ------------------------------------------------------------------------------
  // SUBMISSION HANDLER (Submits to /auth/activate?token={} simulated backend)
  // ------------------------------------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // Form Validations
    if (!fullName.trim() || !idNumber.trim() || !password.trim() || !confirmPassword.trim()) {
      setErrorMsg("All registration fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate backend endpoint: /auth/activate?token={token}
      const response = await fetch(`/auth/activate?token=${encodeURIComponent(token)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, idType, idNumber, password })
      }).catch(() => {
        // Since there is no actual live backend node.js listener, this catch is expected.
        // We bypass it for demonstration / client simulation.
        return { ok: true };
      });

      // Prepare simulated SubmittedDocument for Compliance review
      const newRegistrationReview = {
        id: `reg-${Date.now()}`,
        clientName: fullName,
        loanType: "Identity Verification",
        documentName: `${idType} (No. ${idNumber})`,
        dateSubmitted: new Date().toISOString().split("T")[0],
        status: "To Be Reviewed",
        fileSize: "N/A",
        fileType: "Signup Creds"
      };

      // Store in LocalStorage so Compliance portal loads it dynamically
      const existingStr = localStorage.getItem("new_registrations");
      const existing = existingStr ? JSON.parse(existingStr) : [];
      localStorage.setItem("new_registrations", JSON.stringify([...existing, newRegistrationReview]));

      // Artificial loading feel
      setTimeout(() => {
        setIsSubmitting(false);
        onSuccess(fullName, idType, idNumber);
      }, 1500);

    } catch (e) {
      setErrorMsg("Simulated connection error. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans text-slate-100 relative overflow-hidden">
      
      {/* Background Ornaments */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-indigo-900/25 rounded-full blur-3xl pointer-events-none" />

      {/* ---------------------------------------------------------------------- */}
      {/* MAIN CONTAINER CARD                                                   */}
      {/* ---------------------------------------------------------------------- */}
      <div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] shadow-2xl rounded-[32px] p-8 max-w-md w-full space-y-6 relative z-10 animate-scaleIn">
        
        {/* Header */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-extrabold uppercase tracking-wider mb-2">
            Secure Invitation Activation
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Create Account</h2>
          <p className="text-xs text-slate-400 font-medium leading-relaxed">
            Activate your dossier and register your verification credentials.
          </p>
        </div>

        {/* Error Alert Box */}
        {errorMsg && (
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-2.5 text-xs font-semibold text-rose-400">
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ---------------------------------------------------------------------- */}
        {/* REGISTRATION FORM CONTAINER                                           */}
        {/* ---------------------------------------------------------------------- */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* 1. Full Name Field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Emma Wilson"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500/50 transition-colors font-medium"
              />
            </div>
          </div>

          {/* 2. ID Type & ID Number grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* ID Type Select Dropdown */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                ID Type
              </label>
              <div className="relative">
                <select
                  value={idType}
                  onChange={(e) => setIdType(e.target.value)}
                  className="w-full bg-slate-900 border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500/50 transition-colors font-medium appearance-none cursor-pointer"
                >
                  <option value="Driver License">Driver License</option>
                  <option value="Passport">Passport</option>
                  <option value="National ID Card">National ID Card</option>
                  <option value="Medicare Card">Medicare Card</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* ID Number input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                ID Number
              </label>
              <input
                type="text"
                placeholder="e.g. DL-987654"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500/50 transition-colors font-medium"
              />
            </div>

          </div>

          {/* 3. Password & Confirm Password grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Password
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
                <input
                  type="password"
                  placeholder="******"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500/50 transition-colors font-medium"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Confirm
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
                <input
                  type="password"
                  placeholder="******"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500/50 transition-colors font-medium"
                />
              </div>
            </div>

          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-all pt-2.5 cursor-pointer"
          >
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <span>Submit Registration</span>
            )}
          </button>

        </form>

        {/* Footer Note */}
        <p className="text-[10px] text-slate-500 text-center font-semibold">
          BAI Finance Identity Auditing & GDPR Safeguards
        </p>

      </div>
    </div>
  );
}
