"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Landmark,
  Bell,
  CheckCircle2,
  AlertCircle,
  Plus,
  X,
  Search,
  Filter,
} from "lucide-react";

interface HearingItem {
  id: string;
  hearingDate: Date | string;
  courtRoom?: string | null;
  purpose: string;
  summaryOutcome?: string | null;
  nextSteps?: string | null;
  isCompleted: boolean;
  caseId: string;
  case: {
    caseNumber: string;
    casingTitle: string;
    courtName: string;
    practiceArea: string;
    client: {
      companyName?: string | null;
      user: { name: string; phone?: string | null };
    };
  };
}

interface CaseSimple {
  id: string;
  caseNumber: string;
  casingTitle: string;
}

interface Props {
  initialHearings: HearingItem[];
  cases: CaseSimple[];
  isAdmin: boolean;
  isClient: boolean;
}

export function HearingsManager({
  initialHearings,
  cases,
  isAdmin,
  isClient,
}: Props) {
  const [hearings, setHearings] = useState<HearingItem[]>(initialHearings);
  const [filterTab, setFilterTab] = useState<"UPCOMING" | "PAST" | "ALL">("UPCOMING");
  const [search, setSearch] = useState("");
  const [reminderAlert, setReminderAlert] = useState("");
  const [sendingReminderId, setSendingReminderId] = useState<string | null>(null);

  // New Hearing Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [scheduling, setScheduling] = useState(false);
  const [newHearingData, setNewHearingData] = useState({
    caseId: cases[0]?.id || "",
    hearingDate: "",
    courtRoom: "Court Hall #2",
    purpose: "Arguments on Stay / Final Arguments",
    nextSteps: "Adv. Amit S. Rathi to lead submissions.",
  });

  const handleSendReminder = async (hearingId: string) => {
    setSendingReminderId(hearingId);
    setReminderAlert("");

    try {
      const res = await fetch("/api/hearings/remind", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hearingId, channel: "WhatsApp & SMS" }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send reminder.");

      setReminderAlert(data.message);
      setTimeout(() => setReminderAlert(""), 6000);
    } catch (err: any) {
      alert(err.message || "Failed to send reminder.");
    } finally {
      setSendingReminderId(null);
    }
  };

  const handleCreateHearing = async (e: React.FormEvent) => {
    e.preventDefault();
    setScheduling(true);

    try {
      const res = await fetch(`/api/cases/${newHearingData.caseId}/hearings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newHearingData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to schedule hearing.");

      // Refresh page or update state
      window.location.reload();
    } catch (err: any) {
      alert(err.message || "Failed to schedule hearing.");
    } finally {
      setScheduling(false);
    }
  };

  // Filter hearings
  const filteredHearings = hearings.filter((h) => {
    const isPast = new Date(h.hearingDate).getTime() < Date.now();
    if (filterTab === "UPCOMING" && isPast) return false;
    if (filterTab === "PAST" && !isPast) return false;

    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      h.case.caseNumber.toLowerCase().includes(q) ||
      h.case.casingTitle.toLowerCase().includes(q) ||
      h.purpose.toLowerCase().includes(q) ||
      h.case.courtName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#071526]">
            Court Hearing Calendar & Cause Lists
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Monitor listings across Maharashtra High Court & District Courts
          </p>
        </div>

        {!isClient && (
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#0B1F3A] hover:bg-[#132B4F] text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#DFB75E]" />
            <span>List New Hearing</span>
          </button>
        )}
      </div>

      {reminderAlert && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-800 flex items-start gap-2.5 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <p className="font-bold">Chambers Dispatch Logged</p>
            <p className="mt-0.5">{reminderAlert}</p>
          </div>
        </div>
      )}

      {/* Filter Tabs & Search */}
      <div className="bg-white rounded-2xl p-4 border border-[#E5E0D5] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex rounded-xl bg-[#F8F6F1] p-1 border border-gray-200 w-full sm:w-auto">
          {(["UPCOMING", "PAST", "ALL"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilterTab(tab)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                filterTab === tab
                  ? "bg-[#0B1F3A] text-[#DFB75E] shadow-sm font-bold"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab === "UPCOMING" ? "Upcoming Board" : tab === "PAST" ? "Past Hearings" : "All Hearings"}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cause lists, case #, purpose..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-[#F8F6F1] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C9A24B]"
          />
        </div>
      </div>

      {/* Hearings List */}
      <div className="space-y-4">
        {filteredHearings.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center text-xs text-gray-500 border border-[#E5E0D5]">
            No hearing entries found under this filter.
          </div>
        ) : (
          filteredHearings.map((h) => {
            const hDate = new Date(h.hearingDate);
            const isToday = hDate.toDateString() === new Date().toDateString();
            const isPast = hDate.getTime() < Date.now();

            return (
              <div
                key={h.id}
                className={`bg-white rounded-3xl p-6 border shadow-sm transition-all hover:shadow-md ${
                  isToday
                    ? "border-amber-400 ring-2 ring-amber-100"
                    : "border-[#E5E0D5]"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    {/* Date Block */}
                    <div className="w-16 h-16 rounded-2xl bg-[#0B1F3A] text-white flex flex-col items-center justify-center shrink-0 border border-[#C9A24B]/30">
                      <span className="text-[10px] uppercase font-bold text-[#DFB75E]">
                        {hDate.toLocaleDateString("en-US", { month: "short" })}
                      </span>
                      <span className="font-serif text-2xl font-bold leading-none">
                        {hDate.getDate()}
                      </span>
                      <span className="text-[9px] text-gray-400">
                        {hDate.toLocaleDateString("en-US", { weekday: "short" })}
                      </span>
                    </div>

                    {/* Hearing Details */}
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#0B1F3A]">
                          {h.case.caseNumber}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#C9A24B]/15 text-[#9C7728] uppercase">
                          {h.case.practiceArea.replace("_", " ")}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-700">
                          {h.courtRoom || "Court Hall #1"}
                        </span>
                        {isToday && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-white animate-pulse">
                            LISTED TODAY
                          </span>
                        )}
                      </div>

                      <h3 className="font-serif text-base font-bold text-[#071526]">
                        {h.case.casingTitle}
                      </h3>

                      <p className="text-xs text-gray-600 flex items-center gap-1.5">
                        <Landmark className="w-3.5 h-3.5 text-[#C9A24B]" />
                        <span>{h.case.courtName}</span>
                      </p>

                      <div className="pt-2 text-xs text-gray-700">
                        <p><strong>Board Purpose:</strong> {h.purpose}</p>
                        {h.summaryOutcome && (
                          <p className="text-gray-500 italic mt-0.5"><strong>Transpired:</strong> {h.summaryOutcome}</p>
                        )}
                        {h.nextSteps && (
                          <p className="text-[#059669] font-medium mt-0.5"><strong>Next Steps:</strong> {h.nextSteps}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex md:flex-col items-center md:items-end justify-between gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0">
                    <Link
                      href={`/portal/cases/${h.caseId}`}
                      className="px-4 py-2 rounded-xl bg-[#0B1F3A] hover:bg-[#132B4F] text-white text-xs font-bold transition-colors"
                    >
                      Open Case Hub →
                    </Link>

                    {!isPast && (
                      <button
                        type="button"
                        onClick={() => handleSendReminder(h.id)}
                        disabled={sendingReminderId === h.id}
                        className="px-3 py-1.5 rounded-xl border border-[#C9A24B] hover:bg-[#C9A24B]/10 text-xs font-semibold text-[#071526] flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Bell className="w-3.5 h-3.5 text-[#C9A24B]" />
                        <span>
                          {sendingReminderId === h.id ? "Sending..." : "Send Reminder"}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* New Hearing Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#E5E0D5] shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
              <h3 className="font-serif text-lg font-bold text-[#071526]">
                List New Hearing on Board
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateHearing} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Select Case Matter *
                </label>
                <select
                  required
                  value={newHearingData.caseId}
                  onChange={(e) =>
                    setNewHearingData({ ...newHearingData, caseId: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-[#C9A24B] outline-none"
                >
                  {cases.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.caseNumber} - {c.casingTitle}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Hearing Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newHearingData.hearingDate}
                    onChange={(e) =>
                      setNewHearingData({ ...newHearingData, hearingDate: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#C9A24B] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Court Hall / Room Number
                  </label>
                  <input
                    type="text"
                    value={newHearingData.courtRoom}
                    onChange={(e) =>
                      setNewHearingData({ ...newHearingData, courtRoom: e.target.value })
                    }
                    placeholder="e.g. Court Hall #4"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#C9A24B] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Hearing Purpose / Board Listing *
                </label>
                <input
                  type="text"
                  required
                  value={newHearingData.purpose}
                  onChange={(e) =>
                    setNewHearingData({ ...newHearingData, purpose: e.target.value })
                  }
                  placeholder="e.g. Cross-examination of PW-1 / Arguments on Injunction"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#C9A24B] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Preparation & Next Steps
                </label>
                <textarea
                  rows={2}
                  value={newHearingData.nextSteps}
                  onChange={(e) =>
                    setNewHearingData({ ...newHearingData, nextSteps: e.target.value })
                  }
                  placeholder="e.g. Draft rejoinder affidavit; prepare questionnaire"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#C9A24B] outline-none"
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
                  disabled={scheduling || !newHearingData.hearingDate}
                  className="px-6 py-2 rounded-xl bg-[#0B1F3A] hover:bg-[#132B4F] text-white font-bold disabled:opacity-50"
                >
                  {scheduling ? "Listing..." : "Confirm Board Listing"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
