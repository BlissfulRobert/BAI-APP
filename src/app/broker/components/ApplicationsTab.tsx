/**
 * ==============================================================================
 * COMPONENT: ApplicationsTab.tsx
 * Path: src/app/broker/components/ApplicationsTab.tsx
 * Description: Reworked Applications tab with sorting controls, status filters,
 *              row transitions, and a Top Right "Send Email" redirection button.
 * ==============================================================================
 */

import React, { useState } from "react";
import { Search, Eye, Mail, ArrowUpDown, Filter, X, Link } from "lucide-react";
import { Application, Client } from "./MockData";
import ClientApplicationDashboard from "./ClientApplicationDashboard";

interface ApplicationsTabProps {
  clients: Client[];
  applications: Application[];
  setApplications: React.Dispatch<React.SetStateAction<Application[]>>;
  onSendEmail: () => void;
  variant?: "broker" | "compliance";
  setClients?: React.Dispatch<React.SetStateAction<Client[]>>;
}

type SortCriteria = "none" | "name-asc" | "name-desc" | "amount-low" | "amount-high" | "progress-low" | "progress-high";

export default function ApplicationsTab({ clients, applications, setApplications, onSendEmail, variant, setClients }: ApplicationsTabProps) {
  // Theme variants configuration
  const isCompliance = variant === "compliance";

  // Invite Client state variables
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const openInviteModal = () => {
    setInviteCode(Math.random().toString(36).substring(2, 10));
    setInviteEmail("");
    setIsCopied(false);
    setIsInviteOpen(true);
  };

  const handleCopyLink = () => {
    const linkText = `https://baifinance.com/signup?code=cli-${inviteCode}`;
    navigator.clipboard.writeText(linkText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    alert(`Client invitation successfully sent to ${inviteEmail}!\nInvite Code: cli-${inviteCode}`);
    setIsInviteOpen(false);
  };

  // Edit Status & Progress states
  const [activeStatusEditId, setActiveStatusEditId] = useState<string | null>(null);
  const [activeProgressEditId, setActiveProgressEditId] = useState<string | null>(null);
  const [progressInputValue, setProgressInputValue] = useState<number>(0);

  const handleUpdateStatus = (appId: string, newStatus: Application["status"]) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status: newStatus } : app))
    );
    setActiveStatusEditId(null);
  };

  const handleUpdateProgress = (appId: string, newProgress: number) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, progress: newProgress } : app))
    );
    setActiveProgressEditId(null);
  };
  const primaryBg = isCompliance ? "bg-[#1429A9] hover:bg-[#10218A]" : "bg-[#0B2369] hover:bg-[#071644]";
  const primaryText = isCompliance ? "text-[#1429A9]" : "text-[#0B2369]";
  const primaryBorder = isCompliance ? "focus:border-[#1429A9]/30" : "focus:border-[#0B2369]/30";
  const barBg = isCompliance ? "bg-[#1429A9]" : "bg-[#0B2369]";
  const shadowBg = isCompliance ? "shadow-[#1429A9]/10" : "shadow-[#0B2369]/10";
  const hoverBg = isCompliance ? "hover:bg-[#1429A9]" : "hover:bg-[#0B2369]";
  // ------------------------------------------------------------------------------
  // STATE DEFINITIONS
  // ------------------------------------------------------------------------------
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  
  // Sorting and Filtering states
  const [sortOption, setSortOption] = useState<SortCriteria>("none");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // ------------------------------------------------------------------------------
  // FILTER & SORT APPLICATIONS DATA
  // ------------------------------------------------------------------------------
  const processedApps = applications
    .filter((app) => {
      // 1. Text Search matching
      const matchesSearch = 
        app.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.type.toLowerCase().includes(searchQuery.toLowerCase());
      
      // 2. Status matching (mapping 'Action needed' properly)
      const matchesStatus = 
        statusFilter === "All" || 
        app.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // 3. Sorting computations
      if (sortOption === "name-asc") {
        return a.clientName.localeCompare(b.clientName);
      }
      if (sortOption === "name-desc") {
        return b.clientName.localeCompare(a.clientName);
      }
      if (sortOption === "amount-low") {
        return a.amount - b.amount;
      }
      if (sortOption === "amount-high") {
        return b.amount - a.amount;
      }
      if (sortOption === "progress-low") {
        return a.progress - b.progress;
      }
      if (sortOption === "progress-high") {
        return b.progress - a.progress;
      }
      return 0; // Default none
    });

  // ------------------------------------------------------------------------------
  // INTERACTIVE TRANSITION: DETAILS REDIRECT
  // ------------------------------------------------------------------------------
  if (selectedApp) {
    const matchedClient = clients.find(c => c.id === selectedApp.clientId);
    if (matchedClient) {
      return (
        <ClientApplicationDashboard
          client={matchedClient}
          onBack={() => setSelectedApp(null)}
          variant={variant}
          onUpdateClient={(updatedClient) => {
            if (setClients) {
              setClients((prev) => prev.map((c) => (c.id === updatedClient.id ? updatedClient : c)));
            }
          }}
        />
      );
    }
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* ==================================================================== */}
      {/* SECTION 1: HEADER & TOP-RIGHT REDIRECT SEND EMAIL BUTTON             */}
      {/* ==================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800">Submitted Document Applications</h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Review dossier packages, check file progress, and progress applications to final approval.
          </p>
        </div>

        {/* Top-Right Action Buttons */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          {isCompliance && (
            <button
              onClick={openInviteModal}
              className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold text-white transition-all ${primaryBg} shadow-md ${shadowBg}`}
            >
              <Mail className="w-4 h-4" />
              <span>Invite Client</span>
            </button>
          )}

          <button
            onClick={onSendEmail}
            className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold text-white transition-all ${primaryBg} shadow-md ${shadowBg}`}
          >
            <Mail className="w-4 h-4" />
            <span>Send Email</span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* SECTION 2: SEARCH & DYNAMIC SORTING CONTROLS                        */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 p-4 bg-white border border-slate-200/60 rounded-3xl shadow-soft-xl">
        
        {/* Search Query */}
        <div className="md:col-span-5 relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by client name, ID, or loan type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none text-xs font-medium placeholder:text-slate-400 ${primaryBorder}`}
          />
        </div>

        {/* Sorting Category selector */}
        <div className="md:col-span-4 flex items-center gap-2">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortCriteria)}
            className={`w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none text-xs font-semibold text-slate-600 ${primaryBorder}`}
          >
            <option value="none">Sort Applications By...</option>
            <option value="name-asc">Alphabetical: A to Z</option>
            <option value="name-desc">Alphabetical: Z to A</option>
            <option value="amount-low">Amount: Low to High</option>
            <option value="amount-high">Amount: High to Low</option>
            <option value="progress-low">Progress: Low to High</option>
            <option value="progress-high">Progress: High to Low</option>
          </select>
        </div>

        {/* Status Filtering selector */}
        <div className="md:col-span-3 flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none text-xs font-semibold text-slate-600 ${primaryBorder}`}
          >
            <option value="All">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="In review">In Review</option>
            <option value="Action needed">Action Needed</option>
            <option value="Approved">Approved</option>
            <option value="Settled">Settled</option>
            <option value="Declined">Declined</option>
          </select>
        </div>

      </div>

      {/* ==================================================================== */}
      {/* SECTION 3: FULL WIDTH LIST TABLE                                    */}
      {/* ==================================================================== */}
      <div className="bg-white border border-slate-200/80 rounded-3xl shadow-soft-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-100 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                <th className="py-4 px-6">ID & Client</th>
                <th className="py-4 px-6">Type & Amount</th>
                <th className="py-4 px-6">Lobby Progress</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 text-xs">
              {processedApps.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 font-medium">
                    No applications matched sorting or filtering rules.
                  </td>
                </tr>
              ) : (
                processedApps.map((app) => (
                  <tr 
                    key={app.id} 
                    onClick={() => setSelectedApp(app)}
                    className="hover:bg-slate-50/40 cursor-pointer transition-colors"
                  >
                    {/* ID & Client */}
                    <td className="py-4 px-6 font-medium">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/40 inline-block mb-1">
                          {app.id}
                        </span>
                        <span className="text-slate-800 font-bold block">{app.clientName}</span>
                      </div>
                    </td>

                    {/* Type & Amount */}
                    <td className="py-4 px-6">
                      <div>
                        <span className="text-slate-600 block">{app.type}</span>
                        <span className={`font-extrabold block ${primaryText}`}>${app.amount.toLocaleString()}</span>
                      </div>
                    </td>

                    {/* Progress Bar */}
                    <td 
                      className="py-4 px-6 relative"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveProgressEditId(activeProgressEditId === app.id ? null : app.id);
                        setProgressInputValue(app.progress);
                        setActiveStatusEditId(null);
                      }}
                    >
                      <div className="space-y-1 cursor-pointer hover:ring-2 hover:ring-[#1429A9]/30 p-1 rounded-lg transition-all">
                        <div className="w-28 h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                          <div 
                            className={`h-full rounded-full ${barBg}`}
                            style={{ width: `${app.progress}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-400 font-bold block">{app.progress}% Dossier Uploaded</span>
                      </div>

                      {/* Progress Popover */}
                      {activeProgressEditId === app.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-20 cursor-default" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveProgressEditId(null);
                            }}
                          />
                          <div 
                            className="absolute left-6 top-14 bg-white border border-slate-200/80 rounded-2xl shadow-xl z-30 p-4 w-48 space-y-3.5 animate-scaleIn text-left"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                              Update Progress
                            </span>
                            
                            <div className="space-y-2">
                              <input 
                                type="range" 
                                min="0" 
                                max="100" 
                                value={progressInputValue} 
                                onChange={(e) => setProgressInputValue(parseInt(e.target.value))}
                                className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#1429A9]"
                              />
                              
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[10px] font-extrabold text-slate-500">{progressInputValue}%</span>
                                <div className="flex gap-1.5">
                                  <button
                                    onClick={() => setActiveProgressEditId(null)}
                                    className="px-2 py-1 border border-slate-200 rounded-lg text-[9px] font-bold text-slate-400 hover:bg-slate-50"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() => handleUpdateProgress(app.id, progressInputValue)}
                                    className={`px-2.5 py-1 text-white rounded-lg text-[9px] font-bold ${primaryBg} shadow-xs`}
                                  >
                                    Save
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </td>

                    {/* Status */}
                    <td 
                      className="py-4 px-6 relative"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveStatusEditId(activeStatusEditId === app.id ? null : app.id);
                        setActiveProgressEditId(null);
                      }}
                    >
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider cursor-pointer hover:ring-2 hover:ring-[#1429A9]/30 transition-all ${
                        app.status === "Action needed"
                          ? "bg-rose-50 text-rose-600 border border-rose-200"
                          : app.status === "In review"
                          ? "bg-blue-50 text-blue-600 border border-blue-200"
                          : app.status === "Approved"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                          : "bg-slate-50 text-slate-600 border border-slate-200"
                      }`}>
                        {app.status === "Action needed" ? "Action Required" : app.status}
                      </span>

                      {/* Dropdown Popover */}
                      {activeStatusEditId === app.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-20 cursor-default" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveStatusEditId(null);
                            }}
                          />
                          <div className="absolute right-6 top-12 bg-white border border-slate-200/80 rounded-2xl shadow-xl z-30 p-2.5 w-40 space-y-1 animate-scaleIn text-left">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block px-2 mb-1">
                              Select Status
                            </span>
                            {["Submitted", "In review", "Action needed", "Approved", "Settled", "Declined"].map((status) => (
                              <button
                                key={status}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdateStatus(app.id, status as Application["status"]);
                                }}
                                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                                  app.status === status
                                    ? `bg-slate-50 ${primaryText}`
                                    : "hover:bg-slate-50 text-slate-600"
                                }`}
                              >
                                {status === "Action needed" ? "Action Required" : status}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </td>

                    {/* View Action */}
                    <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedApp(app)}
                        className={`p-2 bg-slate-100 rounded-xl border border-slate-200/60 text-slate-500 transition-all ${hoverBg} hover:text-white`}
                        title="Review Dossier"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* SECTION 4: INVITE CLIENT POPUP MODAL WINDOW                          */}
      {/* ==================================================================== */}
      {isInviteOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/50 space-y-6 relative overflow-hidden animate-scaleIn">
            
            {/* Exit button on the top right */}
            <button 
              onClick={() => setIsInviteOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 border border-slate-200/50 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div>
              <span className={`text-[10px] font-extrabold ${primaryText} uppercase tracking-wider block`}>
                {isCompliance ? "Compliance Portal Utilities" : "Broker Portal Utilities"}
              </span>
              <h3 className="text-base font-extrabold text-slate-800 mt-0.5">
                Invite Client to Hub
              </h3>
            </div>

            {/* Link Box Section */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Shareable Registration Link
              </label>
              
              <div className="flex gap-2">
                <div className="flex-1 bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs font-semibold text-slate-600 truncate select-all flex items-center gap-1.5">
                  <Link className={`w-3.5 h-3.5 ${primaryText} shrink-0`} />
                  <span className="truncate">https://baifinance.com/signup?code=cli-{inviteCode}</span>
                </div>
                
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl border border-slate-200 transition-colors shrink-0"
                >
                  {isCopied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>

            {/* Email Input Option Form */}
            <form onSubmit={handleSendInvite} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Invite via Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="Enter client's email address (e.g. emma@example.com)"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className={`w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:outline-none ${primaryBorder} rounded-xl text-xs font-medium text-slate-700 placeholder:text-slate-400`}
                />
              </div>

              {/* Operations: Invite Client at Bottom Right, Cancel on Left */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 text-[10px] font-extrabold uppercase">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 transition-all"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className={`py-2.5 px-5 ${primaryBg} text-white rounded-xl shadow-md ${shadowBg} transition-all`}
                >
                  Invite Client
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}
