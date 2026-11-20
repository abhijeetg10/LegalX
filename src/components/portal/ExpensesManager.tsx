"use client";

import React, { useState } from "react";
import {
  Plus,
  Filter,
  Calendar,
  CreditCard,
  TrendingDown,
} from "lucide-react";

interface Expense {
  id: string;
  title: string;
  category: string;
  amount: number;
  expenseDate: string;
  caseId?: string | null;
  paidTo?: string | null;
  paymentMethod: string;
  description?: string | null;
  recordedBy: string;
}

interface ExpensesManagerProps {
  initialExpenses: Expense[];
}

export function ExpensesManager({ initialExpenses }: ExpensesManagerProps) {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "COURT_FEES",
    amount: "",
    expenseDate: new Date().toISOString().split("T")[0],
    paidTo: "",
    paymentMethod: "UPI",
    description: "",
  });

  const filteredExpenses = expenses.filter((e) => {
    if (categoryFilter !== "ALL" && e.category !== categoryFilter) return false;
    return true;
  });

  const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const courtFees = expenses
    .filter((e) => e.category === "COURT_FEES" || e.category === "FILING_FEES")
    .reduce((acc, curr) => acc + curr.amount, 0);
  const officeExpenses = expenses
    .filter((e) => e.category === "OFFICE_EXPENSES")
    .reduce((acc, curr) => acc + curr.amount, 0);
  const travelPrinting = expenses
    .filter((e) => e.category === "TRAVEL" || e.category === "PRINTING")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success && data.expense) {
        setExpenses((prev) => [data.expense, ...prev]);
        setIsModalOpen(false);
        setFormData({
          title: "",
          category: "COURT_FEES",
          amount: "",
          expenseDate: new Date().toISOString().split("T")[0],
          paidTo: "",
          paymentMethod: "UPI",
          description: "",
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case "COURT_FEES":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">Court Fees</span>;
      case "FILING_FEES":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">Filing Charges</span>;
      case "TRAVEL":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">Travel / Transit</span>;
      case "PRINTING":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">Paperbook Printing</span>;
      case "OFFICE_EXPENSES":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200">Office & Chambers</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-50 text-slate-800 border border-slate-200">Miscellaneous</span>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white p-7 sm:p-8 rounded-2xl border border-[#E2DDD3] shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-2 rounded-xl bg-[#C9A24B]/15 text-[#9C7728]">
              <TrendingDown className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0B1F3A]">Chambers Financial Expenses</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-light leading-relaxed">
            Track firm expenditures, court fee stamps, certified copy costs, advocate transit, and office overheads.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0B1F3A] hover:bg-[#142d52] text-white text-xs sm:text-sm font-bold transition-all shadow-md shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#DFB75E]" />
          Record Expense
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-[#E2DDD3] shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Disbursements</div>
          <div className="text-3xl font-serif font-bold text-slate-900 mt-1">₹{totalExpense.toLocaleString("en-IN")}</div>
          <div className="text-[11px] text-slate-400 mt-1">Across all categories</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#E2DDD3] shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Court & Filing Fees</div>
          <div className="text-3xl font-serif font-bold text-emerald-700 mt-1">₹{courtFees.toLocaleString("en-IN")}</div>
          <div className="text-[11px] text-slate-400 mt-1">Stamps & nazir charges</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#E2DDD3] shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Travel & Printing</div>
          <div className="text-3xl font-serif font-bold text-amber-700 mt-1">₹{travelPrinting.toLocaleString("en-IN")}</div>
          <div className="text-[11px] text-slate-400 mt-1">High Court & appearances</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#E2DDD3] shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-purple-700">Chambers Operations</div>
          <div className="text-3xl font-serif font-bold text-purple-700 mt-1">₹{officeExpenses.toLocaleString("en-IN")}</div>
          <div className="text-[11px] text-slate-400 mt-1">Utilities & research databases</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-[#E2DDD3] shadow-sm">
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs sm:text-sm bg-[#F8F6F1] border border-slate-200 rounded-xl px-3.5 py-2 focus:outline-none"
          >
            <option value="ALL">All Expenses</option>
            <option value="COURT_FEES">Court Fees</option>
            <option value="FILING_FEES">Filing Fees</option>
            <option value="TRAVEL">Travel / Conveyance</option>
            <option value="PRINTING">Printing & Paperbooks</option>
            <option value="OFFICE_EXPENSES">Office Expenses</option>
            <option value="MISCELLANEOUS">Miscellaneous</option>
          </select>
        </div>
        <span className="text-xs text-slate-500">{filteredExpenses.length} records</span>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-2xl border border-[#E2DDD3] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8F6F1] border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-4 px-6">Title / Purpose</th>
                <th className="py-4 px-5">Category</th>
                <th className="py-4 px-5">Date</th>
                <th className="py-4 px-5">Amount</th>
                <th className="py-4 px-5">Method & Payee</th>
                <th className="py-4 px-6">Recorded By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredExpenses.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-semibold text-slate-900">{e.title}</div>
                    {e.description && <div className="text-[11px] text-slate-500 mt-0.5">{e.description}</div>}
                  </td>
                  <td className="py-4 px-5">{getCategoryBadge(e.category)}</td>
                  <td className="py-4 px-5 text-slate-600 whitespace-nowrap">
                    {new Date(e.expenseDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="py-4 px-5 font-bold text-slate-900 whitespace-nowrap font-serif text-sm">
                    ₹{e.amount.toLocaleString("en-IN")}
                  </td>
                  <td className="py-4 px-5 text-slate-600">
                    <span className="font-semibold text-slate-800">{e.paymentMethod}</span>
                    {e.paidTo && <div className="text-[11px] text-slate-400">{e.paidTo}</div>}
                  </td>
                  <td className="py-4 px-6 text-slate-500">{e.recordedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-slate-200">
            <h3 className="text-2xl font-serif font-bold text-[#0B1F3A] mb-5">Record Chambers Expense</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Expense Title / Item *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Certified Copy of Revenue Mutation Entries"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full text-xs sm:text-sm px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#C9A24B] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full text-xs sm:text-sm px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#C9A24B] outline-none bg-white"
                  >
                    <option value="COURT_FEES">Court Fees</option>
                    <option value="FILING_FEES">Filing Fees</option>
                    <option value="TRAVEL">Travel / Transit</option>
                    <option value="PRINTING">Printing / Paperbooks</option>
                    <option value="OFFICE_EXPENSES">Office Expenses</option>
                    <option value="MISCELLANEOUS">Miscellaneous</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="2500"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full text-xs sm:text-sm px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#C9A24B] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Payment Method</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-full text-xs sm:text-sm px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#C9A24B] outline-none bg-white"
                  >
                    <option value="UPI">UPI / GPay</option>
                    <option value="CASH">Cash</option>
                    <option value="BANK_TRANSFER">Bank Transfer (NEFT/IMPS)</option>
                    <option value="CHEQUE">Cheque</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Paid To / Payee</label>
                  <input
                    type="text"
                    placeholder="e.g. Pune District Court Nazir"
                    value={formData.paidTo}
                    onChange={(e) => setFormData({ ...formData, paidTo: e.target.value })}
                    className="w-full text-xs sm:text-sm px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#C9A24B] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Disbursement Date</label>
                <input
                  type="date"
                  value={formData.expenseDate}
                  onChange={(e) => setFormData({ ...formData, expenseDate: e.target.value })}
                  className="w-full text-xs sm:text-sm px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#C9A24B] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Description / Bill Notes</label>
                <textarea
                  rows={2}
                  placeholder="Receipt or bill reference number..."
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
                  {isSubmitting ? "Recording..." : "Record Disbursement"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
