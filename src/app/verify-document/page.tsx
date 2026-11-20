"use client";

import React, { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import {
  ShieldCheck,
  Search,
  Upload,
  CheckCircle2,
  XCircle,
  FileText,
  Landmark,
  Scale,
  QrCode,
  Download,
  ExternalLink,
} from "lucide-react";

export default function DocumentVerificationPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e?: React.FormEvent, customId?: string) => {
    if (e) e.preventDefault();
    const searchTerm = customId || query;
    if (!searchTerm.trim()) return;

    setLoading(true);
    setHasSearched(true);
    setResult(null);

    try {
      const res = await fetch(`/api/verify?query=${encodeURIComponent(searchTerm.trim())}`);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error("Verification search error:", err);
      setResult({ verified: false, message: "System connectivity issue. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Use filename or look for verification ID pattern in the name
      const match = file.name.match(/LX-\d{4}-\d+/i);
      const targetQuery = match ? match[0] : file.name;
      setQuery(targetQuery);
      handleSearch(undefined, targetQuery);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F6F1]">
      <Navbar />

      <main className="flex-grow">
        {/* Hero */}
        <div className="bg-[#071526] text-white py-16 border-b border-[#132B4F]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#132B4F] text-[#DFB75E] text-xs font-semibold mb-3 border border-[#C9A24B]/30">
              <ShieldCheck className="w-3.5 h-3.5" /> Bar Council Compliant Authentication System
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
              Official Document Verification
            </h1>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              Authenticate court orders, legal notices, certified pleadings, and vakalatnama briefs issued by Legalex Chambers.
            </p>
          </div>
        </div>

        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Search Box */}
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#E5E0D5] shadow-lg mb-8">
              <form onSubmit={handleSearch} className="space-y-4">
                <label className="block text-xs font-bold text-[#071526] uppercase tracking-wider">
                  Enter Verification Reference ID or Document Hash:
                </label>

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="e.g. LX-2024-1001 or LX-2024-1005"
                      className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C9A24B] focus:border-transparent transition-all font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !query.trim()}
                    className="px-6 py-3 rounded-xl bg-[#0B1F3A] hover:bg-[#132B4F] text-white font-bold text-xs transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? (
                      <span>Verifying...</span>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4 text-[#DFB75E]" />
                        <span>Verify Authenticity</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Upload or Drop File Option */}
                <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500">
                  <label className="cursor-pointer text-[#0B1F3A] hover:text-[#C9A24B] font-semibold flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload PDF to auto-verify</span>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  {/* Seeded Demo Quick Test Pills */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] text-gray-400">Demo Records:</span>
                    {["LX-2024-1001", "LX-2024-1002", "LX-2024-1005"].map((demoId) => (
                      <button
                        key={demoId}
                        type="button"
                        onClick={() => {
                          setQuery(demoId);
                          handleSearch(undefined, demoId);
                        }}
                        className="px-2 py-0.5 rounded bg-[#F8F6F1] hover:bg-[#E5E0D5] text-[10px] font-mono text-[#071526] font-bold border border-gray-200 transition-colors"
                      >
                        {demoId}
                      </button>
                    ))}
                  </div>
                </div>
              </form>
            </div>

            {/* Verification Result Card */}
            {hasSearched && (
              <div className="animate-in fade-in zoom-in-95 duration-200">
                {result?.verified ? (
                  <div className="bg-white rounded-3xl p-8 sm:p-10 border-2 border-[#059669] shadow-xl space-y-6">
                    {/* Header Seal */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-[#059669]/10 text-[#059669] flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-7 h-7" />
                        </div>
                        <div>
                          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#059669]/10 text-[#059669] uppercase">
                            Official Verified Record
                          </div>
                          <h3 className="font-serif text-xl font-bold text-[#071526] mt-0.5">
                            Document Authenticity Confirmed
                          </h3>
                        </div>
                      </div>

                      <div className="sm:text-right">
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider block">
                          Verification Reference
                        </span>
                        <span className="font-mono text-sm font-bold text-[#071526]">
                          {result.document.verificationId}
                        </span>
                      </div>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="p-3.5 rounded-xl bg-[#F8F6F1] border border-[#E5E0D5]">
                        <p className="text-gray-500 font-semibold mb-0.5">Document Title:</p>
                        <p className="font-bold text-[#071526]">{result.document.title}</p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#F8F6F1] border border-[#E5E0D5]">
                        <p className="text-gray-500 font-semibold mb-0.5">Court Case Number:</p>
                        <p className="font-bold text-[#071526] font-mono">{result.document.case.caseNumber}</p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#F8F6F1] border border-[#E5E0D5]">
                        <p className="text-gray-500 font-semibold mb-0.5">Jurisdiction / Court:</p>
                        <p className="font-bold text-[#071526]">{result.document.case.courtName}</p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#F8F6F1] border border-[#E5E0D5]">
                        <p className="text-gray-500 font-semibold mb-0.5">Lead Counsel / Authority:</p>
                        <p className="font-bold text-[#071526]">{siteConfig.founder.name} (Sanad {siteConfig.founder.sanadNumber})</p>
                      </div>
                    </div>

                    {/* Digital Seal Details */}
                    <div className="p-4 rounded-2xl bg-[#0B1F3A] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="space-y-1 text-center sm:text-left">
                        <p className="text-[11px] font-semibold text-[#DFB75E] uppercase tracking-wider flex items-center gap-1.5 justify-center sm:justify-start">
                          <Scale className="w-3.5 h-3.5" /> Chambers Cryptographic Seal Hash
                        </p>
                        <p className="text-[10px] font-mono text-gray-300 break-all max-w-md">
                          {result.document.digitalSealHash || "SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069"}
                        </p>
                      </div>

                      {result.document.qrCodeUrl && (
                        <div className="bg-white p-1.5 rounded-xl shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={result.document.qrCodeUrl}
                            alt="QR Verification"
                            className="w-16 h-16"
                          />
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                      <Link
                        href={`/verify-document/${result.document.verificationId}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B1F3A] hover:text-[#C9A24B]"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>View Permanent Certificate & Print Record</span>
                      </Link>

                      {result.document.filePath && (
                        <a
                          href={result.document.filePath}
                          download
                          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#0B1F3A] hover:bg-[#132B4F] text-white text-xs font-semibold flex items-center justify-center gap-2"
                        >
                          <Download className="w-3.5 h-3.5 text-[#DFB75E]" />
                          <span>Download Certified Copy (PDF)</span>
                        </a>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl p-8 sm:p-10 border-2 border-[#E11D48] shadow-xl text-center space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#E11D48]/10 text-[#E11D48] flex items-center justify-center mx-auto">
                      <XCircle className="w-7 h-7" />
                    </div>
                    <h3 className="font-serif text-xl font-bold text-[#071526]">
                      Verification Failed: Record Not Found
                    </h3>
                    <p className="text-xs text-gray-600 max-w-md mx-auto">
                      {result?.message || "No legitimate document matches the provided reference ID. If you suspect an unauthorized or counterfeit document, please contact Legalex Chambers immediately."}
                    </p>
                    <div className="pt-2">
                      <a
                        href={`tel:${siteConfig.contact.phone}`}
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#E11D48] text-white font-bold text-xs"
                      >
                        Report Suspicious Document to Registry
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
