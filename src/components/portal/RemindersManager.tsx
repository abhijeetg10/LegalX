"use client";

import React, { useState } from "react";
import {
  Bell,
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Filter,
  User,
} from "lucide-react";

interface Reminder {
  id: string;
  title: string;
  description?: string | null;
  category: string;
  caseId?: string | null;
  clientId?: string | null;
  assignedTo: string;
  dueDate: string;
  dueTime?: string | null;
  priority: string;
  status: string;
  isCompleted: boolean;
  completedAt?: string | null;
  snoozeUntil?: string | null;
}

interface RemindersManagerProps {
  initialReminders: Reminder[];
}

export function RemindersManager({ initialReminders }: RemindersManagerProps) {
  const [reminders, setReminders] = useState<Reminder[]>(initialReminders);
  const [activeTab, setActiveTab] = useState<"ALL" | "TODAY" | "UPCOMING" | "OVERDUE" | "COMPLETED" | "SNOOZED">("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "HEARING",
    assignedTo: "Adv. Amit S. Rathi",
    dueDate: new Date().toISOString().split("T")[0],
    dueTime: "11:00 AM",
    priority: "NORMAL",
  });

  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];

  const filteredReminders = reminders.filter((r) => {
    const rDateStr = new Date(r.dueDate).toISOString().split("T")[0];
    const isOverdue = !r.isCompleted && new Date(r.dueDate) < now && rDateStr !== todayStr;
    const isToday = rDateStr === todayStr && !r.isCompleted;
    const isUpcoming = !r.isCompleted && new Date(r.dueDate) > now && rDateStr !== todayStr;

    if (activeTab === "TODAY" && !isToday) return false;
    if (activeTab === "OVERDUE" && (r.status !== "OVERDUE" && !isOverdue)) return false;
    if (activeTab === "UPCOMING" && !isUpcoming) return false;
    if (activeTab === "COMPLETED" && !r.isCompleted) return false;
    if (activeTab === "SNOOZED" && r.status !== "SNOOZED") return false;

    if (categoryFilter !== "ALL" && r.category !== categoryFilter) return false;
    return true;
  });

  const counts = {
    all: reminders.length,
    today: reminders.filter((r) => !r.isCompleted && new Date(r.dueDate).toISOString().split("T")[0] === todayStr).length,
    overdue: reminders.filter((r) => !r.isCompleted && (r.status === "OVERDUE" || new Date(r.dueDate) < now)).length,
    completed: reminders.filter((r) => r.isCompleted).length,
    snoozed: reminders.filter((r) => r.status === "SNOOZED").length,
  };

  const handleToggleComplete = async (id: string) => {
    try {
      const res = await fetch("/api/reminders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "TOGGLE_COMPLETE" }),
      });
      const data = await res.json();
      if (data.success) {
        setReminders((prev) =>
          prev.map((r) => (r.id === id ? { ...r, isCompleted: !r.isCompleted, status: !r.isCompleted ? "COMPLETED" : "PENDING" } : r))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSnooze = async (id: string, minutes: number) => {
    try {
      const res = await fetch("/api/reminders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "SNOOZE", snoozeMinutes: minutes }),
      });
      const data = await res.json();
      if (data.success) {
        setReminders((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: "SNOOZED" } : r))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success && data.reminder) {
        setReminders((prev) => [data.reminder, ...prev]);
        setIsModalOpen(false);
        setFormData({
          title: "",
          description: "",
          category: "HEARING",
          assignedTo: "Adv. Amit S. Rathi",
          dueDate: new Date().toISOString().split("T")[0],
          dueTime: "11:00 AM",
          priority: "NORMAL",
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case "URGENT":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">Urgent</span>;
      case "HIGH":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">High</span>;
      case "NORMAL":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">Normal</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-50 text-slate-700 border border-slate-200">Low</span>;
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case "HEARING":
        return "Court Hearing";
      case "FILING_DEADLINE":
        return "Filing Deadline";
      case "CASE_FOLLOW_UP":
        return "Case Follow-up";
      case "CLIENT_FOLLOW_UP":
        return "Client Follow-up";
      case "DOCUMENT_SUBMISSION":
        return "Document Submission";
      case "PAYMENT":
        return "Payment Follow-up";
      case "TASK":
        return "Legal Task";
      case "PERSONAL":
        return "Chambers/Personal";
      default:
        return cat;
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white p-7 sm:p-8 rounded-2xl border border-[#E2DDD3] shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-2 rounded-xl bg-[#C9A24B]/15 text-[#9C7728]">
              <Bell className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0B1F3A]">Chambers Reminder Center</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-light leading-relaxed">
            Statutory deadlines, court hearing dates, client follow-ups, and chambers operations.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0B1F3A] hover:bg-[#142d52] text-white text-xs sm:text-sm font-bold transition-all shadow-md shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#DFB75E]" />
          Create Reminder
        </button>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <button
          onClick={() => setActiveTab("ALL")}
          className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
            activeTab === "ALL" ? "bg-[#0B1F3A] text-white border-[#0B1F3A] shadow-md" : "bg-white border-[#E2DDD3] hover:border-slate-300 shadow-sm"
          }`}
        >
          <div className="text-[10px] uppercase tracking-wider font-semibold opacity-75">All Reminders</div>
          <div className="text-2xl font-bold mt-1 font-serif">{counts.all}</div>
        </button>

        <button
          onClick={() => setActiveTab("TODAY")}
          className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
            activeTab === "TODAY" ? "bg-amber-600 text-white border-amber-600 shadow-md" : "bg-white border-[#E2DDD3] hover:border-slate-300 shadow-sm"
          }`}
        >
          <div className="text-[10px] uppercase tracking-wider font-semibold opacity-75">Due Today</div>
          <div className="text-2xl font-bold mt-1 text-amber-600 group-hover:text-amber-700 font-serif">{counts.today}</div>
        </button>

        <button
          onClick={() => setActiveTab("OVERDUE")}
          className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
            activeTab === "OVERDUE" ? "bg-rose-600 text-white border-rose-600 shadow-md" : "bg-white border-[#E2DDD3] hover:border-slate-300 shadow-sm"
          }`}
        >
          <div className="text-[10px] uppercase tracking-wider font-semibold opacity-75">Overdue</div>
          <div className="text-2xl font-bold mt-1 text-rose-600 font-serif">{counts.overdue}</div>
        </button>

        <button
          onClick={() => setActiveTab("SNOOZED")}
          className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
            activeTab === "SNOOZED" ? "bg-indigo-600 text-white border-indigo-600 shadow-md" : "bg-white border-[#E2DDD3] hover:border-slate-300 shadow-sm"
          }`}
        >
          <div className="text-[10px] uppercase tracking-wider font-semibold opacity-75">Snoozed</div>
          <div className="text-2xl font-bold mt-1 text-indigo-600 font-serif">{counts.snoozed}</div>
        </button>

        <button
          onClick={() => setActiveTab("COMPLETED")}
          className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
            activeTab === "COMPLETED" ? "bg-emerald-700 text-white border-emerald-700 shadow-md" : "bg-white border-[#E2DDD3] hover:border-slate-300 shadow-sm"
          }`}
        >
          <div className="text-[10px] uppercase tracking-wider font-semibold opacity-75">Completed</div>
          <div className="text-2xl font-bold mt-1 text-emerald-600 font-serif">{counts.completed}</div>
        </button>
      </div>

      {/* Filter and Table Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E2DDD3] shadow-sm">
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs sm:text-sm bg-[#F8F6F1] border border-slate-200 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-[#C9A24B]"
          >
            <option value="ALL">All Categories</option>
            <option value="HEARING">Court Hearing</option>
            <option value="FILING_DEADLINE">Filing Deadline</option>
            <option value="CASE_FOLLOW_UP">Case Follow-up</option>
            <option value="CLIENT_FOLLOW_UP">Client Follow-up</option>
            <option value="DOCUMENT_SUBMISSION">Document Submission</option>
            <option value="PAYMENT">Payment Follow-up</option>
            <option value="TASK">Legal Task</option>
            <option value="PERSONAL">Chambers / Personal</option>
          </select>
        </div>
        <div className="text-xs text-slate-500">
          Showing <span className="font-semibold text-slate-800">{filteredReminders.length}</span> active reminders
        </div>
      </div>

      {/* Reminders List */}
      <div className="bg-white rounded-2xl border border-[#E2DDD3] shadow-sm overflow-hidden">
        {filteredReminders.length === 0 ? (
          <div className="p-16 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3 opacity-60" />
            <h3 className="text-base font-semibold text-slate-800">No Reminders Found</h3>
            <p className="text-xs text-slate-500 mt-1">There are no reminders matching the selected view or filters.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredReminders.map((rem) => {
              const isOverdue = !rem.isCompleted && (rem.status === "OVERDUE" || new Date(rem.dueDate) < now);
              return (
                <div
                  key={rem.id}
                  className={`p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 transition-colors hover:bg-slate-50/70 ${
                    rem.isCompleted ? "opacity-60 bg-slate-50/40" : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => handleToggleComplete(rem.id)}
                      className={`mt-1 flex-shrink-0 w-6 h-6 rounded-lg border flex items-center justify-center transition-colors cursor-pointer ${
                        rem.isCompleted
                          ? "bg-emerald-600 border-emerald-600 text-white"
                          : "border-slate-300 hover:border-[#C9A24B] text-transparent hover:text-slate-300"
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4 fill-current" />
                    </button>

                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {getCategoryLabel(rem.category)}
                        </span>
                        {getPriorityBadge(rem.priority)}
                        {rem.status === "SNOOZED" && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                            Snoozed
                          </span>
                        )}
                        {isOverdue && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Overdue
                          </span>
                        )}
                      </div>

                      <h4 className={`text-base font-semibold text-slate-900 ${rem.isCompleted ? "line-through text-slate-500" : ""}`}>
                        {rem.title}
                      </h4>

                      {rem.description && (
                        <p className="text-xs text-slate-600 leading-relaxed font-normal">{rem.description}</p>
                      )}

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          Due: {new Date(rem.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          {rem.dueTime ? ` at ${rem.dueTime}` : ""}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          Assignee: {rem.assignedTo}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    {!rem.isCompleted && (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleSnooze(rem.id, 60)}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Snooze for 1 hour"
                        >
                          Snooze 1h
                        </button>
                        <button
                          onClick={() => handleSnooze(rem.id, 24 * 60)}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Snooze until tomorrow"
                        >
                          Tomorrow
                        </button>
                      </div>
                    )}
                    <button
                      onClick={() => handleToggleComplete(rem.id)}
                      className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                        rem.isCompleted
                          ? "bg-slate-100 hover:bg-slate-200 text-slate-700"
                          : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                      }`}
                    >
                      {rem.isCompleted ? "Reopen" : "Mark Complete"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Reminder Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-slate-200">
            <h3 className="text-2xl font-serif font-bold text-[#0B1F3A] mb-5">Create New Reminder</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Reminder Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Submit Rejoinder in Special Civil Suit"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full text-xs sm:text-sm px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#C9A24B] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full text-xs sm:text-sm px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#C9A24B] outline-none bg-white"
                >
                  <option value="HEARING">Court Hearing</option>
                  <option value="FILING_DEADLINE">Filing Deadline</option>
                  <option value="CASE_FOLLOW_UP">Case Follow-up</option>
                  <option value="CLIENT_FOLLOW_UP">Client Follow-up</option>
                  <option value="DOCUMENT_SUBMISSION">Document Submission</option>
                  <option value="PAYMENT">Payment Follow-up</option>
                  <option value="TASK">Legal Task</option>
                  <option value="PERSONAL">Chambers / Personal</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Due Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full text-xs sm:text-sm px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#C9A24B] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Due Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 11:30 AM"
                    value={formData.dueTime}
                    onChange={(e) => setFormData({ ...formData, dueTime: e.target.value })}
                    className="w-full text-xs sm:text-sm px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#C9A24B] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full text-xs sm:text-sm px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#C9A24B] outline-none bg-white"
                  >
                    <option value="LOW">Low</option>
                    <option value="NORMAL">Normal</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Assigned Lawyer / Staff</label>
                  <input
                    type="text"
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                    className="w-full text-xs sm:text-sm px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#C9A24B] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Description / Notes</label>
                <textarea
                  rows={3}
                  placeholder="Additional context or courtroom instructions..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full text-xs sm:text-sm px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#C9A24B] outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#0B1F3A] hover:bg-[#142d52] rounded-xl transition-colors shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? "Creating..." : "Save Reminder"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
