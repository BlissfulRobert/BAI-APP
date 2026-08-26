/**
 * ==============================================================================
 * COMPONENT: ProfileTab.tsx
 * Path: src/app/client/components/ProfileTab.tsx
 * Description: Client Profile dashboard featuring Welcome banner, tabbed dossier
 *              folders with a stacked "All View" category, document uploader
 *              popup modal, application vertical stepper, and meeting reminder.
 * ==============================================================================
 */

import React, { useState } from "react";
import { User, ShieldCheck, Landmark, Check, FileText, X, AlertCircle, Calendar, UploadCloud, Trash2, ArrowRight } from "lucide-react";
import { Client, Booking } from "../../broker/MockData";

interface ProfileTabProps {
  client: Client;
  setClient: React.Dispatch<React.SetStateAction<Client>>;
  onLogAction: (actionText: string) => void;
}

type DossierCategory = "Personal" | "Financial" | "Employment" | "Collateral" | "Liabilities" | "All";

export default function ProfileTab({ client, setClient, onLogAction }: ProfileTabProps) {
  // ------------------------------------------------------------------------------
  // STATE DEFINITIONS
  // ------------------------------------------------------------------------------
  const [activeDossierTab, setActiveDossierTab] = useState<DossierCategory>("All");
  
  // Profile Edit State Managers
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editPhone, setEditPhone] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editDob, setEditDob] = useState("");
  const [editCivilStatus, setEditCivilStatus] = useState<"Single" | "Married" | "De Facto" | "Divorced" | "Widowed">("Single");
  const [editEmployer, setEditEmployer] = useState("");
  const [editPosition, setEditPosition] = useState("");
  const [editAddress, setEditAddress] = useState("");

  const openEditModal = () => {
    setEditPhone(client.phone);
    setEditEmail(client.email);
    setEditDob(client.profile.dob);
    setEditCivilStatus(client.profile.civilStatus);
    setEditEmployer(client.employment.employerBusiness);
    setEditPosition(client.employment.position);
    setEditAddress(client.loan.purpose);
    setIsEditOpen(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setClient(prev => ({
      ...prev,
      phone: editPhone,
      email: editEmail,
      profile: {
        ...prev.profile,
        dob: editDob,
        civilStatus: editCivilStatus
      },
      employment: {
        ...prev.employment,
        employerBusiness: editEmployer,
        position: editPosition
      },
      loan: {
        ...prev.loan,
        purpose: editAddress
      }
    }));
    onLogAction("Updated client profile details successfully.");
    setIsEditOpen(false);
  };

  const [uploadDocName, setUploadDocName] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const docs = client.documents;

  // Helpers to parse document status keys
  const getDocStatus = (docName: string) => {
    switch (docName) {
      case "Government ID": return docs.governmentId;
      case "Proof of Income": return docs.proofOfIncome;
      case "Bank Statement": return docs.bankStatement;
      case "Tax Documents": return docs.taxDocuments;
      case "Employment Documents": return docs.employmentDocs;
      case "Business Documents": return docs.businessDocs;
      case "Collateral Documents": return docs.collateralDocs;
      case "Other Documents": return docs.otherDocs;
      default: return "Not Uploaded";
    }
  };

  // Helper currency formatter
  const formatCurrency = (val: number) => {
    return `A$ ${val.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  // ------------------------------------------------------------------------------
  // POPUP MODAL HANDLERS (Upload & Delete Triggers)
  // ------------------------------------------------------------------------------
  const openUploadModal = (docName: string) => {
    setUploadDocName(docName);
    const status = getDocStatus(docName);
    if (status === "Verified" || status === "Uploaded" || status === "Pending") {
      setSelectedFileName(`${docName.toLowerCase().replace(/\s+/g, "_")}_scanned.pdf`);
    } else {
      setSelectedFileName(null);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFileName(e.dataTransfer.files[0].name);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFileName(e.target.files[0].name);
    }
  };

  const executeUpload = () => {
    if (!uploadDocName) return;
    const docKeyMap: Record<string, keyof typeof client.documents> = {
      "Government ID": "governmentId",
      "Proof of Income": "proofOfIncome",
      "Bank Statement": "bankStatement",
      "Tax Documents": "taxDocuments",
      "Employment Documents": "employmentDocs",
      "Business Documents": "businessDocs",
      "Collateral Documents": "collateralDocs",
      "Other Documents": "otherDocs"
    };

    const key = docKeyMap[uploadDocName];
    if (key) {
      setClient(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          [key]: "Uploaded"
        }
      }));
      onLogAction(`Uploaded new document: ${uploadDocName} (${selectedFileName || "file_attached.pdf"})`);
    }
    setUploadDocName(null);
    setSelectedFileName(null);
  };

  const executeDelete = () => {
    if (!uploadDocName) return;
    const docKeyMap: Record<string, keyof typeof client.documents> = {
      "Government ID": "governmentId",
      "Proof of Income": "proofOfIncome",
      "Bank Statement": "bankStatement",
      "Tax Documents": "taxDocuments",
      "Employment Documents": "employmentDocs",
      "Business Documents": "businessDocs",
      "Collateral Documents": "collateralDocs",
      "Other Documents": "otherDocs"
    };

    const key = docKeyMap[uploadDocName];
    if (key) {
      setClient(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          [key]: "Not Uploaded"
        }
      }));
      onLogAction(`Deleted document: ${uploadDocName}`);
    }
    setUploadDocName(null);
    setSelectedFileName(null);
  };

  // ------------------------------------------------------------------------------
  // DOSSIER CARDS RENDER HELPERS
  // ------------------------------------------------------------------------------
  const renderPersonalCard = () => (
    <div className="bg-slate-50 border border-slate-200/60 p-5 rounded-2xl space-y-4 animate-fadeIn">
      <h4 className="font-extrabold text-[#0024A8] text-xs uppercase tracking-wider">Personal details</h4>
      <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
        <div>
          <span className="text-slate-400 block mb-0.5">Date of Birth</span>
          <span className="text-slate-800">{client.profile.dob}</span>
        </div>
        <div>
          <span className="text-slate-400 block mb-0.5">Civil Status</span>
          <span className="text-slate-800">{client.profile.civilStatus}</span>
        </div>
        <div>
          <span className="text-slate-400 block mb-0.5">Phone Number</span>
          <span className="text-slate-800">{client.phone}</span>
        </div>
        <div>
          <span className="text-slate-400 block mb-0.5">Email Address</span>
          <span className="text-slate-800 truncate block">{client.email}</span>
        </div>
      </div>
    </div>
  );

  const renderFinancialCard = () => (
    <div className="bg-slate-50 border border-slate-200/60 p-5 rounded-2xl space-y-4 animate-fadeIn">
      <h4 className="font-extrabold text-[#0024A8] text-xs uppercase tracking-wider">Financial Status</h4>
      <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
        <div>
          <span className="text-slate-400 block mb-0.5">Annual income</span>
          <span className="text-slate-800">{formatCurrency(120000)}</span>
        </div>
        <div>
          <span className="text-slate-400 block mb-0.5">Monthly commitments</span>
          <span className="text-slate-800">{formatCurrency(3000)}</span>
        </div>
        <div className="col-span-2">
          <span className="text-slate-400 block mb-0.5">Est. Asset Portfolio</span>
          <span className="text-slate-800">{formatCurrency(980000)}</span>
        </div>
      </div>
    </div>
  );

  const renderEmploymentCard = () => (
    <div className="bg-slate-50 border border-slate-200/60 p-5 rounded-2xl space-y-4 animate-fadeIn">
      <h4 className="font-extrabold text-[#0024A8] text-xs uppercase tracking-wider">Employment Details</h4>
      <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
        <div>
          <span className="text-slate-400 block mb-0.5">Current Employer</span>
          <span className="text-slate-800">{client.employment.employerBusiness}</span>
        </div>
        <div>
          <span className="text-slate-400 block mb-0.5">Employment Status</span>
          <span className="text-slate-800">Full-Time Permanent</span>
        </div>
        <div className="col-span-2">
          <span className="text-slate-400 block mb-0.5">Position / Title</span>
          <span className="text-slate-800">Senior Project Administrator</span>
        </div>
      </div>
    </div>
  );

  const renderCollateralCard = () => (
    <div className="bg-slate-50 border border-slate-200/60 p-5 rounded-2xl space-y-4 animate-fadeIn">
      <h4 className="font-extrabold text-[#0024A8] text-xs uppercase tracking-wider">Security & Collateral</h4>
      <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
        <div>
          <span className="text-slate-400 block mb-0.5">Property Type</span>
          <span className="text-slate-800">Residential House</span>
        </div>
        <div>
          <span className="text-slate-400 block mb-0.5">Estimated Value</span>
          <span className="text-slate-800">{formatCurrency(client.collateral.estimatedValue)}</span>
        </div>
        <div className="col-span-2">
          <span className="text-slate-400 block mb-0.5">Security Property Address</span>
          <span className="text-slate-800 truncate block">{client.loan.purpose}</span>
        </div>
      </div>
    </div>
  );

  const renderLiabilitiesCard = () => (
    <div className="bg-slate-50 border border-slate-200/60 p-5 rounded-2xl space-y-4 animate-fadeIn">
      <h4 className="font-extrabold text-[#0024A8] text-xs uppercase tracking-wider">Liabilities & Liabilities</h4>
      <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
        <div>
          <span className="text-slate-400 block mb-0.5 font-bold">Credit Card Limit</span>
          <span className="text-slate-800">{formatCurrency(15000)}</span>
        </div>
        <div>
          <span className="text-slate-400 block mb-0.5 font-bold">Car Loans outstanding</span>
          <span className="text-slate-800">{formatCurrency(22000)}</span>
        </div>
      </div>
    </div>
  );

  const renderActiveDossierContent = () => {
    switch (activeDossierTab) {
      case "Personal": return renderPersonalCard();
      case "Financial": return renderFinancialCard();
      case "Employment": return renderEmploymentCard();
      case "Collateral": return renderCollateralCard();
      case "Liabilities": return renderLiabilitiesCard();
      case "All":
        return (
          <div className="space-y-4.5">
            {renderPersonalCard()}
            {renderFinancialCard()}
            {renderEmploymentCard()}
            {renderCollateralCard()}
            {renderLiabilitiesCard()}
          </div>
        );
      default: return renderPersonalCard();
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* ==================================================================== */}
      {/* 1. WELCOME CONTAINER & PROFILE PICTURE (TOP CONTAINER)               */}
      {/* ==================================================================== */}
      <div className="bg-[#0024A8] text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md shadow-[#0024A8]/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Profile Avatar bubble */}
          <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center text-white font-black text-3xl shrink-0 border border-white/20 shadow-inner">
            {client.name.split(" ").map(w => w[0]).join("")}
          </div>
          
          <div className="text-center sm:text-left space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Welcome! {client.name}
            </h2>
            <p className="text-xs text-sky-100/70 font-semibold tracking-wide flex items-center justify-center sm:justify-start gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Secure Client Dashboard Workspace</span>
            </p>
          </div>
        </div>

        {/* Edit Profile Button on the top right of the Welcome Container */}
        <button
          onClick={openEditModal}
          className="self-start sm:self-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/10 text-xs font-bold rounded-xl transition-all relative z-10 shrink-0 shadow-2xs"
        >
          Edit Profile
        </button>
      </div>

      {/* ==================================================================== */}
      {/* 2. SPLIT LAYOUT PANEL                                                */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: PERSONAL INFO DOSSIER & DOCUMENT SUBMISSIONS          */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Dossier Folders Container */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-soft-xl space-y-6">
            <div className="border-b border-slate-100 pb-3.5 flex flex-wrap gap-1.5">
              {(["All", "Personal", "Financial", "Employment", "Collateral", "Liabilities"] as DossierCategory[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveDossierTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-colors ${
                    activeDossierTab === tab
                      ? "bg-[#0024A8] text-white"
                      : "bg-slate-50 text-slate-400 hover:text-slate-700 border border-slate-200/40"
                  }`}
                >
                  {tab === "All" ? "All View" : tab}
                </button>
              ))}
            </div>

            {renderActiveDossierContent()}
          </div>

        </div>

        {/* RIGHT COLUMN: PROGRESS, AGENDA, & NOTIFICATIONS FEED                */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Progress Container (Timeline checklist) */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-soft-xl space-y-6">
            <h3 className="text-base font-extrabold text-slate-800">
              Loan Status Checklist
            </h3>

            {/* Stepper progress stages */}
            <div className="space-y-6 relative pl-3.5 before:absolute before:left-7.5 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-100">
              
              {/* Step 1: Submitted */}
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-8 h-8 rounded-full bg-[#0024A8] text-white flex items-center justify-center font-bold text-sm shrink-0 border-2 border-white shadow-soft-xl">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <span className="text-sm font-bold text-slate-700">Submitted</span>
              </div>

              {/* Step 2: In Review */}
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-8 h-8 rounded-full bg-[#0024A8] text-white flex items-center justify-center font-bold text-sm shrink-0 border-2 border-white shadow-soft-xl">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <span className="text-sm font-bold text-slate-700">In Review</span>
              </div>

              {/* Step 3: Additional Info Requested */}
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-8 h-8 rounded-full bg-[#EA580C] text-white flex items-center justify-center font-bold text-sm shrink-0 border-2 border-white shadow-soft-xl animate-pulse">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-800">Additional Info Requested</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 text-[10px] font-extrabold uppercase border border-rose-200 tracking-wider">
                    Action needed
                  </span>
                </div>
              </div>

              {/* Step 4: Approved */}
              <div className="flex items-center gap-4 relative z-10 opacity-50">
                <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 text-slate-400 flex items-center justify-center font-extrabold text-xs shrink-0">
                  4
                </div>
                <span className="text-sm font-semibold text-slate-400">Approved</span>
              </div>

              {/* Step 5: Declined */}
              <div className="flex items-center gap-4 relative z-10 opacity-50">
                <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 text-slate-400 flex items-center justify-center font-extrabold text-xs shrink-0">
                  5
                </div>
                <span className="text-sm font-semibold text-slate-400">Declined</span>
              </div>

              {/* Step 6: Settled */}
              <div className="flex items-center gap-4 relative z-10 opacity-50">
                <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 text-slate-400 flex items-center justify-center font-extrabold text-xs shrink-0">
                  6
                </div>
                <span className="text-sm font-semibold text-slate-400">Settled</span>
              </div>

            </div>
          </div>

          {/* Dossier Document Checklist */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-soft-xl space-y-4">
            <h3 className="text-base font-extrabold text-slate-800 pb-2 border-b border-slate-100">
              Dossier Document Checklist
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                    <th className="py-2.5 px-3">File Name</th>
                    <th className="py-2.5 px-3 text-right">Status State</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700 text-xs font-semibold">
                  {[
                    { name: "Government ID", status: docs.governmentId },
                    { name: "Proof of Income", status: docs.proofOfIncome },
                    { name: "Bank Statement", status: docs.bankStatement },
                    { name: "Tax Documents", status: docs.taxDocuments },
                    { name: "Employment Documents", status: docs.employmentDocs },
                    ...(docs.businessDocs !== "Not Required" ? [{ name: "Business Documents", status: docs.businessDocs }] : []),
                    ...(docs.collateralDocs !== "Not Required" ? [{ name: "Collateral Documents", status: docs.collateralDocs }] : []),
                    ...(docs.otherDocs !== "Not Required" ? [{ name: "Other Documents", status: docs.otherDocs }] : []),
                  ].map((doc, idx) => (
                    <tr 
                      key={idx} 
                      onClick={() => openUploadModal(doc.name)}
                      className="border-b border-slate-50 hover:bg-slate-50/50 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-3 text-[#0024A8] font-bold">{doc.name}</td>
                      <td className="py-3 px-3 text-right">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
                          doc.status === "Verified"
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                            : doc.status === "Uploaded"
                            ? "bg-blue-50 text-blue-600 border border-blue-100"
                            : doc.status === "Pending"
                            ? "bg-amber-50 text-amber-600 border border-amber-100"
                            : "bg-rose-50 text-rose-600 border border-rose-100"
                        }`}>
                          {doc.status === "Not Uploaded" ? "Action Needed" : doc.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>

      {/* ==================================================================== */}
      {/* 3. DYNAMIC UPLOAD MODAL POPUP WINDOW                                 */}
      {/* ==================================================================== */}
      {uploadDocName && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/50 space-y-6 animate-scaleIn">
            
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Document Uploader</span>
                <h3 className="text-base font-extrabold text-[#0024A8]">{uploadDocName}</h3>
              </div>
              <button 
                onClick={() => { setUploadDocName(null); setSelectedFileName(null); }}
                className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors border border-slate-200/50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drag & Drop zone */}
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                dragActive 
                  ? "border-[#0024A8] bg-[#0024A8]/5" 
                  : "border-slate-200 hover:border-[#0024A8]/60 bg-slate-50/50"
              }`}
            >
              <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <p className="text-xs text-slate-600 font-bold mb-1">
                Drag & drop your file here
              </p>
              <p className="text-[10px] text-slate-400 font-medium mb-3">
                Supports PDF, JPEG, or PNG up to 10MB
              </p>
              
              <label className="inline-block px-4 py-2 bg-white hover:bg-slate-50 text-[#0024A8] border border-slate-200 text-[10px] font-bold rounded-xl shadow-2xs cursor-pointer transition-colors">
                Browse Files
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={handleFileSelect}
                  accept=".pdf,.png,.jpg,.jpeg"
                />
              </label>
            </div>

            {/* Selected File Details */}
            {selectedFileName && (
              <div className="flex items-center justify-between gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200/60 font-semibold">
                <div className="flex items-center gap-2 truncate">
                  <FileText className="w-4 h-4 text-[#0024A8] shrink-0" />
                  <span className="text-slate-700 truncate">{selectedFileName}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-bold shrink-0">Scanned PDF</span>
              </div>
            )}

            {/* Actions panel */}
            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 text-[10px] font-extrabold uppercase">
              
              {/* Delete trigger (Only visible if file exists) */}
              {(getDocStatus(uploadDocName) !== "Not Uploaded") && (
                <button
                  onClick={executeDelete}
                  className="mr-auto py-2.5 px-4 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              )}

              <button
                onClick={() => { setUploadDocName(null); setSelectedFileName(null); }}
                className="py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 transition-all"
              >
                Cancel
              </button>

              <button
                onClick={executeUpload}
                disabled={!selectedFileName}
                className={`py-2.5 px-4 rounded-xl text-white shadow-md shadow-[#0024A8]/10 transition-all ${
                  selectedFileName ? "bg-[#0024A8] hover:bg-[#001D85]" : "bg-slate-300 cursor-not-allowed"
                }`}
              >
                Upload File
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 4. EDIT PROFILE POPUP MODAL WINDOW                                   */}
      {/* ==================================================================== */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/50 space-y-6 relative overflow-hidden animate-scaleIn">
            
            {/* Exit button on the top right */}
            <button 
              onClick={() => setIsEditOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 border border-slate-200/50 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div>
              <span className="text-[10px] font-extrabold text-[#0024A8] uppercase tracking-wider block">
                Account Settings
              </span>
              <h3 className="text-base font-extrabold text-slate-800 mt-0.5">
                Edit Profile Information
              </h3>
            </div>

            {/* Form fields */}
            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs font-semibold">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 
                 <div className="space-y-1.5">
                   <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                     Phone Number
                   </label>
                   <input
                     type="text"
                     required
                     value={editPhone}
                     onChange={(e) => setEditPhone(e.target.value)}
                     className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#0024A8]/30 rounded-xl text-slate-700 font-medium"
                   />
                 </div>

                 <div className="space-y-1.5">
                   <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                     Email Address
                   </label>
                   <input
                     type="email"
                     required
                     value={editEmail}
                     onChange={(e) => setEditEmail(e.target.value)}
                     className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#0024A8]/30 rounded-xl text-slate-700 font-medium"
                   />
                 </div>

                 <div className="space-y-1.5">
                   <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                     Date of Birth
                   </label>
                   <input
                     type="text"
                     required
                     value={editDob}
                     onChange={(e) => setEditDob(e.target.value)}
                     className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#0024A8]/30 rounded-xl text-slate-700 font-medium"
                   />
                 </div>

                 <div className="space-y-1.5">
                   <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                     Civil Status
                   </label>
                   <select
                     value={editCivilStatus}
                     onChange={(e) => setEditCivilStatus(e.target.value as any)}
                     className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#0024A8]/30 rounded-xl text-slate-600 font-semibold"
                   >
                     <option value="Single">Single</option>
                     <option value="Married">Married</option>
                     <option value="De Facto">De Facto</option>
                     <option value="Divorced">Divorced</option>
                     <option value="Widowed">Widowed</option>
                   </select>
                 </div>

                 <div className="space-y-1.5">
                   <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                     Current Employer
                   </label>
                   <input
                     type="text"
                     required
                     value={editEmployer}
                     onChange={(e) => setEditEmployer(e.target.value)}
                     className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#0024A8]/30 rounded-xl text-slate-700 font-medium"
                   />
                 </div>

                 <div className="space-y-1.5">
                   <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                     Position / Title
                   </label>
                   <input
                     type="text"
                     required
                     value={editPosition}
                     onChange={(e) => setEditPosition(e.target.value)}
                     className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#0024A8]/30 rounded-xl text-slate-700 font-medium"
                   />
                 </div>

                 <div className="col-span-2 space-y-1.5">
                   <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                     Security Property Address
                   </label>
                   <input
                     type="text"
                     required
                     value={editAddress}
                     onChange={(e) => setEditAddress(e.target.value)}
                     className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#0024A8]/30 rounded-xl text-slate-700 font-medium"
                   />
                 </div>

               </div>

               {/* Bottom CTA Actions */}
               <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 text-[10px] font-extrabold uppercase">
                 <button
                   type="button"
                   onClick={() => setIsEditOpen(false)}
                   className="py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 transition-all"
                 >
                   Cancel
                 </button>

                 <button
                   type="submit"
                   className="py-2.5 px-5 bg-[#0024A8] hover:bg-[#001D85] text-white rounded-xl shadow-md shadow-[#0024A8]/10 transition-all"
                 >
                   Save Changes
                 </button>
               </div>
             </form>

           </div>
         </div>
       )}

    </div>
  );
}
