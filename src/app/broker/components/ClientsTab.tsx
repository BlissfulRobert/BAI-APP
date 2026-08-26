/**
 * ==============================================================================
 * COMPONENT: ClientsTab.tsx
 * Path: src/app/broker/components/ClientsTab.tsx
 * Description: Client list tab with search, sorting alphabetically,
 *              and filtering by document states.
 * ==============================================================================
 */

import React, { useState } from "react";
import { Search, ArrowUpDown, Filter, Mail, Phone, Calendar, UserCheck } from "lucide-react";
import { Client } from "./MockData";
import ClientProfileView from "./ClientProfileView";

interface ClientsTabProps {
  clients: Client[];
}

type SortOrder = "none" | "asc" | "desc";
type DocumentStateFilter = "All" | "Submitted" | "In review" | "Requested" | "Settled" | "Declined" | "Approved";

export default function ClientsTab({ clients }: ClientsTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("none");
  const [stateFilter, setStateFilter] = useState<DocumentStateFilter>("All");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Sort and filter clients
  const filteredClients = clients
    .filter((client) => {
      const matchesSearch =
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.phone.includes(searchQuery);
      
      const matchesFilter = stateFilter === "All" || client.documentState === stateFilter;
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a.name.localeCompare(b.name);
      } else if (sortOrder === "desc") {
        return b.name.localeCompare(a.name);
      }
      return 0; // standard sorting (no-op)
    });

  const toggleSort = () => {
    if (sortOrder === "none") setSortOrder("asc");
    else if (sortOrder === "asc") setSortOrder("desc");
    else setSortOrder("none");
  };

  // If a client has been clicked, display their detailed dashboard
  if (selectedClient) {
    return (
      <ClientProfileView 
        client={selectedClient} 
        onBack={() => setSelectedClient(null)} 
      />
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* ---------------------------------------------------------------------- */}
      {/* SECTION HEADER & DESCRIPTIONS                                          */}
      {/* ---------------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800">Assigned Clients</h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Manage your mortgage clients, review dossiers, and sort status.
          </p>
        </div>
        
        {/* Total Active Badge */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="flex items-center gap-2 bg-slate-100 border border-slate-200/50 px-3.5 py-1.5 rounded-xl">
            <UserCheck className="w-4 h-4 text-[#0B2369]" />
            <span className="text-xs font-bold text-slate-600">
              Total Active: <strong className="text-[#0B2369]">{filteredClients.length}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* SEARCH AND FILTER BAR                                                  */}
      {/* ---------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 p-4 bg-white border border-slate-200/60 rounded-3xl shadow-soft-xl">
        
        {/* Search Field */}
        <div className="md:col-span-5 relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by client name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#0B2369]/30 text-xs font-medium placeholder:text-slate-400"
          />
        </div>

        {/* State Filter Dropdown */}
        <div className="md:col-span-4 flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value as DocumentStateFilter)}
            className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#0B2369]/30 text-xs font-semibold text-slate-600"
          >
            <option value="All">All Document States</option>
            <option value="Submitted">Submitted</option>
            <option value="In review">In Review</option>
            <option value="Requested">Requested (Action Needed)</option>
            <option value="Settled">Settled</option>
            <option value="Declined">Declined</option>
            <option value="Approved">Approved</option>
          </select>
        </div>

        {/* Alphabetical Sort Button */}
        <button
          onClick={toggleSort}
          className={`md:col-span-3 py-2.5 px-4 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            sortOrder !== "none"
              ? "bg-[#0B2369] text-white border-[#0B2369]"
              : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
          }`}
        >
          <ArrowUpDown className="w-3.5 h-3.5" />
          <span>
            {sortOrder === "none"
              ? "Sort Alphabetically"
              : sortOrder === "asc"
              ? "Alphabetical (A - Z)"
              : "Alphabetical (Z - A)"}
          </span>
        </button>

      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* CLIENTS DATA LIST TABLE                                                */}
      {/* ---------------------------------------------------------------------- */}
      <div className="bg-white border border-slate-200/80 rounded-3xl shadow-soft-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-100 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                <th className="py-4 px-6">Client Info</th>
                <th className="py-4 px-6">Loan Details</th>
                <th className="py-4 px-6">Last Activity</th>
                <th className="py-4 px-6">Dossier State</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 text-xs font-medium">
                    No clients found matching search or filter parameters.
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => (
                  <tr 
                    key={client.id} 
                    onClick={() => setSelectedClient(client)}
                    className="hover:bg-slate-50/30 transition-colors group cursor-pointer"
                  >
                    {/* Client Info Column */}
                    <td className="py-4.5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#EBF2FF] text-[#0B2369] flex items-center justify-center font-bold text-xs">
                          {client.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-xs sm:text-sm font-bold text-slate-800 block">
                            {client.name}
                          </span>
                          <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {client.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {client.phone}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Loan Details Column */}
                    <td className="py-4.5 px-6">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-slate-700 block">
                          {client.applicationType}
                        </span>
                        <span className="text-xs font-extrabold text-[#0B2369] block">
                          ${client.amount.toLocaleString()}
                        </span>
                      </div>
                    </td>

                    {/* Last Activity Column */}
                    <td className="py-4.5 px-6">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{client.lastActivity}</span>
                      </div>
                    </td>

                    {/* Dossier State Column */}
                    <td className="py-4.5 px-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        client.documentState === "Approved" || client.documentState === "Settled"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                          : client.documentState === "Declined"
                          ? "bg-rose-50 text-rose-600 border border-rose-200"
                          : client.documentState === "In review"
                          ? "bg-blue-50 text-blue-600 border border-blue-200"
                          : client.documentState === "Requested"
                          ? "bg-amber-50 text-amber-600 border border-amber-200"
                          : "bg-slate-50 text-slate-600 border border-slate-200"
                      }`}>
                        {client.documentState === "Requested" ? "Action Needed" : client.documentState}
                      </span>
                    </td>

                    {/* Actions Column */}
                    <td className="py-4.5 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => setSelectedClient(client)}
                          className="py-1 px-3 bg-slate-100 text-slate-600 hover:bg-[#0B2369] hover:text-white rounded-lg text-[10px] font-bold border border-slate-200/50 transition-all"
                        >
                          Dossier Details
                        </button>
                      </div>
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
