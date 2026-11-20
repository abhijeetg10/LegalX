import React from "react";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { siteConfig } from "@/config/site";
import Link from "next/link";
import {
  Briefcase,
  Scale,
  Calendar,
  Receipt,
  ShieldCheck,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  FileText,
  UserCheck,
} from "lucide-react";
import { DashboardCharts } from "@/components/portal/DashboardCharts";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userRole = (session?.user as any)?.role || "CLIENT";
  const userId = (session?.user as any)?.id;
  const userEmail = session?.user?.email;

  const isClient = userRole === "CLIENT";
  const isTeam = userRole === "TEAM_MEMBER";
  const isAdmin = userRole === "CLIENT_ADMIN" || userRole === "SUPER_ADMIN";

  // Build query filters based on role
  let caseWhere: any = {};
  if (isClient && userEmail) {
    caseWhere = {
      client: {
        user: { email: userEmail },
      },
    };
  } else if (isTeam && userId) {
    caseWhere = {
      assignees: {
        some: { userId },
      },
    };
  }

  // Fetch metrics
  let totalCases = 0;
  let activeCases = 0;
  let completedCases = 0;
  let upcomingHearings: any[] = [];
  let pendingInvoices: any[] = [];
  let recentCases: any[] = [];
  let practiceAreaCounts: { name: string; value: number }[] = [];

  try {
    const [
      dbTotal,
      dbActive,
      dbCompleted,
      hearings,
      invoices,
      cases,
      civilCount,
      revCount,
      consCount,
      crimCount,
      mactCount,
    ] = await Promise.all([
      prisma.case.count({ where: caseWhere }),
      prisma.case.count({ where: { ...caseWhere, status: "ACTIVE" } }),
      prisma.case.count({ where: { ...caseWhere, status: "COMPLETED" } }),
      prisma.hearing.findMany({
        where: {
          isCompleted: false,
          case: caseWhere,
        },
        include: {
          case: {
            select: { caseNumber: true, casingTitle: true, courtName: true },
          },
        },
        orderBy: { hearingDate: "asc" },
        take: 5,
      }),
      prisma.invoice.findMany({
        where: {
          status: { in: ["ISSUED", "PARTIALLY_PAID", "OVERDUE"] },
          case: caseWhere,
        },
        include: {
          case: { select: { caseNumber: true, casingTitle: true } },
          client: { select: { companyName: true, clientCode: true } },
        },
        orderBy: { dueDate: "asc" },
        take: 4,
      }),
      prisma.case.findMany({
        where: caseWhere,
        include: {
          client: { select: { companyName: true, clientCode: true } },
        },
        orderBy: { updatedAt: "desc" },
        take: 5,
      }),
      prisma.case.count({ where: { ...caseWhere, practiceArea: "CIVIL_AND_FAMILY" } }),
      prisma.case.count({ where: { ...caseWhere, practiceArea: "REVENUE" } }),
      prisma.case.count({ where: { ...caseWhere, practiceArea: "CONSUMER" } }),
      prisma.case.count({ where: { ...caseWhere, practiceArea: "CRIMINAL" } }),
      prisma.case.count({ where: { ...caseWhere, practiceArea: "MACT" } }),
    ]);

    totalCases = dbTotal;
    activeCases = dbActive;
    completedCases = dbCompleted;
    upcomingHearings = hearings;
    pendingInvoices = invoices;
    recentCases = cases;

    practiceAreaCounts = [
      { name: "Civil & Family", value: civilCount || 14 },
      { name: "Land Revenue", value: revCount || 18 },
      { name: "Consumer", value: consCount || 12 },
      { name: "Criminal Defence", value: crimCount || 11 },
      { name: "MACT Claims", value: mactCount || 10 },
    ];

    if (isAdmin) {
      activeCases = Math.max(activeCases, siteConfig.stats.activeCases);
      completedCases = Math.max(completedCases, siteConfig.stats.completedCases);
      totalCases = activeCases + completedCases;
    }
  } catch (err) {
    console.error("Dashboard metrics fetch error:", err);
  }

  return (
    <div className="space-y-10">
      {/* Top Welcome Banner */}
      <div className="bg-[#0B1F3A] rounded-2xl p-7 sm:p-9 text-white border border-[#C9A24B]/30 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#C9A24B]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold bg-[#132B4F] text-[#DFB75E] border border-[#C9A24B]/40 uppercase tracking-wider">
              <Scale className="w-3 h-3 text-[#DFB75E]" />
              {userRole === "CLIENT_ADMIN"
                ? "Chambers Management Desk • Adv. Amit S. Rathi"
                : userRole === "TEAM_MEMBER"
                ? "Advocate Trial Desk • Team Legalex"
                : userRole === "SUPER_ADMIN"
                ? "Super Administrator Root Controls"
                : "Client Case Tracking Portal"}
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              Welcome back, {session?.user?.name || "Counsel"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-light leading-relaxed">
              {isAdmin
                ? "Monitoring all firm litigation across Maharashtra, cause list schedules, certified orders, and billing collections."
                : isTeam
                ? "Assigned case hearings, pending cross-examinations, and certified order uploads."
                : "Live status of your court proceedings, listed hearings, verified documents, and billing statements."}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {isAdmin && (
              <Link
                href="/portal/cases"
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#DFB75E] to-[#C9A24B] text-[#071526] font-bold text-xs hover:from-[#E6C372] hover:to-[#DFB75E] transition-all shadow-md hover:shadow-lg"
              >
                + Register New Case
              </Link>
            )}
            <Link
              href="/portal/hearings"
              className="px-5 py-3 rounded-xl bg-[#132B4F] hover:bg-[#1D3B66] text-white border border-[#C9A24B]/35 text-xs font-semibold transition-all flex items-center gap-2 shadow-sm"
            >
              <Calendar className="w-3.5 h-3.5 text-[#DFB75E]" />
              <span>Cause List Calendar</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-6 border border-[#E2DDD3] shadow-sm hover:border-[#C9A24B]/50 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
            <span className="font-semibold text-slate-700">Active Matters</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-3xl font-bold text-[#071526]">
            {activeCases.toLocaleString()}
          </div>
          <p className="text-[11px] text-emerald-700 font-medium mt-1.5 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {isClient ? "Your active suits" : "Active across Maharashtra"}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#E2DDD3] shadow-sm hover:border-[#C9A24B]/50 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
            <span className="font-semibold text-slate-700">Completed Decrees</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-3xl font-bold text-[#071526]">
            {completedCases.toLocaleString()}
          </div>
          <p className="text-[11px] text-blue-700 font-medium mt-1.5">
            Concluded decrees & orders
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#E2DDD3] shadow-sm hover:border-[#C9A24B]/50 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
            <span className="font-semibold text-slate-700">Upcoming Hearings</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-3xl font-bold text-[#071526]">
            {upcomingHearings.length}
          </div>
          <p className="text-[11px] text-amber-700 font-medium mt-1.5">
            Listed on court board
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#E2DDD3] shadow-sm hover:border-[#C9A24B]/50 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
            <span className="font-semibold text-slate-700">Pending Invoices</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-3xl font-bold text-[#071526]">
            {pendingInvoices.length}
          </div>
          <p className="text-[11px] text-rose-700 font-medium mt-1.5">
            Awaiting fee clearance
          </p>
        </div>
      </div>

      {/* Interactive Charts (Practice Areas & Invoices) */}
      <DashboardCharts
        practiceData={practiceAreaCounts}
        activeCount={activeCases}
        completedCount={completedCases}
      />

      {/* Split Section: Upcoming Hearings & Recent Cases */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Upcoming Hearings */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-7 border border-[#E2DDD3] shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
            <div>
              <h2 className="font-serif text-lg font-bold text-[#071526]">
                Upcoming Court Hearings & Board
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Scheduled courtroom appearances & cause lists
              </p>
            </div>
            <Link
              href="/portal/hearings"
              className="text-xs font-bold text-[#0B1F3A] hover:text-[#9C7728] flex items-center gap-1 transition-colors"
            >
              Full Calendar <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3.5">
            {upcomingHearings.length === 0 ? (
              <p className="text-xs text-slate-500 py-8 text-center font-normal">
                No hearings listed on board for the next 7 days.
              </p>
            ) : (
              upcomingHearings.map((h) => {
                const hDate = new Date(h.hearingDate);
                return (
                  <div
                    key={h.id}
                    className="p-4 sm:p-5 rounded-xl bg-[#F8F6F1] border border-[#E2DDD3] flex items-start justify-between gap-4 hover:border-[#C9A24B]/60 transition-all"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-[#0B1F3A] text-white flex flex-col items-center justify-center shrink-0 shadow-sm">
                        <span className="text-[10px] uppercase font-bold text-[#DFB75E]">
                          {hDate.toLocaleDateString("en-US", { month: "short" })}
                        </span>
                        <span className="font-serif text-base font-bold leading-none mt-0.5">
                          {hDate.getDate()}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#071526]">
                            {h.case.caseNumber}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold">
                            {h.courtRoom || "Court Hall #1"}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-[#0B1F3A] line-clamp-1">
                          {h.case.casingTitle}
                        </p>
                        <p className="text-[11px] text-slate-500 line-clamp-1">
                          <strong>Purpose:</strong> {h.purpose}
                        </p>
                      </div>
                    </div>

                    <Link
                      href={`/portal/cases/${h.caseId}?tab=details`}
                      className="text-xs font-bold text-[#9C7728] hover:underline shrink-0 pt-1"
                    >
                      View Case →
                    </Link>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Pending Invoices / Billing Snapshot */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-7 border border-[#E2DDD3] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <h2 className="font-serif text-lg font-bold text-[#071526]">
                  Billing & Fee Notes
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Retainers & tax invoices awaiting clearance
                </p>
              </div>
              <Link
                href="/portal/invoices"
                className="text-xs font-bold text-[#0B1F3A] hover:text-[#9C7728] flex items-center gap-1 transition-colors"
              >
                Invoices <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {pendingInvoices.length === 0 ? (
                <p className="text-xs text-slate-500 py-8 text-center font-normal">
                  All billed retainers are fully settled.
                </p>
              ) : (
                pendingInvoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="p-4 rounded-xl bg-[#F8F6F1] border border-[#E2DDD3] flex items-center justify-between gap-3 hover:border-[#C9A24B]/60 transition-all"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-mono text-xs font-bold text-[#071526]">
                          {inv.invoiceNumber}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            inv.status === "OVERDUE"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {inv.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 line-clamp-1">
                        {inv.client?.companyName || "Client"}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-[#071526] block">
                        ₹{inv.totalAmount.toLocaleString("en-IN")}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Due: {new Date(inv.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between text-xs">
            <span className="text-slate-500">GST Compliance</span>
            <span className="font-semibold text-slate-700">18% HSN 9982 (Legal Services)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
