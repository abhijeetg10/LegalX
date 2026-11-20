"use client";

import React, { useState } from "react";
import {
  CheckSquare,
  Clock,
  Plus,
  Filter,
  Briefcase,
  User,
  CheckCircle2,
  Calendar,
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  description?: string | null;
  caseId?: string | null;
  assignedTo: string;
  priority: string;
  status: string;
  dueDate?: string | null;
  isCompleted: boolean;
  createdAt: string;
}

interface TasksManagerProps {
  initialTasks: Task[];
}

export function TasksManager({ initialTasks }: TasksManagerProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignedTo: "Adv. Amit S. Rathi",
    priority: "NORMAL",
    dueDate: new Date().toISOString().split("T")[0],
  });

  const filteredTasks = tasks.filter((t) => {
    if (statusFilter === "ALL") return true;
    if (statusFilter === "COMPLETED") return t.isCompleted;
    if (statusFilter === "IN_PROGRESS") return t.status === "IN_PROGRESS";
    if (statusFilter === "PENDING") return !t.isCompleted;
    return true;
  });

  const handleToggleComplete = async (task: Task) => {
    try {
      const newCompleted = !task.isCompleted;
      const res = await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: task.id,
          isCompleted: newCompleted,
          status: newCompleted ? "COMPLETED" : "IN_PROGRESS",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTasks((prev) =>
          prev.map((t) => (t.id === task.id ? { ...t, isCompleted: newCompleted, status: newCompleted ? "COMPLETED" : "IN_PROGRESS" } : t))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const isCompleted = newStatus === "COMPLETED";
      const res = await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus, isCompleted }),
      });
      const data = await res.json();
      if (data.success) {
        setTasks((prev) =>
          prev.map((t) => (t.id === id ? { ...t, status: newStatus, isCompleted } : t))
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
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success && data.task) {
        setTasks((prev) => [data.task, ...prev]);
        setIsModalOpen(false);
        setFormData({
          title: "",
          description: "",
          assignedTo: "Adv. Amit S. Rathi",
          priority: "NORMAL",
          dueDate: new Date().toISOString().split("T")[0],
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white p-7 sm:p-8 rounded-2xl border border-[#E2DDD3] shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-2 rounded-xl bg-[#0B1F3A]/10 text-[#0B1F3A]">
              <CheckSquare className="w-5 h-5 text-[#9C7728]" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0B1F3A]">Legal Work & Task Operations</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-light leading-relaxed">
            Action items, pleadings drafting, court filings, and research assignments separated from alerts.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0B1F3A] hover:bg-[#142d52] text-white text-xs sm:text-sm font-bold transition-all shadow-md shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#DFB75E]" />
          Create Task
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-[#E2DDD3] shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Tasks</div>
          <div className="text-3xl font-serif font-bold text-slate-900 mt-1">{tasks.length}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#E2DDD3] shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-amber-700">In Progress</div>
          <div className="text-3xl font-serif font-bold text-amber-600 mt-1">
            {tasks.filter((t) => t.status === "IN_PROGRESS").length}
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#E2DDD3] shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Pending / Not Started</div>
          <div className="text-3xl font-serif font-bold text-slate-700 mt-1">
            {tasks.filter((t) => !t.isCompleted && t.status !== "IN_PROGRESS").length}
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#E2DDD3] shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Completed</div>
          <div className="text-3xl font-serif font-bold text-emerald-600 mt-1">
            {tasks.filter((t) => t.isCompleted).length}
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-[#E2DDD3] shadow-sm">
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs sm:text-sm bg-[#F8F6F1] border border-slate-200 rounded-xl px-3.5 py-2 focus:outline-none"
          >
            <option value="ALL">All Tasks</option>
            <option value="PENDING">Active / Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
        <span className="text-xs text-slate-500">{filteredTasks.length} tasks</span>
      </div>

      {/* Task List */}
      <div className="bg-white rounded-2xl border border-[#E2DDD3] shadow-sm overflow-hidden divide-y divide-slate-100">
        {filteredTasks.length === 0 ? (
          <div className="p-16 text-center text-slate-500 text-sm">No legal tasks found.</div>
        ) : (
          filteredTasks.map((t) => (
            <div
              key={t.id}
              className={`p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 transition-colors hover:bg-slate-50/70 ${
                t.isCompleted ? "opacity-60 bg-slate-50/40" : ""
              }`}
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => handleToggleComplete(t)}
                  className={`mt-1 flex-shrink-0 w-6 h-6 rounded-lg border flex items-center justify-center transition-colors cursor-pointer ${
                    t.isCompleted
                      ? "bg-emerald-600 border-emerald-600 text-white"
                      : "border-slate-300 hover:border-[#C9A24B] text-transparent hover:text-slate-300"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 fill-current" />
                </button>

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    {getPriorityBadge(t.priority)}
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        t.status === "COMPLETED"
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : t.status === "IN_PROGRESS"
                          ? "bg-amber-50 text-amber-800 border border-amber-200"
                          : "bg-slate-50 text-slate-700 border border-slate-200"
                      }`}
                    >
                      {t.status.replace("_", " ")}
                    </span>
                  </div>

                  <h4 className={`text-base font-semibold text-slate-900 ${t.isCompleted ? "line-through text-slate-500" : ""}`}>
                    {t.title}
                  </h4>

                  {t.description && <p className="text-xs text-slate-600 leading-relaxed font-normal">{t.description}</p>}

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                    {t.dueDate && (
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Target: {new Date(t.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      Assigned: {t.assignedTo}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                <select
                  value={t.status}
                  onChange={(e) => handleStatusChange(t.id, e.target.value)}
                  className="text-xs bg-[#F8F6F1] border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none"
                >
                  <option value="NOT_STARTED">Not Started</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-slate-200">
            <h3 className="text-2xl font-serif font-bold text-[#0B1F3A] mb-5">Create New Task</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Draft Written Statement in RCS 104/2024"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full text-xs sm:text-sm px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#C9A24B] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Assigned Advocate</label>
                  <input
                    type="text"
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                    className="w-full text-xs sm:text-sm px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#C9A24B] outline-none"
                  />
                </div>
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
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Target Completion Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full text-xs sm:text-sm px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#C9A24B] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Task Description / Instructions</label>
                <textarea
                  rows={3}
                  placeholder="Specific legal instructions, court room references, or statutory requirements..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full text-xs sm:text-sm px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#C9A24B] outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#0B1F3A] hover:bg-[#142d52] rounded-xl transition-colors shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? "Creating..." : "Save Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
