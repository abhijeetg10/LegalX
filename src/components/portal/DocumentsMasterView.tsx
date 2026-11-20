"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  ShieldCheck,
  Upload,
  Download,
  Search,
  ExternalLink,
  Plus,
  X,
  CheckCircle2,
  Eye,
} from "lucide-react";

interface DocItem {
  id: string;
  title: string;
  category: string;
  fileName: string;
  fileSize: number;
  filePath: string;
  verificationId: string;
  qrCodeUrl?: string | null;
  digitalSealHash?: string | null;
  uploadedBy: string;
  createdAt: Date | string;
  case: {
    id: string;
    caseNumber: string;
    casingTitle: string;
    courtName: string;
  };
}

interface CaseOption {
  id: string;
  caseNumber: string;
  casingTitle: string;
}

interface Props {
  initialDocs: DocItem[];
  cases: CaseOption[];
  isAdmin: boolean;
  isClient: boolean;
}

export function DocumentsMasterView({
  initialDocs,
  cases,
  isAdmin,
  isClient,
}: Props) {
  const [docs, setDocs] = useState<DocItem[]>(initialDocs);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  // Upload Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState(cases[0]?.id || "");
  const [category, setCategory] = useState("INTERIM_ORDER");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [successMsg, setSuccessMsg] = useState("");

  const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !selectedCaseId) return;

    setUploading(true);
    setSuccessMsg("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("caseId", selectedCaseId);
      formData.append("category", category);
      if (title) formData.append("title", title);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setSuccessMsg(`Document sealed under ${data.document.verificationId}`);
      // Find case
      const matchedCase = cases.find((c) => c.id === selectedCaseId);
      const newDoc: DocItem = {
        ...data.document,
        case: {
          id: selectedCaseId,
          caseNumber: matchedCase?.caseNumber || "CASE",
          casingTitle: matchedCase?.casingTitle || "Matter",
          courtName: "Maharashtra Court",
        },
      };

      setDocs([newDoc, ...docs]);
      setFile(null);
      setTitle("");
      setTimeout(() => {
        setModalOpen(false);
        setSuccessMsg("");
      }, 1500);
    } catch (err: any) {
      alert(err.message || "Failed to upload document");
    } finally {
      setUploading(false);
    }
  };

  const filteredDocs = docs.filter((d) => {
    const matchCat = selectedCategory === "ALL" || d.category === selectedCategory;
    const matchSearch =
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.verificationId.toLowerCase().includes(search.toLowerCase()) ||
      d.case.caseNumber.toLowerCase().includes(search.toLowerCase()) ||
      d.case.casingTitle.toLowerCase().includes(search.toLowerCase());

    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#071526]">
            Official Documents & Cryptographic Seals
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Master repository of verified case pleadings, stay orders, and court certified records
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/verify-document"
            target="_blank"
            className="px-3.5 py-2 rounded-xl bg-white border border-[#E5E0D5] hover:border-[#C9A24B] text-gray-700 hover:text-[#0B1F3A] text-xs font-semibold flex items-center gap-1.5 shadow-sm"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#C9A24B]" />
            <span>Public Document Verifier</span>
          </Link>

          {!isClient && (
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#0B1F3A] hover:bg-[#132B4F] text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4 text-[#DFB75E]" />
              <span>Upload & Seal Document</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl p-4 border border-[#E5E0D5] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by verification ID (LX-...), title, case #..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-[#F8F6F1] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C9A24B]"
          />
        </div>

        <div className="w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2 text-xs rounded-xl bg-[#F8F6F1] border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#C9A24B]"
          >
            <option value="ALL">All Categories</option>
            <option value="PETITION">Petitions & Plaints</option>
            <option value="INTERIM_ORDER">Interim Stay Orders</option>
            <option value="WRITTEN_STATEMENT">Written Statements</option>
            <option value="EVIDENCE">Evidence & 7/12</option>
            <option value="VAKALATNAMA">Vakalatnama</option>
            <option value="FINAL_JUDGMENT">Final Decrees</option>
          </select>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-3xl p-6 border border-[#E5E0D5] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="font-mono text-xs font-bold text-[#0B1F3A]">
                  {doc.case.caseNumber}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#C9A24B]/15 text-[#9C7728] uppercase">
                  {doc.category}
                </span>
              </div>

              <h3 className="font-serif text-base font-bold text-[#071526] line-clamp-2 mb-1.5">
                {doc.title}
              </h3>

              <p className="text-[11px] text-gray-500 mb-3 truncate">
                File: {doc.fileName} ({(doc.fileSize / 1024).toFixed(1)} KB)
              </p>

              {/* QR Verification Reference Block */}
              <div className="p-3 rounded-2xl bg-[#F8F6F1] border border-[#E5E0D5] flex items-center justify-between gap-2 mb-4">
                <div>
                  <span className="text-[9px] uppercase font-bold text-gray-400 block">
                    Verification Seal ID
                  </span>
                  <span className="font-mono text-xs font-bold text-[#0B1F3A]">
                    {doc.verificationId}
                  </span>
                </div>

                <Link
                  href={`/verify-document/${doc.verificationId}`}
                  target="_blank"
                  className="px-2.5 py-1 rounded-lg bg-[#0B1F3A] text-[#DFB75E] text-[10px] font-bold flex items-center gap-1 hover:bg-[#132B4F]"
                >
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verify</span>
                </Link>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setPreviewPdfUrl(doc.filePath)}
                className="flex-1 py-2 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>

              <a
                href={doc.filePath}
                download
                className="flex-1 py-2 px-3 rounded-xl bg-[#0B1F3A] hover:bg-[#132B4F] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-[#DFB75E]" />
                <span>Download</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#E5E0D5] shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
              <h3 className="font-serif text-lg font-bold text-[#071526]">
                Upload & Authenticate Case PDF
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {successMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleUpload} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Select Case Record *
                </label>
                <select
                  required
                  value={selectedCaseId}
                  onChange={(e) => setSelectedCaseId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-[#C9A24B] outline-none"
                >
                  {cases.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.caseNumber} - {c.casingTitle}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Document Title / Description
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Certified Copy of Bombay High Court Ad-Interim Stay"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#C9A24B] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Document Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-[#C9A24B] outline-none"
                >
                  <option value="INTERIM_ORDER">Interim Order / Stay</option>
                  <option value="PETITION">Petition / Plaint</option>
                  <option value="WRITTEN_STATEMENT">Written Statement</option>
                  <option value="EVIDENCE">Evidence / 7/12</option>
                  <option value="VAKALATNAMA">Vakalatnama</option>
                  <option value="FINAL_JUDGMENT">Final Judgment</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Select PDF File *
                </label>
                <input
                  type="file"
                  required
                  accept=".pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-[#C9A24B] outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading || !file}
                  className="px-6 py-2 rounded-xl bg-[#0B1F3A] hover:bg-[#132B4F] text-white font-bold disabled:opacity-50"
                >
                  {uploading ? "Generating Seal..." : "Upload & Authenticate"}
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
              <span className="font-serif font-bold text-sm">Legalex Certified PDF Brief</span>
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
                title="Document Preview"
                className="w-full h-full border-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
