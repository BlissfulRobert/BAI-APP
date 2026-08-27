/**
 * ==============================================================================
 * MAIN ROUTE PAGE: /login
 * Path: src/app/login/page.tsx
 * Description: Dedicated Client Hub Login page — wired to Django backend.
 * ==============================================================================
 */

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  Lock,
  Mail,
  ArrowLeft,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";

export default function ClientLoginPage() {
  const router = useRouter();

  // ------------------------------------------------------------------------------
  // FORM STATES
  // ------------------------------------------------------------------------------
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ------------------------------------------------------------------------------
  // SUBMIT HANDLER — Calls Django login endpoint
  // ------------------------------------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Required: tells browser to save the HttpOnly JWT cookies
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Django returns non_field_errors for invalid credentials
        const backendError =
          data.non_field_errors?.[0] ||
          data.detail ||
          "Invalid email or password.";
        throw new Error(backendError);
      }

      // Role-based redirect using the user data returned from Django
      const role = data.user?.role.toLowerCase();

      document.cookie = `user-role=${role}; path=/; SameSite=Lax`;

      if (role === "client") router.push("/client");
      else if (role === "broker") router.push("/broker");
      else if (role === "compliance") router.push("/compliance");
      else router.push("/"); // fallback
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans
  selection:bg-blue-600 selection:text-white antialiased"
    >
      {/* Background radial overlays */}
      <div
        className="fixed -top-40 -right-40 w-96 h-96 bg-[#0024A8]/10 rounded-full blur-3xl pointer-events-
  none"
      />
      <div
        className="fixed -bottom-40 -left-40 w-96 h-96 bg-[#0B2369]/10 rounded-full blur-3xl pointer-events-
  none"
      />

      {/* MAIN LOGIN CARD */}
      <div
        className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/50
  space-y-6 relative overflow-hidden animate-scaleIn"
      >
        {/* Card Header */}
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-
  slate-400 hover:text-[#0024A8] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>

          <div className="flex items-center gap-2.5">
            <div
              className="w-10 h-10 rounded-xl bg-[#0024A8] text-white flex items-center justify-center shadow-
  md"
            >
              <Building2 className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-[#0024A8] block leading-none">
                BAI FINANCE
              </span>
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mt-1">
                Client Hub Gateway
              </span>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div
            className="p-3.5 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-2.5 text-xs
  font-semibold text-rose-600"
          >
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 text-xs font-semibold"
        >
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                placeholder="Enter your registered email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:outline-none
  focus:border-[#0024A8]/30 rounded-xl text-slate-700 font-medium block"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                placeholder="Enter your secure password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:outline-none
  focus:border-[#0024A8]/30 rounded-xl text-slate-700 font-medium block"
              />
            </div>
          </div>

          {/* Registration Notice */}
          <div className="bg-slate-50 border border-slate-200/50 p-4 rounded-2xl space-y-1 text-slate-600">
            <span
              className="text-[10px] font-extrabold text-[#0024A8] uppercase tracking-wider flex items-center
  gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Registration Instructions</span>
            </span>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
              New to BAI Finance? Please contact your designated Mortgage Broker
              to request an invitation link. Client accounts are created on
              invitation only.
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#0024A8] hover:bg-[#001D85] disabled:opacity-50 text-white rounded-xl
  text-xs font-bold shadow-md shadow-[#0024A8]/10 transition-all uppercase tracking-wider mt-2 flex items-center
  justify-center gap-2"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Log In to Hub"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
