 /**
     * ==============================================================================
     * COMPONENT: RegistrationForm.tsx
     * Path: src/app/auth/activate/components/RegistrationForm.tsx
     * Description: Invite-only registration form. Detects role automatically from
     *              the backend invitation token. Dynamically renders fields based
     *              on whether the invitee is a Client or Broker.
     * ==============================================================================
     */

    "use client";

    import React, { useState, useEffect } from "react";
    import { Lock, ShieldAlert, Award, ArrowRight, AlertTriangle } from "lucide-react";

    interface RegistrationFormProps {
      token: string;
      onSuccess: (fullName: string, role: string) => void;
    }

    type Role = "client" | "broker";

    interface TokenValidation {
      valid: boolean;
      email: string;
      role: Role;
      error?: string;
    }

    export default function RegistrationForm({ token, onSuccess }: RegistrationFormProps) {

      // ------------------------------------------------------------------------------
      // VALIDATION STATE (resolved from backend on mount)
      // ------------------------------------------------------------------------------
      const [isValidating, setIsValidating] = useState(true);
      const [tokenError, setTokenError] = useState<string | null>(null);
      const [email, setEmail] = useState("");
      const [role, setRole] = useState<Role | null>(null);

      // ------------------------------------------------------------------------------
      // FORM FIELDS STATE
      // ------------------------------------------------------------------------------
      const [firstName, setFirstName] = useState("");
      const [lastName, setLastName] = useState("");
      const [licenseNo, setLicenseNo] = useState(""); // broker only
      const [password, setPassword] = useState("");
      const [confirmPassword, setConfirmPassword] = useState("");
      const [errorMsg, setErrorMsg] = useState("");
      const [isSubmitting, setIsSubmitting] = useState(false);

      // ------------------------------------------------------------------------------
      // 1. DETECT ROLE ON MOUNT — Call validate endpoint with token
      // ------------------------------------------------------------------------------
      useEffect(() => {
        if (!token) {
          setTokenError("No activation token found in the URL.");
          setIsValidating(false);
          return;
        }

        async function validateToken() {
          try {
            const res = await fetch(
              `http://localhost:8000/api/auth/invitations/validate/?token=${encodeURIComponent(token)}`
            );
            const data: TokenValidation = await res.json();

            if (res.ok && data.valid) {
              setRole(data.role);   // "client" or "broker" — from backend, not user input
              setEmail(data.email);
            } else {
              setTokenError(data.error || "This invitation link is invalid or has expired.");
            }
          } catch {
            setTokenError("Could not reach the server. Please try again later.");
          } finally {
            setIsValidating(false);
          }
        }

        validateToken();
      }, [token]);

      // ------------------------------------------------------------------------------
      // 2. SUBMIT — POST to accept endpoint with role-appropriate payload
      // ------------------------------------------------------------------------------
      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");

        if (!firstName.trim() || !lastName.trim()) {
          setErrorMsg("First name and last name are required.");
          return;
        }

        if (role === "broker" && !licenseNo.trim()) {
          setErrorMsg("Broker License Number is required.");
          return;
        }

        if (!password.trim() || !confirmPassword.trim()) {
          setErrorMsg("Password fields are required.");
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
          // Build payload — license_no only sent for brokers
          const payload: Record<string, string> = {
            token,
            first_name: firstName,
            last_name: lastName,
            password,
            password_confirm: confirmPassword,
          };

          if (role === "broker") {
            payload.license_no = licenseNo;
          }

          const res = await fetch("http://localhost:8000/api/auth/invitations/accept/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          const data = await res.json();

          if (!res.ok) {
            // Surface Django validation errors clearly
            const backendError =
              data.license_no?.[0] ||
              data.token?.[0] ||
              data.password?.[0] ||
              data.first_name?.[0] ||
              data.last_name?.[0] ||
              data.non_field_errors?.[0] ||
              "Registration failed. Please try again.";
            throw new Error(backendError);
          }

          onSuccess(`${firstName} ${lastName}`, role ?? "user");

        } catch (err: unknown) {
          setErrorMsg(err.message || "Something went wrong.");
        } finally {
          setIsSubmitting(false);
        }
      };

      // ------------------------------------------------------------------------------
      // LOADING STATE — Waiting for token validation
      // ------------------------------------------------------------------------------
      if (isValidating) {
        return (
          <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="text-center space-y-4">
              <span className="w-8 h-8 border-4 border-slate-200 border-t-[#0048cc] rounded-full animate-spin inline-
  block" />
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Verifying invitation link...
              </p>
            </div>
          </div>
        );
      }

      // ------------------------------------------------------------------------------
      // INVALID TOKEN STATE — Token expired, revoked, or already accepted
      // ------------------------------------------------------------------------------
      if (tokenError || !role) {
        return (
          <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white border border-rose-100 shadow-xl rounded-[24px] p-8 max-w-md w-full text-center
  space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rose-50 border
  border-rose-100 mx-auto">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
              </div>
              <h2 className="text-lg font-extrabold text-slate-800">Invalid Activation Link</h2>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                {tokenError}
              </p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Contact BAI Finance support if you believe this is an error.
              </p>
            </div>
          </div>
        );
      }

      // ------------------------------------------------------------------------------
      // FORM — Rendered only after role is confirmed from backend
      // ------------------------------------------------------------------------------
      const isBroker = role === "broker";

      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-800">
          <div className="bg-white border border-slate-200 shadow-xl rounded-[24px] p-8 max-w-md w-full space-y-6
  animate-scaleIn">

            {/* Header */}
            <div className="text-center space-y-2">
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-
  extrabold uppercase tracking-wider ${
                isBroker
                  ? "bg-sky-50 text-sky-700 border-sky-200"
                  : "bg-blue-50 text-[#0048cc] border-blue-200"
              }`}>
                <Award className="w-3.5 h-3.5" />
                <span>{isBroker ? "Broker Portal" : "Client Portal"} Activation</span>
              </div>

              <h2 className="text-2xl font-extrabold text-[#0a2881] tracking-tight">
                Create Account
              </h2>

              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Invited as{" "}
                <span className={`font-bold ${isBroker ? "text-sky-600" : "text-[#0048cc]"}`}>
                  {email}
                </span>
              </p>
            </div>

            {/* Error Alert */}
            {errorMsg && (
              <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-2.5 text-xs
  font-semibold text-rose-600">
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* First Name & Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="Emma"
                    value={firstName}
                    required
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-
  800 focus:outline-none focus:border-[#0048cc] focus:bg-white transition-all font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Wilson"
                    value={lastName}
                    required
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-
  800 focus:outline-none focus:border-[#0048cc] focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>

              {/* Broker-only: License Number */}
              {isBroker && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-sky-600 uppercase tracking-wider block">
                    Broker License Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. LIC-882739"
                    value={licenseNo}
                    required
                    onChange={(e) => setLicenseNo(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-sky-200 rounded-xl px-4 py-2.5 text-xs text-slate-
  800 focus:outline-none focus:border-sky-500 focus:bg-white transition-all font-semibold"
                  />
                </div>
              )}

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="password"
                      placeholder="••••••"
                      value={password}
                      required
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-
  slate-800 focus:outline-none focus:border-[#0048cc] focus:bg-white transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Confirm
                  </label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="password"
                      placeholder="••••••"
                      value={confirmPassword}
                      required
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-
  slate-800 focus:outline-none focus:border-[#0048cc] focus:bg-white transition-all font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-4 text-white font-extrabold text-xs rounded-xl flex items-center justify-
  center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50 ${
                  isBroker
                    ? "bg-sky-600 hover:bg-sky-700 active:bg-sky-900"
                    : "bg-[#0048cc] hover:bg-[#0a2881] active:bg-[#071644]"
                }`}
              >
                {isSubmitting ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Complete Activation</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

            </form>

            {/* Footer */}
            <p className="text-[9px] text-slate-400 text-center font-bold uppercase tracking-wider">
              BAI Finance · Identity Auditing & GDPR Safeguarded
            </p>

          </div>
        </div>
      );
    }