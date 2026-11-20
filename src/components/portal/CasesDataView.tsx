"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Download,
  Plus,
  Briefcase,
  Calendar,
  Landmark,
  X,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

interface CaseItem {
  id: string;
  caseNumber: string;
  casingTitle: string;
  practiceArea: string;
  courtName: string;
  status: string;
  stage: string;
  filingDate: Date | string;
  nextHearingDate?: Date | string | null;
  client: {
    id: string;
    companyName?: string | null;
    clientCode: string;
    city: string;
    user: { name: string; phone?: string | null };
  };
  assignees?: {
    user: { name: string };
  }[];
}

interface ClientOption {
  id: string;
  clientCode: string;
  companyName?: string | null;
  user: { name: string };
}

interface Props {
  initialCases: CaseItem[];
  clients: ClientOption[];
  isAdmin: boolean;
  isClient: boolean;
}

export function CasesDataView({ initialCases, clients, isAdmin, isClient }: Props) {
  const [cases, setCases] = useState<CaseItem[]>(initialCases);
  const [search, setSearch] = useState("");
  const [selectedArea, setSelectedArea] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // New Case Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [newCaseData, setNewCaseData] = useState({
    caseNumber: "",
    casingTitle: "",
    practiceArea: "CIVIL_AND_FAMILY",
    courtName: "District & Sessions Court, Shivaji Nagar, Pune",
    stage: "Notice Returnable",
    status: "ACTIVE",
    clientId: clients[0]?.id || "",
    summary: "",
    nextHearingDate: "",
  });

  // Filter & Search
  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      const matchSearch =
        c.caseNumber.toLowerCase().includes(search.toLowerCase()) ||
        c.casingTitle.toLowerCase().includes(search.toLowerCase()) ||
        c.courtName.toLowerCase().includes(search.toLowerCase()) ||
        c.client.companyName?.toLowerCase().includes(search.toLowerCase()) ||
        c.client.clientCode.toLowerCase().includes(search.toLowerCase());

      const matchArea = selectedArea === "ALL" || c.practiceArea === selectedArea;
      const matchStatus = selectedStatus === "ALL" || c.status === selectedStatus;

      return matchSearch && matchArea && matchStatus;
    });
  }, [cases, search, selectedArea, selectedStatus]);

  // Pagination
  const totalPages = Math.ceil(filteredCases.length / itemsPerPage) || 1;
  const paginatedCases = filteredCases.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");

    try {
      const res = await fetch("/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCaseData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create case.");
      }

      // Add to state
      const created: CaseItem = {
        ...data.case,
        client: {
          id: newCaseData.clientId,
          companyName: clients.find((cl) => cl.id === newCaseData.clientId)?.companyName || "Client",
          clientCode: clients.find((cl) => cl.id === newCaseData.clientId)?.clientCode || "CL-NEW",
          city: "Pune",
          user: { name: clients.find((cl) => cl.id === newCaseData.clientId)?.user.name || "Client" },
        },
      };

      setCases([created, ...cases]);
      setModalOpen(false);
      setNewCaseData({
        caseNumber: "",
        casingTitle: "",
        practiceArea: "CIVIL_AND_FAMILY",
        courtName: "District & Sessions Court, Shivaji Nagar, Pune",
        stage: "Notice Returnable",
        status: "ACTIVE",
        clientId: clients[0]?.id || "",
        summary: "",
        nextHearingDate: "",
      });
    } catch (err: any) {
      setFormError(err.message || "Failed to register case.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#071526]">
            {isClient ? "My Active Legal Matters" : "Litigation Case Registry"}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {filteredCases.length} records found across Maharashtra courts
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/api/cases/export"
            download
            className="px-3.5 py-2 rounded-xl bg-white border border-[#E5E0D5] hover:border-[#C9A24B] text-gray-700 hover:text-[#0B1F3A] text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5 text-[#C9A24B]" />
            <span>Export CSV</span>
          </a>

          {isAdmin && (
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#0B1F3A] hover:bg-[#132B4F] text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#DFB75E]" />
              <span>Register New Case</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E5E0D5] shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by case #, party, court..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-[#F8F6F1] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C9A24B] transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {/* Practice Area Filter */}
          <select
            value={selectedArea}
            onChange={(e) => {
              setSelectedArea(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-xs rounded-xl bg-[#F8F6F1] border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#C9A24B]"
          >
            <option value="ALL">All Practice Areas</option>
            <option value="CIVIL_AND_FAMILY">Civil & Family</option>
            <option value="REVENUE">Land Revenue (MLRC)</option>
            <option value="CONSUMER">Consumer Protection</option>
            <option value="CRIMINAL">Criminal Defence</option>
            <option value="MACT">MACT Claims</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-xs rounded-xl bg-[#F8F6F1] border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#C9A24B]"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="HEARING_SCHEDULED">Hearing Scheduled</option>
            <option value="JUDGMENT_RESERVED">Judgment Reserved</option>
            <option value="COMPLETED">Completed</option>
            <option value="ON_HOLD">On Hold</option>
          </select>
        </div>
      </div>

      {/* Case Table */}
      <div className="bg-white rounded-3xl border border-[#E5E0D5] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] uppercase tracking-wider text-gray-500 bg-[#F8F6F1]">
                <th className="py-3.5 px-5">Case Number</th>
                <th className="py-3.5 px-4">Title & Client</th>
                <th className="py-3.5 px-4">Practice Area</th>
                <th className="py-3.5 px-4">Court / Forum</th>
                <th className="py-3.5 px-4">Stage</th>
                <th className="py-3.5 px-4">Next Hearing</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedCases.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500">
                    No cases match the selected filters.
                  </td>
                </tr>
              ) : (
                paginatedCases.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-4 px-5 font-mono font-bold text-[#0B1F3A]">
                      {c.caseNumber}
                    </td>
                    <td className="py-4 px-4 max-w-xs">
                      <p className="font-semibold text-[#071526] truncate">
                        {c.casingTitle}
                      </p>
                      <p className="text-[11px] text-gray-500 truncate">
                        {c.client.companyName || c.client.user?.name} ({c.client.clientCode})
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#C9A24B]/15 text-[#9C7728]">
                        {c.practiceArea.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-4 px-4 max-w-[180px]">
                      <p className="text-gray-700 truncate" title={c.courtName}>
                        {c.courtName}
                      </p>
                    </td>
                    <td className="py-4 px-4 text-gray-700 font-medium">
                      {c.stage}
                    </td>
                    <td className="py-4 px-4">
                      {c.nextHearingDate ? (
                        <span className="font-mono text-gray-800 font-semibold flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#C9A24B]" />
                          {new Date(c.nextHearingDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                          })}
                        </span>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          c.status === "ACTIVE"
                            ? "bg-emerald-100 text-emerald-800"
                            : c.status === "COMPLETED"
                            ? "bg-blue-100 text-blue-800"
                            : c.status === "HEARING_SCHEDULED"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {c.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <Link
                        href={`/portal/cases/${c.id}`}
                        className="px-3 py-1.5 rounded-lg bg-[#0B1F3A] hover:bg-[#132B4F] text-white font-bold text-[11px] transition-colors inline-block"
                      >
                        Open Hub →
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredCases.length)} of{" "}
            {filteredCases.length} matters
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
            >
              Previous
            </button>
            <span className="px-3 py-1.5 font-bold text-[#0B1F3A]">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* New Case Creation Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-[#E5E0D5] shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#071526]">
                  Register New Litigation Matter
                </h3>
                <p className="text-xs text-gray-500">
                  Lodge new case brief into Legalex Chambers Registry
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateCase} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Court Case Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCaseData.caseNumber}
                    onChange={(e) =>
                      setNewCaseData({ ...newCaseData, caseNumber: e.target.value })
                    }
                    placeholder="e.g. RCS/512/2024"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 font-mono focus:ring-2 focus:ring-[#C9A24B] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Select Client Account *
                  </label>
                  <select
                    required
                    value={newCaseData.clientId}
                    onChange={(e) =>
                      setNewCaseData({ ...newCaseData, clientId: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-[#C9A24B] outline-none"
                  >
                    {clients.map((cl) => (
                      <option key={cl.id} value={cl.id}>
                        {cl.companyName || cl.user.name} ({cl.clientCode})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Full Cause Title *
                </label>
                <input
                  type="text"
                  required
                  value={newCaseData.casingTitle}
                  onChange={(e) =>
                    setNewCaseData({ ...newCaseData, casingTitle: e.target.value })
                  }
                  placeholder="e.g. Rameshwar Industries vs. MSEDCL & Ors."
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#C9A24B] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Practice Area
                  </label>
                  <select
                    value={newCaseData.practiceArea}
                    onChange={(e) =>
                      setNewCaseData({ ...newCaseData, practiceArea: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-[#C9A24B] outline-none"
                  >
                    <option value="CIVIL_AND_FAMILY">Civil & Family</option>
                    <option value="REVENUE">Revenue & Land Laws (MLRC)</option>
                    <option value="CONSUMER">Consumer Protection</option>
                    <option value="CRIMINAL">Criminal Defence</option>
                    <option value="MACT">MACT Accident Claims</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Court / Forum Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCaseData.courtName}
                    onChange={(e) =>
                      setNewCaseData({ ...newCaseData, courtName: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#C9A24B] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Initial Stage
                  </label>
                  <input
                    type="text"
                    value={newCaseData.stage}
                    onChange={(e) =>
                      setNewCaseData({ ...newCaseData, stage: e.target.value })
                    }
                    placeholder="e.g. Notice Returnable / Arguments on Stay"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#C9A24B] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Next Hearing Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={newCaseData.nextHearingDate}
                    onChange={(e) =>
                      setNewCaseData({ ...newCaseData, nextHearingDate: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#C9A24B] outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-[#0B1F3A] hover:bg-[#132B4F] text-white font-bold disabled:opacity-50"
                >
                  {submitting ? "Registering..." : "Confirm & Register Case"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
