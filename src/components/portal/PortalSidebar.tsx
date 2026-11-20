"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { RoleBadge } from "./RoleBadge";
import {
  Scale,
  LayoutDashboard,
  Briefcase,
  Calendar,
  FileText,
  Receipt,
  Users,
  UserCheck,
  CalendarClock,
  History,
  Settings,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Bell,
  CheckSquare,
  TrendingDown,
  ShieldAlert,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}

export function PortalSidebar({ collapsed, setCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = (session?.user as any)?.role || "CLIENT";
  const isAdmin = role === "SUPER_ADMIN" || role === "CLIENT_ADMIN";
  const isTeam = role === "TEAM_MEMBER";
  const isClient = role === "CLIENT";

  const navItems = [
    {
      label: "Dashboard",
      href: "/portal/dashboard",
      icon: <LayoutDashboard className="w-4 h-4" />,
      visible: true,
    },
    {
      label: isClient ? "My Cases" : "All Cases",
      href: "/portal/cases",
      icon: <Briefcase className="w-4 h-4" />,
      visible: true,
    },
    {
      label: "Hearing Calendar",
      href: "/portal/hearings",
      icon: <Calendar className="w-4 h-4" />,
      visible: true,
    },
    {
      label: "Chambers Reminders",
      href: "/portal/reminders",
      icon: <Bell className="w-4 h-4" />,
      visible: true,
    },
    {
      label: "Legal Tasks",
      href: "/portal/tasks",
      icon: <CheckSquare className="w-4 h-4" />,
      visible: !isClient,
    },
    {
      label: "Documents & Seals",
      href: "/portal/documents",
      icon: <FileText className="w-4 h-4" />,
      visible: true,
    },
    {
      label: "Billing & Invoices",
      href: "/portal/invoices",
      icon: <Receipt className="w-4 h-4" />,
      visible: true,
    },
    {
      label: "Chambers Expenses",
      href: "/portal/expenses",
      icon: <TrendingDown className="w-4 h-4" />,
      visible: isAdmin,
    },
    {
      label: "Conflict of Interest Check",
      href: "/portal/conflict-check",
      icon: <ShieldAlert className="w-4 h-4" />,
      visible: !isClient,
    },
    {
      label: "Client Registry",
      href: "/portal/clients",
      icon: <Users className="w-4 h-4" />,
      visible: !isClient,
    },
    {
      label: "Team Legalex",
      href: "/portal/team",
      icon: <UserCheck className="w-4 h-4" />,
      visible: isAdmin,
    },
    {
      label: "Bookings & Inquiries",
      href: "/portal/appointments",
      icon: <CalendarClock className="w-4 h-4" />,
      visible: isAdmin,
    },
    {
      label: "Security Audit Logs",
      href: "/portal/audit-logs",
      icon: <History className="w-4 h-4" />,
      visible: isAdmin,
    },
    {
      label: "Account Settings",
      href: "/portal/settings",
      icon: <Settings className="w-4 h-4" />,
      visible: true,
    },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen bg-[#071526] text-white border-r border-[#132B4F] flex flex-col justify-between transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Brand & Collapse Header */}
      <div>
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#132B4F]">
          {!collapsed ? (
            <Link href="/" className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="LEGALEX Law Solutions"
                className="h-7 w-auto object-contain"
              />
            </Link>
          ) : (
            <Link href="/" className="mx-auto" title="LEGALEX Law Solutions">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#DFB75E] to-[#C9A24B] flex items-center justify-center text-[#071526]">
                <Scale className="w-4 h-4 stroke-[2.5]" />
              </div>
            </Link>
          )}

          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#132B4F] transition-colors"
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Current User Role Pill */}
        {!collapsed && session?.user && (
          <div className="px-4 py-3 bg-[#0B1F3A]/70 border-b border-[#132B4F]">
            <div className="flex items-center justify-between">
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate">
                  {session.user.name}
                </p>
                <p className="text-[10px] text-gray-400 truncate">
                  {session.user.email}
                </p>
              </div>
              <RoleBadge role={role} />
            </div>
          </div>
        )}

        {/* Nav Links */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)]">
          {navItems
            .filter((item) => item.visible)
            .map((item) => {
              const isActive = pathname === item.href || (item.href !== "/portal/dashboard" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? "bg-[#132B4F] text-[#DFB75E] font-semibold border border-[#C9A24B]/30 shadow-sm"
                      : "text-gray-300 hover:bg-[#0B1F3A] hover:text-white"
                  } ${collapsed ? "justify-center" : ""}`}
                >
                  <span className={isActive ? "text-[#C9A24B]" : "text-gray-400"}>
                    {item.icon}
                  </span>
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
        </nav>
      </div>

      {/* Footer Info & Sign Out */}
      <div className="p-3 border-t border-[#132B4F] bg-[#071526] space-y-2">
        <Link
          href="/verify-document"
          title={collapsed ? "Public Document Verification" : undefined}
          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-gray-400 hover:text-[#DFB75E] hover:bg-[#0B1F3A] transition-colors ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-[#C9A24B]" />
          {!collapsed && <span>Public Document Verifier</span>}
        </Link>

        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          title={collapsed ? "Sign Out" : undefined}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors cursor-pointer ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
