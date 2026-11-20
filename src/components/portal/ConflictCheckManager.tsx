"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  Search,
  CheckCircle,
  AlertTriangle,
  Clock,
  History,
} from "lucide-react";

interface ConflictCheck {
  id: string;
  searchQuery: string;
  category: string;
  potentialMatches: number;
  matchSummary?: string | null;
  status: string;
  reviewedBy: string;
  notes?: string | null;
  createdAt: string;
}

interface ConflictCheckManagerProps {
  initialChecks: ConflictCheck[];
}

export function ConflictCheckManager({ initialChecks }: ConflictCheckManagerProps) {
  const [checks, setChecks] = useState<ConflictCheck[]>(initialChecks);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("OPPOSITE_PARTY");
  const [notes, setNotes] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);

  const handleRunCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setLastResult(null);

    try {
      const res = await fetch("/api/conflict-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ searchQuery, category, notes }),
      });
      const data = await res.json();
      if (data.success) {
        setLastResult(data);
        setChecks((prev) => [data.check, ...prev]);
        setSearchQuery("");
        setNotes("");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CLEARED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Cleared
          </span>
        );
      case "POTENTIAL_CONFLICT":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> Conflict Flagged
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" /> Under Review
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-white p-7 sm:p-8 rounded-2xl border border-[#E2DDD3] shadow-sm">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="p-2 rounded-xl bg-[#0B1F3A]/10 text-[#0B1F3A]">
            <ShieldAlert className="w-5 h-5 text-[#9C7728]" />
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0B1F3A]">Conflict of Interest Check Engine</h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 font-light leading-relaxed">
          Statutory compliance tool to verify that prospective clients, opposite parties, or corporate entities have no ethical or legal conflicts with existing briefs.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white p-7 sm:p-8 rounded-2xl border border-[#E2DDD3] shadow-sm">
        <h3 className="text-base font-semibold text-slate-900 mb-4">Run Conflict Verification</h3>
        <form onSubmit={handleRunCheck} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5 tracking-wide">
                Individual Name, Corporate Entity, or Adverse Party *
              </label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Pune Municipal Corporation, Mundhwa Developers, Suresh Patil..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs sm:text-sm pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#C9A24B] outline-none bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5 tracking-wide">Search Type</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs sm:text-sm px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#C9A24B] outline-none bg-white"
              >
                <option value="OPPOSITE_PARTY">Opposite Party / Adversary</option>
                <option value="CLIENT_NAME">Prospective Client Name</option>
                <option value="RELATED_ENTITY">Affiliated Company / Director</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5 tracking-wide">Notes / Context</label>
            <input
              type="text"
              placeholder="e.g. Proposed engagement for arbitration brief in Pune District Court"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs sm:text-sm px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#C9A24B] outline-none bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={isSearching}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0B1F3A] hover:bg-[#142d52] text-white text-xs sm:text-sm font-bold transition-all shadow-md disabled:opacity-50 cursor-pointer"
          >
            {isSearching ? "Searching Chamber Archives..." : "Execute Conflict Check"}
          </button>
        </form>

        {/* Real-time result banner */}
        {lastResult && (
          <div
            className={`mt-6 p-5 rounded-2xl border ${
              lastResult.check.status === "CLEARED"
                ? "bg-emerald-50/70 border-emerald-200 text-emerald-900"
                : "bg-rose-50/70 border-rose-200 text-rose-900"
            }`}
          >
            <div className="flex items-center gap-2.5">
              {lastResult.check.status === "CLEARED" ? (
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
              <h4 className="font-semibold text-sm">
                Result for &quot;{lastResult.check.searchQuery}&quot;: {lastResult.check.status.replace("_", " ")}
              </h4>
            </div>
            <p className="text-xs mt-1.5 leading-relaxed opacity-90">{lastResult.check.matchSummary}</p>
          </div>
        )}
      </div>

      {/* Historical Conflict Checks Log */}
      <div className="bg-white rounded-2xl border border-[#E2DDD3] shadow-sm overflow-hidden">
        <div className="p-5 bg-[#F8F6F1] border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
            <History className="w-4 h-4 text-slate-500" />
            Historical Conflict Verification Registry
          </div>
          <span className="text-xs text-slate-500">{checks.length} entries</span>
        </div>

        <div className="divide-y divide-slate-100">
          {checks.map((c) => (
            <div key={c.id} className="p-6 hover:bg-slate-50/70 transition-colors space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="font-semibold text-slate-900 text-sm">{c.searchQuery}</span>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {c.category.replace("_", " ")}
                  </span>
                </div>
                {getStatusBadge(c.status)}
              </div>

              {c.matchSummary && <div className="text-xs text-slate-600 leading-relaxed font-normal">{c.matchSummary}</div>}

              {c.notes && (
                <div className="text-xs text-slate-500 bg-[#F8F6F1] p-3 rounded-xl border border-slate-100">
                  <span className="font-semibold text-slate-700">Advisory:</span> {c.notes}
                </div>
              )}

              <div className="flex items-center gap-5 text-xs text-slate-400 pt-1">
                <span>
                  Date: {new Date(c.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </span>
                <span>Reviewed by: {c.reviewedBy}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
