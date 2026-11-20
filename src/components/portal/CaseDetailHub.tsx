"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Scale,
  Briefcase,
  FileText,
  Receipt,
  User,
  Calendar,
  Landmark,
  ShieldCheck,
  Download,
  Upload,
  Plus,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Clock,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  FileCheck,
  Eye,
  X,
  CreditCard,
  Printer,
} from "lucide-react";

interface Props {
  initialCase: any;
  initialTab: string;
  isAdmin: boolean;
  isClient: boolean;
  currentUserRole: string;
}

export function CaseDetailHub({
  initialCase,
  initialTab,
  isAdmin,
  isClient,
  currentUserRole,
}: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(initialTab || "details");
  const [caseData, setCaseData] = useState(initialCase);

  // Status & Notes Editing State
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesText, setNotesText] = useState(caseData.internalNotes || "");
  const [savingNotes, setSavingNotes] = useState(false);

  // Upload Document State
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadCategory, setUploadCategory] = useState("PETITION");
  const [uploadTitle, setUploadTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState("");

  // Invoice Creation State
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [creatingInvoice, setCreatingInvoice] = useState(false);
  const [invoiceItems, setInvoiceItems] = useState([
    { description: "Professional Appearance & Trial Advocacy", quantity: 1, unitPrice: 25000 },
  ]);
  const [invoiceDueDate, setInvoiceDueDate] = useState("");

  // Payment Recording State
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [activeInvoiceForPayment, setActiveInvoiceForPayment] = useState<any>(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("NEFT/RTGS");
  const [transactionRef, setTransactionRef] = useState("");
  const [recordingPayment, setRecordingPayment] = useState(false);

  // Invoice Receipt View Modal
  const [selectedInvoiceForReceipt, setSelectedInvoiceForReceipt] = useState<any>(null);

  // PDF Preview Modal
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);

  // Handle Save Internal Notes
  const handleSaveNotes = async () => {
    setSavingNotes(true);
    try {
      const res = await fetch(`/api/cases/${caseData.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ internalNotes: notesText }),
      });
      if (res.ok) {
        setCaseData({ ...caseData, internalNotes: notesText });
        setEditingNotes(false);
      }
    } catch (err) {
      console.error("Save notes error:", err);
    } finally {
      setSavingNotes(false);
    }
  };

  // Handle Document Upload
  const handleDocumentUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    setUploadSuccess("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("caseId", caseData.id);
      formData.append("category", uploadCategory);
      if (uploadTitle) formData.append("title", uploadTitle);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to upload document.");

      setUploadSuccess(`Document verified and sealed under ${data.document.verificationId}`);
      setCaseData({
        ...caseData,
        documents: [data.document, ...caseData.documents],
      });
      setSelectedFile(null);
      setUploadTitle("");
      setTimeout(() => {
        setUploadModalOpen(false);
        setUploadSuccess("");
      }, 1500);
    } catch (err: any) {
      alert(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // Handle Invoice Creation
  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingInvoice(true);

    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseId: caseData.id,
          clientId: caseData.clientId,
          dueDate: invoiceDueDate || undefined,
          items: invoiceItems,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create invoice");

      setCaseData({
        ...caseData,
        invoices: [data.invoice, ...caseData.invoices],
      });
      setInvoiceModalOpen(false);
    } catch (err: any) {
      alert(err.message || "Failed to create invoice");
    } finally {
      setCreatingInvoice(false);
    }
  };

  // Handle Payment Recording
  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeInvoiceForPayment) return;

    setRecordingPayment(true);
    try {
      const res = await fetch(`/api/invoices/${activeInvoiceForPayment.id}/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: paymentAmount,
          paymentMethod,
          transactionRef,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to record payment");

      // Update invoice in state
      const updatedInvoices = caseData.invoices.map((inv: any) =>
        inv.id === activeInvoiceForPayment.id ? data.invoice : inv
      );

      setCaseData({ ...caseData, invoices: updatedInvoices });
      setPaymentModalOpen(false);
      setPaymentAmount("");
      setTransactionRef("");
    } catch (err: any) {
      alert(err.message || "Failed to record payment");
    } finally {
      setRecordingPayment(false);
    }
  };

  // Billing Totals
  const totalBilled = caseData.invoices.reduce((acc: number, inv: any) => acc + (inv.totalAmount || 0), 0);
  const totalPaid = caseData.invoices.reduce((acc: number, inv: any) => acc + (inv.paidAmount || 0), 0);
  const totalDue = Math.max(0, totalBilled - totalPaid);

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Link href="/portal/cases" className="hover:text-[#0B1F3A] font-semibold">
            All Cases
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-mono font-bold text-[#0B1F3A]">
            {caseData.caseNumber}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/verify-document"
            className="px-3 py-1.5 rounded-lg bg-white border border-[#E5E0D5] hover:border-[#C9A24B] text-xs font-semibold text-[#0B1F3A] flex items-center gap-1.5 shadow-sm"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#C9A24B]" />
            <span>Public Seal Verifier</span>
          </Link>
        </div>
      </div>

      {/* Hero Header Card */}
      <div className="bg-[#0B1F3A] rounded-3xl p-6 sm:p-8 text-white border border-[#C9A24B]/30 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-sm font-bold text-[#DFB75E] bg-[#132B4F] px-2.5 py-1 rounded-lg border border-[#C9A24B]/30">
                {caseData.caseNumber}
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#C9A24B]/20 text-[#DFB75E]">
                {caseData.practiceArea.replace("_", " ")}
              </span>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  caseData.status === "ACTIVE"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : caseData.status === "COMPLETED"
                    ? "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                    : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                }`}
              >
                {caseData.status}
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-tight">
              {caseData.casingTitle}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-300 pt-1">
              <span className="flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5 text-[#C9A24B]" /> {caseData.courtName}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#C9A24B]" /> Client: {caseData.client.companyName || caseData.client.user?.name}
              </span>
            </div>
          </div>

          {/* Next Hearing Callout */}
          <div className="bg-[#132B4F] border border-[#C9A24B]/40 p-4 rounded-2xl shrink-0 text-center sm:text-right min-w-[200px]">
            <span className="text-[10px] text-gray-300 uppercase tracking-wider font-semibold block mb-0.5">
              Next Court Listing
            </span>
            {caseData.nextHearingDate ? (
              <>
                <p className="font-serif text-xl font-bold text-[#DFB75E]">
                  {new Date(caseData.nextHearingDate).toLocaleDateString("en-IN", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <p className="text-[11px] text-gray-300 font-medium mt-0.5">
                  Stage: {caseData.stage}
                </p>
              </>
            ) : (
              <p className="text-xs text-gray-400">Matter Concluded / Awaiting Board</p>
            )}
          </div>
        </div>
      </div>

      {/* 4 Interactive Core Tabs Nav */}
      <div className="bg-white rounded-2xl p-1.5 border border-[#E5E0D5] shadow-sm flex items-center gap-1 overflow-x-auto">
        {[
          { key: "details", label: "Case Details & Timeline", icon: <Briefcase className="w-4 h-4" /> },
          { key: "documents", label: `PDF Documents (${caseData.documents.length})`, icon: <FileText className="w-4 h-4" /> },
          { key: "billing", label: `Billing & Invoices (${caseData.invoices.length})`, icon: <Receipt className="w-4 h-4" /> },
          { key: "client", label: "Client Profile & KYC", icon: <User className="w-4 h-4" /> },
        ].map((t) => {
          const isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setActiveTab(t.key)}
              className={`flex-1 min-w-[150px] py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isActive
                  ? "bg-[#0B1F3A] text-[#DFB75E] shadow-sm font-bold"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: CASE DETAILS */}
      {activeTab === "details" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Metadata & Notes */}
            <div className="lg:col-span-8 space-y-6">
              {/* Core Attributes */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E5E0D5] shadow-sm space-y-4">
                <h3 className="font-serif text-base font-bold text-[#071526]">
                  Litigation File Specifications
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-[#F8F6F1] border border-[#E5E0D5]">
                    <span className="text-gray-500 font-semibold block mb-0.5">Forum / Court Name:</span>
                    <span className="font-bold text-[#071526]">{caseData.courtName}</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#F8F6F1] border border-[#E5E0D5]">
                    <span className="text-gray-500 font-semibold block mb-0.5">Jurisdiction:</span>
                    <span className="font-bold text-[#071526]">{caseData.jurisdiction}</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#F8F6F1] border border-[#E5E0D5]">
                    <span className="text-gray-500 font-semibold block mb-0.5">Presiding Judge:</span>
                    <span className="font-bold text-[#071526]">{caseData.judgeName || "Hon'ble Court Presiding Officer"}</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#F8F6F1] border border-[#E5E0D5]">
                    <span className="text-gray-500 font-semibold block mb-0.5">Date of Institution / Filing:</span>
                    <span className="font-bold text-[#071526]">
                      {new Date(caseData.filingDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#F8F6F1] border border-[#E5E0D5] text-xs">
                  <span className="text-gray-500 font-semibold block mb-1">Matter Summary / Plaint Scope:</span>
                  <p className="text-gray-800 leading-relaxed">{caseData.summary}</p>
                </div>
              </div>

              {/* Internal Chambers Notes */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E5E0D5] shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-base font-bold text-[#071526]">
                    Internal Chambers Strategy Notes
                  </h3>
                  {!isClient && (
                    <button
                      type="button"
                      onClick={() => setEditingNotes(!editingNotes)}
                      className="text-xs font-semibold text-[#0B1F3A] hover:text-[#C9A24B]"
                    >
                      {editingNotes ? "Cancel" : "Edit Notes"}
                    </button>
                  )}
                </div>

                {editingNotes ? (
                  <div className="space-y-3">
                    <textarea
                      rows={4}
                      value={notesText}
                      onChange={(e) => setNotesText(e.target.value)}
                      className="w-full p-3 text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#C9A24B] outline-none"
                    />
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleSaveNotes}
                        disabled={savingNotes}
                        className="px-4 py-2 rounded-xl bg-[#0B1F3A] text-white text-xs font-bold disabled:opacity-50"
                      >
                        {savingNotes ? "Saving..." : "Save Notes"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-700 bg-[#F8F6F1] p-4 rounded-xl border border-[#E5E0D5] leading-relaxed">
                    {caseData.internalNotes || "No internal notes recorded for this brief."}
                  </p>
                )}
              </div>

              {/* Case Event Timeline */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E5E0D5] shadow-sm space-y-4">
                <h3 className="font-serif text-base font-bold text-[#071526]">
                  Procedural Event Timeline
                </h3>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E5E0D5]">
                  {caseData.timelineEvents.map((ev: any) => (
                    <div key={ev.id} className="relative">
                      <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-[#0B1F3A] border-2 border-[#C9A24B]" />
                      <div className="text-xs">
                        <span className="font-mono text-[10px] text-gray-500 uppercase">
                          {new Date(ev.eventDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        <h4 className="font-bold text-[#071526] mt-0.5">{ev.title}</h4>
                        <p className="text-gray-600 mt-0.5 leading-relaxed">{ev.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Assigned Advocates & Hearings List */}
            <div className="lg:col-span-4 space-y-6">
              {/* Assigned Legal Team */}
              <div className="bg-white rounded-3xl p-6 border border-[#E5E0D5] shadow-sm space-y-4">
                <h3 className="font-serif text-base font-bold text-[#071526]">
                  Assigned Advocates
                </h3>

                <div className="space-y-3">
                  {caseData.assignees.map((as: any) => (
                    <div key={as.id} className="p-3 rounded-xl bg-[#F8F6F1] border border-[#E5E0D5] text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-[#071526]">{as.user.name}</span>
                        <span className="text-[10px] font-bold text-[#C9A24B] uppercase bg-[#C9A24B]/10 px-1.5 py-0.5 rounded">
                          {as.roleInCase}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500">{as.user.teamProfile?.designation || "Advocate"}</p>
                      {as.user.phone && (
                        <p className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-[#C9A24B]" /> {as.user.phone}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Hearing History */}
              <div className="bg-white rounded-3xl p-6 border border-[#E5E0D5] shadow-sm space-y-4">
                <h3 className="font-serif text-base font-bold text-[#071526]">
                  Recent Court Hearings
                </h3>

                <div className="space-y-2.5 text-xs">
                  {caseData.hearings.slice(0, 4).map((h: any) => (
                    <div key={h.id} className="p-3 rounded-xl bg-[#F8F6F1] border border-[#E5E0D5]">
                      <div className="flex items-center justify-between font-mono font-bold text-[#071526] mb-1">
                        <span>{new Date(h.hearingDate).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${h.isCompleted ? "bg-gray-200 text-gray-700" : "bg-amber-100 text-amber-800"}`}>
                          {h.isCompleted ? "Concluded" : "Upcoming"}
                        </span>
                      </div>
                      <p className="text-gray-700 font-medium line-clamp-1">{h.purpose}</p>
                      {h.summaryOutcome && (
                        <p className="text-[11px] text-gray-500 mt-1 italic">{h.summaryOutcome}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PDF DOCUMENTS & VERIFICATION */}
      {activeTab === "documents" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#071526]">
                Official Case Briefs & Verified PDFs
              </h3>
              <p className="text-xs text-gray-500">
                Every document certified by Legalex contains a unique cryptographic QR seal
              </p>
            </div>

            <button
              type="button"
              onClick={() => setUploadModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#0B1F3A] hover:bg-[#132B4F] text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4 text-[#DFB75E]" />
              <span>Upload & Seal Document</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {caseData.documents.map((doc: any) => (
              <div
                key={doc.id}
                className="bg-white rounded-2xl p-5 border border-[#E5E0D5] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0B1F3A] text-[#DFB75E] flex items-center justify-center shrink-0">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#C9A24B]/15 text-[#9C7728] uppercase">
                      {doc.category}
                    </span>
                  </div>

                  <h4 className="font-serif text-sm font-bold text-[#071526] line-clamp-2 mb-1.5">
                    {doc.title}
                  </h4>

                  <p className="text-[11px] text-gray-500 mb-3 truncate">
                    File: {doc.fileName} ({(doc.fileSize / 1024).toFixed(1)} KB)
                  </p>

                  {/* Verification Pill */}
                  <div className="p-2.5 rounded-xl bg-[#F8F6F1] border border-[#E5E0D5] flex items-center justify-between text-[11px] mb-4">
                    <span className="font-mono font-bold text-[#0B1F3A]">
                      {doc.verificationId}
                    </span>
                    <Link
                      href={`/verify-document/${doc.verificationId}`}
                      target="_blank"
                      className="text-[#C9A24B] font-semibold hover:underline flex items-center gap-1"
                    >
                      <span>Verify</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewPdfUrl(doc.filePath)}
                    className="flex-1 py-1.5 px-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </button>

                  <a
                    href={doc.filePath}
                    download
                    className="flex-1 py-1.5 px-3 rounded-lg bg-[#0B1F3A] hover:bg-[#132B4F] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-[#DFB75E]" />
                    <span>Download</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Upload Document Modal */}
          {uploadModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
              <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#E5E0D5] shadow-2xl relative">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
                  <h3 className="font-serif text-lg font-bold text-[#071526]">
                    Upload & Digitally Seal Case PDF
                  </h3>
                  <button
                    type="button"
                    onClick={() => setUploadModalOpen(false)}
                    className="text-gray-400 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {uploadSuccess && (
                  <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>{uploadSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleDocumentUpload} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Document Title / Description
                    </label>
                    <input
                      type="text"
                      value={uploadTitle}
                      onChange={(e) => setUploadTitle(e.target.value)}
                      placeholder="e.g. Certified Copy of High Court Stay Order"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#C9A24B] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Document Category
                    </label>
                    <select
                      value={uploadCategory}
                      onChange={(e) => setUploadCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-[#C9A24B] outline-none"
                    >
                      <option value="PETITION">Petition / Plaint</option>
                      <option value="INTERIM_ORDER">Interim Order / Stay</option>
                      <option value="WRITTEN_STATEMENT">Written Statement</option>
                      <option value="EVIDENCE">Evidence & 7/12 Extract</option>
                      <option value="VAKALATNAMA">Vakalatnama</option>
                      <option value="FINAL_JUDGMENT">Final Judgment / Decree</option>
                      <option value="OTHER">Other Official Document</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Choose PDF File *
                    </label>
                    <input
                      type="file"
                      required
                      accept=".pdf"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-[#C9A24B] outline-none"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50 text-amber-800 text-[11px] leading-relaxed border border-amber-200">
                    <p className="font-bold">Automated Legalex Cryptographic Sealing:</p>
                    <p>On upload, the system will embed a unique Verification Reference ID, SHA256 Hash, and dynamic QR Code valid on the public verifier.</p>
                  </div>

                  <div className="pt-2 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setUploadModalOpen(false)}
                      className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={uploading || !selectedFile}
                      className="px-6 py-2 rounded-xl bg-[#0B1F3A] hover:bg-[#132B4F] text-white font-bold disabled:opacity-50"
                    >
                      {uploading ? "Sealing Document..." : "Upload & Authenticate"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* PDF Preview Modal */}
          {previewPdfUrl && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
              <div className="bg-white rounded-3xl max-w-4xl w-full h-[80vh] flex flex-col overflow-hidden shadow-2xl border border-gray-300">
                <div className="p-4 bg-[#0B1F3A] text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#DFB75E]" />
                    <span className="font-serif font-bold text-sm">Legalex Certified Brief Preview</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPreviewPdfUrl(null)}
                    className="p-1 rounded-lg text-gray-300 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex-1 w-full bg-gray-100">
                  <iframe
                    src={previewPdfUrl}
                    title="PDF Document Preview"
                    className="w-full h-full border-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: BILLING & INVOICES */}
      {activeTab === "billing" && (
        <div className="space-y-6">
          {/* Revenue KPI Summary Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-[#E5E0D5] shadow-sm">
              <span className="text-gray-500 font-semibold text-xs block mb-1">Total Fee Notes Billed</span>
              <span className="font-serif text-2xl font-bold text-[#071526]">
                ₹{totalBilled.toLocaleString()}
              </span>
              <p className="text-[10px] text-gray-400 mt-0.5">Inclusive of 18% Legal GST</p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-[#E5E0D5] shadow-sm">
              <span className="text-gray-500 font-semibold text-xs block mb-1">Settled & Collected</span>
              <span className="font-serif text-2xl font-bold text-[#059669]">
                ₹{totalPaid.toLocaleString()}
              </span>
              <p className="text-[10px] text-emerald-600 mt-0.5">Reconciled in Chambers Bank</p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-[#E5E0D5] shadow-sm">
              <span className="text-gray-500 font-semibold text-xs block mb-1">Outstanding Retainer Balance</span>
              <span className="font-serif text-2xl font-bold text-[#E11D48]">
                ₹{totalDue.toLocaleString()}
              </span>
              <p className="text-[10px] text-rose-500 mt-0.5">Pending clearance</p>
            </div>
          </div>

          {/* Action Header */}
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-[#071526]">
              Itemized Case Invoices
            </h3>

            {!isClient && (
              <button
                type="button"
                onClick={() => setInvoiceModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#0B1F3A] hover:bg-[#132B4F] text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#DFB75E]" />
                <span>Create New Invoice</span>
              </button>
            )}
          </div>

          {/* Invoices List */}
          <div className="space-y-4">
            {caseData.invoices.map((inv: any) => (
              <div
                key={inv.id}
                className="bg-white rounded-2xl p-6 border border-[#E5E0D5] shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-[#0B1F3A]">
                        {inv.invoiceNumber}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          inv.status === "PAID"
                            ? "bg-emerald-100 text-emerald-800"
                            : inv.status === "PARTIALLY_PAID"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Issued {new Date(inv.issueDate).toLocaleDateString("en-IN")} • Due {new Date(inv.dueDate).toLocaleDateString("en-IN")}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedInvoiceForReceipt(inv)}
                      className="px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 text-xs font-semibold text-gray-700 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5 text-gray-500" />
                      <span>Print Receipt</span>
                    </button>

                    {inv.status !== "PAID" && (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveInvoiceForPayment(inv);
                          setPaymentAmount(String(inv.totalAmount - inv.paidAmount));
                          setPaymentModalOpen(true);
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Record Payment</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Line Items Table */}
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] uppercase font-bold text-gray-400 border-b border-gray-100">
                        <th className="py-1">Description</th>
                        <th className="py-1 text-center">Qty</th>
                        <th className="py-1 text-right">Unit Rate</th>
                        <th className="py-1 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {inv.items.map((it: any) => (
                        <tr key={it.id}>
                          <td className="py-2 text-gray-800">{it.description}</td>
                          <td className="py-2 text-center text-gray-600">{it.quantity}</td>
                          <td className="py-2 text-right font-mono text-gray-600">₹{it.unitPrice.toLocaleString()}</td>
                          <td className="py-2 text-right font-mono font-bold text-[#071526]">₹{it.amount.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Financial Summary Row */}
                <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between text-xs bg-[#F8F6F1] p-3 rounded-xl">
                  <div className="space-x-4 text-gray-600">
                    <span>Subtotal: <strong>₹{inv.subtotal.toLocaleString()}</strong></span>
                    <span>GST (18%): <strong>₹{inv.taxAmount.toLocaleString()}</strong></span>
                  </div>
                  <div className="space-x-4">
                    <span className="font-bold text-[#071526]">Total: ₹{inv.totalAmount.toLocaleString()}</span>
                    <span className="font-bold text-[#059669]">Paid: ₹{inv.paidAmount.toLocaleString()}</span>
                    {inv.totalAmount - inv.paidAmount > 0 && (
                      <span className="font-bold text-[#E11D48]">
                        Balance: ₹{(inv.totalAmount - inv.paidAmount).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Record Payment Modal */}
          {paymentModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-[#E5E0D5] shadow-2xl relative">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
                  <h3 className="font-serif text-lg font-bold text-[#071526]">
                    Record Fee Receipt
                  </h3>
                  <button
                    type="button"
                    onClick={() => setPaymentModalOpen(false)}
                    className="text-gray-400 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleRecordPayment} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Payment Amount (INR) *
                    </label>
                    <input
                      type="number"
                      required
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 font-mono text-sm focus:ring-2 focus:ring-[#C9A24B] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Payment Method
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-[#C9A24B] outline-none"
                    >
                      <option value="NEFT/RTGS">NEFT / RTGS Bank Transfer</option>
                      <option value="UPI">UPI / QR Payment</option>
                      <option value="Cheque">Banker&apos;s Cheque</option>
                      <option value="Online">Online Payment Gateway</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Transaction UTR / Reference Number
                    </label>
                    <input
                      type="text"
                      value={transactionRef}
                      onChange={(e) => setTransactionRef(e.target.value)}
                      placeholder="e.g. UTR-HDFC9088123"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 font-mono focus:ring-2 focus:ring-[#C9A24B] outline-none"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentModalOpen(false)}
                      className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={recordingPayment || !paymentAmount}
                      className="px-6 py-2 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold disabled:opacity-50"
                    >
                      {recordingPayment ? "Reconciling..." : "Confirm & Record Receipt"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Invoice Creation Modal */}
          {invoiceModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
              <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#E5E0D5] shadow-2xl relative">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
                  <h3 className="font-serif text-lg font-bold text-[#071526]">
                    Generate Legal Fee Invoice
                  </h3>
                  <button
                    type="button"
                    onClick={() => setInvoiceModalOpen(false)}
                    className="text-gray-400 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleCreateInvoice} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Due Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={invoiceDueDate}
                      onChange={(e) => setInvoiceDueDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#C9A24B] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Line Items (18% GST auto-applied)
                    </label>
                    {invoiceItems.map((item, idx) => (
                      <div key={idx} className="space-y-2 p-3 bg-gray-50 rounded-xl mb-2">
                        <input
                          type="text"
                          required
                          value={item.description}
                          onChange={(e) => {
                            const newItems = [...invoiceItems];
                            newItems[idx].description = e.target.value;
                            setInvoiceItems(newItems);
                          }}
                          placeholder="Service description"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs bg-white"
                        />
                        <div className="flex gap-2">
                          <input
                            type="number"
                            required
                            min={1}
                            value={item.quantity}
                            onChange={(e) => {
                              const newItems = [...invoiceItems];
                              newItems[idx].quantity = Number(e.target.value);
                              setInvoiceItems(newItems);
                            }}
                            placeholder="Qty"
                            className="w-20 px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs bg-white"
                          />
                          <input
                            type="number"
                            required
                            value={item.unitPrice}
                            onChange={(e) => {
                              const newItems = [...invoiceItems];
                              newItems[idx].unitPrice = Number(e.target.value);
                              setInvoiceItems(newItems);
                            }}
                            placeholder="Rate (₹)"
                            className="flex-1 px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs bg-white font-mono"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setInvoiceModalOpen(false)}
                      className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={creatingInvoice}
                      className="px-6 py-2 rounded-xl bg-[#0B1F3A] hover:bg-[#132B4F] text-white font-bold disabled:opacity-50"
                    >
                      {creatingInvoice ? "Generating..." : "Generate GST Invoice"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Printable Invoice Receipt View Modal */}
          {selectedInvoiceForReceipt && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
              <div className="bg-white rounded-3xl max-w-2xl w-full p-8 border-2 border-[#C9A24B] shadow-2xl relative max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-6 border-b border-gray-200 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0B1F3A] text-[#DFB75E] flex items-center justify-center">
                      <Scale className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#071526]">
                        LEGALEX CHAMBERS & ADVOCATES
                      </h3>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                        Official Legal Fee Receipt • GSTIN Registered
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedInvoiceForReceipt(null)}
                    className="text-gray-400 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Invoice Number:</span>
                    <span className="font-mono font-bold text-[#071526]">{selectedInvoiceForReceipt.invoiceNumber}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Client Account:</span>
                    <span className="font-bold text-[#071526]">{caseData.client.companyName || caseData.client.user?.name}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Case Matter:</span>
                    <span className="font-bold text-[#071526]">{caseData.caseNumber}</span>
                  </div>

                  <div className="pt-2">
                    <p className="font-bold text-gray-700 mb-2">Itemized Professional Services:</p>
                    {selectedInvoiceForReceipt.items.map((it: any) => (
                      <div key={it.id} className="flex justify-between py-1 text-gray-700">
                        <span>{it.description} (x{it.quantity})</span>
                        <span className="font-mono font-semibold">₹{it.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-xl bg-[#F8F6F1] space-y-1.5 pt-3 border border-[#E5E0D5]">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal:</span>
                      <span className="font-mono">₹{selectedInvoiceForReceipt.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>GST (18%):</span>
                      <span className="font-mono">₹{selectedInvoiceForReceipt.taxAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-[#071526] pt-2 border-t border-gray-200">
                      <span>Total Invoice Amount:</span>
                      <span className="font-mono">₹{selectedInvoiceForReceipt.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-5 py-2.5 rounded-xl bg-[#0B1F3A] text-white text-xs font-bold flex items-center gap-2"
                  >
                    <Printer className="w-4 h-4 text-[#DFB75E]" />
                    <span>Print Receipt</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: CLIENT DETAILS */}
      {activeTab === "client" && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-7 sm:p-8 border border-[#E5E0D5] shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#0B1F3A] text-[#DFB75E] flex items-center justify-center font-bold text-base">
                  {caseData.client.companyName ? caseData.client.companyName[0] : "C"}
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#071526]">
                    {caseData.client.companyName || caseData.client.user?.name}
                  </h3>
                  <p className="font-mono text-xs text-[#C9A24B] font-bold">
                    Client Code: {caseData.client.clientCode}
                  </p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                Verified Retainer Client
              </span>
            </div>

            {/* KYC & Address Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#F8F6F1] border border-[#E5E0D5] space-y-2">
                <p className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                  Communication Details:
                </p>
                <div className="space-y-1.5 text-gray-700">
                  <p className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-[#C9A24B]" />
                    <span>Contact Person: {caseData.client.user?.name}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#C9A24B]" />
                    <span>Email: {caseData.client.user?.email}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#C9A24B]" />
                    <span>Phone: {caseData.client.user?.phone || "+91 98000 00000"}</span>
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#F8F6F1] border border-[#E5E0D5] space-y-2">
                <p className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                  Chambers Address & Jurisdiction:
                </p>
                <div className="space-y-1 text-gray-700">
                  <p className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#C9A24B] shrink-0 mt-0.5" />
                    <span>{caseData.client.address}, {caseData.client.city}, {caseData.client.state}</span>
                  </p>
                  <p className="text-[11px] text-gray-500 pl-5">Pin Code: {caseData.client.pinCode || "411005"}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#F8F6F1] border border-[#E5E0D5] space-y-1">
                <p className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                  Masked KYC / Statutory Tax IDs:
                </p>
                <p className="text-gray-800">PAN Number: <strong className="font-mono">{caseData.client.panNumber || "AAACR1000F"}</strong></p>
                <p className="text-gray-800">Aadhaar (Masked): <strong className="font-mono">{caseData.client.aadhaarMasked || "XXXX-XXXX-3001"}</strong></p>
              </div>

              <div className="p-4 rounded-xl bg-[#F8F6F1] border border-[#E5E0D5] space-y-1">
                <p className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                  Emergency Chamber Line:
                </p>
                <p className="text-gray-800">{caseData.client.emergencyPhone || "+91 97000 00001"}</p>
                <p className="text-[10px] text-gray-500">Authorized for urgent ad-interim relief communications.</p>
              </div>
            </div>

            {/* Linked Cases for this Client */}
            <div className="pt-2">
              <h4 className="font-serif text-sm font-bold text-[#071526] mb-3">
                All Linked Legal Matters for this Client ({caseData.client.cases?.length || 1})
              </h4>
              <div className="space-y-2 text-xs">
                {caseData.client.cases?.map((cItem: any) => (
                  <div
                    key={cItem.id}
                    className="p-3 rounded-xl bg-[#F8F6F1] border border-[#E5E0D5] flex items-center justify-between"
                  >
                    <div>
                      <span className="font-mono font-bold text-[#0B1F3A] mr-2">
                        {cItem.caseNumber}
                      </span>
                      <span className="text-gray-700">{cItem.casingTitle}</span>
                    </div>
                    <Link
                      href={`/portal/cases/${cItem.id}`}
                      className="text-xs font-bold text-[#C9A24B] hover:underline"
                    >
                      Open Brief →
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
