"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Receipt,
  Plus,
  Search,
  Filter,
  CreditCard,
  Printer,
  X,
  Scale,
  CheckCircle2,
} from "lucide-react";

interface Props {
  initialInvoices: any[];
  clients: any[];
  cases: any[];
  isAdmin: boolean;
  isClient: boolean;
}

export function InvoicesManager({
  initialInvoices,
  clients,
  cases,
  isAdmin,
  isClient,
}: Props) {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  // Create invoice state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || "");
  const [selectedCaseId, setSelectedCaseId] = useState(cases[0]?.id || "");
  const [dueDate, setDueDate] = useState("");
  const [items, setItems] = useState([
    { description: "Legal Consultation & Brief Drafting", quantity: 1, unitPrice: 30000 },
  ]);

  // Payment state
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [activeInvoice, setActiveInvoice] = useState<any>(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("NEFT/RTGS");
  const [transactionRef, setTransactionRef] = useState("");
  const [recording, setRecording] = useState(false);

  // Receipt modal state
  const [receiptInvoice, setReceiptInvoice] = useState<any>(null);

  // Financial Stats
  const totalBilled = invoices.reduce((acc, inv) => acc + (inv.totalAmount || 0), 0);
  const totalPaid = invoices.reduce((acc, inv) => acc + (inv.paidAmount || 0), 0);
  const totalPending = Math.max(0, totalBilled - totalPaid);

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseId: selectedCaseId || undefined,
          clientId: selectedClientId,
          dueDate: dueDate || undefined,
          items,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create invoice");

      setInvoices([data.invoice, ...invoices]);
      setCreateModalOpen(false);
    } catch (err: any) {
      alert(err.message || "Failed to generate invoice");
    } finally {
      setCreating(false);
    }
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeInvoice) return;

    setRecording(true);
    try {
      const res = await fetch(`/api/invoices/${activeInvoice.id}/payment`, {
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

      const updated = invoices.map((inv) =>
        inv.id === activeInvoice.id ? data.invoice : inv
      );
      setInvoices(updated);
      setPaymentModalOpen(false);
    } catch (err: any) {
      alert(err.message || "Payment recording failed");
    } finally {
      setRecording(false);
    }
  };

  const filteredInvoices = invoices.filter((inv) => {
    const matchStatus = filterStatus === "ALL" || inv.status === filterStatus;
    const matchSearch =
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.client?.companyName?.toLowerCase().includes(search.toLowerCase()) ||
      inv.case?.caseNumber?.toLowerCase().includes(search.toLowerCase());

    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#071526]">
            Billing, Invoices & Retainer Ledger
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            GST-compliant legal invoicing and payment reconciliation
          </p>
        </div>

        {isAdmin && (
          <button
            type="button"
            onClick={() => setCreateModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#0B1F3A] hover:bg-[#132B4F] text-white text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#DFB75E]" />
            <span>Generate New Invoice</span>
          </button>
        )}
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#E5E0D5] shadow-sm">
          <span className="text-xs text-gray-500 font-semibold block mb-1">Total Legal Billing</span>
          <span className="font-serif text-2xl font-bold text-[#071526]">₹{totalBilled.toLocaleString()}</span>
          <p className="text-[10px] text-gray-400 mt-0.5">Cumulative retainers & court appearances</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E5E0D5] shadow-sm">
          <span className="text-xs text-gray-500 font-semibold block mb-1">Total Fees Collected</span>
          <span className="font-serif text-2xl font-bold text-[#059669]">₹{totalPaid.toLocaleString()}</span>
          <p className="text-[10px] text-emerald-600 mt-0.5">Credited to Chambers account</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E5E0D5] shadow-sm">
          <span className="text-xs text-gray-500 font-semibold block mb-1">Outstanding Receivables</span>
          <span className="font-serif text-2xl font-bold text-[#E11D48]">₹{totalPending.toLocaleString()}</span>
          <p className="text-[10px] text-rose-500 mt-0.5">Awaiting clearance</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 border border-[#E5E0D5] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search invoice #, client, case..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-[#F8F6F1] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C9A24B]"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto">
          {["ALL", "PAID", "ISSUED", "PARTIALLY_PAID", "OVERDUE"].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                filterStatus === s
                  ? "bg-[#0B1F3A] text-[#DFB75E]"
                  : "bg-[#F8F6F1] text-gray-700 hover:bg-gray-200"
              }`}
            >
              {s.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Invoice Table */}
      <div className="bg-white rounded-3xl border border-[#E5E0D5] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] uppercase tracking-wider text-gray-500 bg-[#F8F6F1]">
                <th className="py-3.5 px-5">Invoice Number</th>
                <th className="py-3.5 px-4">Client</th>
                <th className="py-3.5 px-4">Case Matter</th>
                <th className="py-3.5 px-4">Issue Date</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Paid</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-4 px-5 font-mono font-bold text-[#0B1F3A]">
                    {inv.invoiceNumber}
                  </td>
                  <td className="py-4 px-4 font-semibold text-[#071526]">
                    {inv.client?.companyName || inv.client?.user?.name || "Client"}
                  </td>
                  <td className="py-4 px-4 font-mono text-gray-600">
                    {inv.case?.caseNumber || "Retainer"}
                  </td>
                  <td className="py-4 px-4 text-gray-500">
                    {new Date(inv.issueDate).toLocaleDateString("en-IN")}
                  </td>
                  <td className="py-4 px-4 font-bold text-[#071526]">
                    ₹{inv.totalAmount.toLocaleString()}
                  </td>
                  <td className="py-4 px-4 font-bold text-[#059669]">
                    ₹{inv.paidAmount.toLocaleString()}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        inv.status === "PAID"
                          ? "bg-emerald-100 text-emerald-800"
                          : inv.status === "PARTIALLY_PAID"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setReceiptInvoice(inv)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-[#0B1F3A] hover:bg-gray-100"
                        title="Print / View Receipt"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      {inv.status !== "PAID" && (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveInvoice(inv);
                            setPaymentAmount(String(inv.totalAmount - inv.paidAmount));
                            setPaymentModalOpen(true);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#059669] text-white text-[11px] font-bold hover:bg-[#047857]"
                        >
                          Record Pay
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {paymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-[#E5E0D5] shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
              <h3 className="font-serif text-lg font-bold text-[#071526]">
                Record Fee Receipt ({activeInvoice?.invoiceNumber})
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
                  Amount Received (INR) *
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
                  <option value="Online">Online Gateway</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Transaction UTR / Reference
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
                  disabled={recording || !paymentAmount}
                  className="px-6 py-2 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold disabled:opacity-50"
                >
                  {recording ? "Recording..." : "Confirm & Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Receipt Modal */}
      {receiptInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-8 border-2 border-[#C9A24B] shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0B1F3A] text-[#DFB75E] flex items-center justify-center">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#071526]">
                    LEGALEX CHAMBERS
                  </h3>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                    Official Fee Invoice & Receipt
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setReceiptInvoice(null)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Invoice Reference:</span>
                <span className="font-mono font-bold text-[#071526]">{receiptInvoice.invoiceNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Client:</span>
                <span className="font-bold text-[#071526]">{receiptInvoice.client?.companyName || receiptInvoice.client?.user?.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Case Matter:</span>
                <span className="font-bold text-[#071526]">{receiptInvoice.case?.caseNumber || "Chambers Retainer"}</span>
              </div>

              <div className="p-4 rounded-xl bg-[#F8F6F1] space-y-1.5 pt-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>₹{receiptInvoice.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>GST (18%):</span>
                  <span>₹{receiptInvoice.taxAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#071526] pt-2 border-t border-gray-200">
                  <span>Total Amount:</span>
                  <span>₹{receiptInvoice.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-[#059669]">
                  <span>Paid to Date:</span>
                  <span>₹{receiptInvoice.paidAmount.toLocaleString()}</span>
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
                <span>Print Official Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
