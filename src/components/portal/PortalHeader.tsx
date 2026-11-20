"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { RoleBadge } from "./RoleBadge";
import {
  Bell,
  Search,
  ExternalLink,
  User,
  LogOut,
  Settings,
  ShieldAlert,
  CheckCircle,
} from "lucide-react";

export function PortalHeader({ collapsed }: { collapsed: boolean }) {
  const { data: session } = useSession();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const notifications = [
    {
      id: "n1",
      title: "Upcoming Hearing",
      msg: "RCS/101/2021 listed for Final Arguments tomorrow at Court Hall #2.",
      time: "10 mins ago",
      read: false,
    },
    {
      id: "n2",
      title: "Invoice Cleared",
      msg: "Payment received for INV-LX-2024-001 (₹35,400 via NEFT).",
      time: "2 hours ago",
      read: false,
    },
    {
      id: "n3",
      title: "Document Verified",
      msg: "Ad-Interim Stay Order digitally sealed under LX-2024-1001.",
      time: "1 day ago",
      read: true,
    },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header
      className={`fixed top-0 right-0 z-30 h-16 bg-white border-b border-[#E5E0D5] flex items-center justify-between px-6 transition-all duration-300 ${
        collapsed ? "left-20" : "left-64"
      }`}
    >
      {/* Global Quick Search */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search cases, client codes, court numbers, invoices..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-[#F8F6F1] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C9A24B] focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* View Public Website */}
        <Link
          href="/"
          target="_blank"
          className="hidden sm:flex items-center gap-1.5 text-xs text-gray-600 hover:text-[#0B1F3A] font-medium"
        >
          <span>Legalex Website</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#C9A24B]" />
        </Link>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E11D48] ring-2 ring-white animate-pulse" />
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 z-50 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="font-serif text-sm font-bold text-[#071526]">
                  Chambers Notifications
                </span>
                <span className="text-[10px] text-[#C9A24B] font-bold">
                  {unreadCount} Unread
                </span>
              </div>
              <div className="py-2 space-y-2 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-2.5 rounded-xl text-xs transition-colors ${
                      n.read ? "bg-gray-50 text-gray-500" : "bg-[#F8F6F1] text-gray-800 font-medium border border-[#E5E0D5]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-bold text-[#071526]">{n.title}</span>
                      <span className="text-[10px] text-gray-400">{n.time}</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">{n.msg}</p>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-gray-100 text-center">
                <Link
                  href="/portal/cases"
                  onClick={() => setNotificationsOpen(false)}
                  className="text-[11px] font-bold text-[#0B1F3A] hover:underline"
                >
                  View Case Updates →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill & Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-[#0B1F3A] text-[#DFB75E] flex items-center justify-center font-bold text-xs border border-[#C9A24B]">
              {session?.user?.name ? session.user.name[0] : "L"}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-[#071526] leading-none">
                {session?.user?.name || "User"}
              </p>
              <RoleBadge role={(session?.user as any)?.role} />
            </div>
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-200 p-2 z-50 animate-in fade-in">
              <div className="px-3 py-2 border-b border-gray-100">
                <p className="text-xs font-bold text-[#071526]">
                  {session?.user?.name}
                </p>
                <p className="text-[11px] text-gray-500 truncate">
                  {session?.user?.email}
                </p>
              </div>

              <div className="py-1">
                <Link
                  href="/portal/settings"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-[#F8F6F1] rounded-lg transition-colors"
                >
                  <Settings className="w-3.5 h-3.5 text-gray-400" />
                  Account Settings
                </Link>
              </div>

              <div className="pt-1 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-left"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
