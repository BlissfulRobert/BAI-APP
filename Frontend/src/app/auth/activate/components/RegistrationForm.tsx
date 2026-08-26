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
  const [role, setRole] = useState<"Client" | "Broker">("Client");
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
    if (!fullName.trim() || !password.trim() || !confirmPassword.trim()) {
      setErrorMsg("All basic registration fields are required.");
      return;
    }

    if (role === "Broker" && !idNumber.trim()) {
      setErrorMsg("Identity verification details are required for Broker registration.");
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
        body: JSON.stringify({ fullName, role, idType: role === "Broker" ? idType : "N/A", idNumber: role === "Broker" ? idNumber : "N/A", password })
      }).catch(() => {
        // Since there is no actual live backend node.js listener, this catch is expected.
        // We bypass it for demonstration / client simulation.
        return { ok: true };
      });

      // Prepare simulated SubmittedDocument for Compliance review if Broker, or custom review
      const newRegistrationReview = {
        id: `reg-${Date.now()}`,
        clientName: fullName,
        loanType: role === "Broker" ? "Broker Identity Audit" : "Client Registration",
        documentName: role === "Broker" ? `${idType} (No. ${idNumber})` : "Self-Registered Client Profile",
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
        onSuccess(fullName, role === "Broker" ? idType : "N/A", role === "Broker" ? idNumber : "N/A");
      }, 1500);

    } catch (e) {
      setErrorMsg("Simulated connection error. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-800 relative">
      
      {/* ---------------------------------------------------------------------- */}
      {/* MAIN CONTAINER CARD                                                   */}
      {/* ---------------------------------------------------------------------- */}
      <div className="bg-white border border-slate-200 shadow-xl rounded-[24px] p-8 max-w-md w-full space-y-6 relative z-10 animate-scaleIn">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex px-3 py-1 rounded-full bg-[#071644]/5 border border-[#071644]/15 text-[#071644] text-[10px] font-extrabold uppercase tracking-wider mb-1">
            Secure Invitation Activation
          </div>
          <h2 className="text-2xl font-extrabold text-[#071644] tracking-tight">Create Account</h2>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Activate your dossier and register your verification credentials.
          </p>
        </div>

        {/* Error Alert Box */}
        {errorMsg && (
          <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-2.5 text-xs font-semibold text-rose-600">
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ---------------------------------------------------------------------- */}
        {/* REGISTRATION FORM CONTAINER                                           */}
        {/* ---------------------------------------------------------------------- */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Role selector buttons */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Register As
            </label>
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-xl">
              <button
                type="button"
                onClick={() => setRole("Client")}
                className={`py-2 px-3 text-xs font-bold rounded-lg transition-all ${
                  role === "Client"
                    ? "bg-[#071644] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Client
              </button>
              <button
                type="button"
                onClick={() => setRole("Broker")}
                className={`py-2 px-3 text-xs font-bold rounded-lg transition-all ${
                  role === "Broker"
                    ? "bg-[#071644] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Broker
              </button>
            </div>
          </div>

          {/* 1. Full Name Field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Emma Wilson"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#163691] focus:bg-white transition-all font-medium"
              />
            </div>
          </div>

          {/* 2. ID Type & ID Number grid (Only rendered if Role is Broker) */}
          {role === "Broker" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn">
              
              {/* ID Type Select Dropdown */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  ID Type
                </label>
                <div className="relative">
                  <select
                    value={idType}
                    onChange={(e) => setIdType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#163691] focus:bg-white transition-all font-medium appearance-none cursor-pointer"
                  >
                    <option value="Driver License">Driver License</option>
                    <option value="Passport">Passport</option>
                    <option value="National ID Card">National ID Card</option>
                    <option value="Medicare Card">Medicare Card</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              {/* ID Number input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  License Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. DL-987654"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#163691] focus:bg-white transition-all font-medium"
                />
              </div>

            </div>
          )}

          {/* 3. Password & Confirm Password grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Password
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="password"
                  placeholder="******"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#163691] focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Confirm
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="password"
                  placeholder="******"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#163691] focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-[#071644] hover:bg-[#163691] active:bg-[#071644] disabled:opacity-50 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all pt-2.5 cursor-pointer"
          >
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <span>Submit Registration</span>
            )}
          </button>

        </form>

        {/* Footer Note */}
        <p className="text-[10px] text-slate-400 text-center font-bold">
          BAI Finance Identity Auditing & GDPR Safeguards
        </p>

      </div>
    </div>
  );
}
