"use client";

import React, { useState } from "react";
import { PortalSidebar } from "@/components/portal/PortalSidebar";
import { PortalHeader } from "@/components/portal/PortalHeader";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8F6F1] flex">
      {/* Sidebar */}
      <PortalSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Container */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 min-w-0 ${
          collapsed ? "pl-20" : "pl-64"
        }`}
      >
        <PortalHeader collapsed={collapsed} />

        {/* Content Outlet */}
        <main className="flex-1 pt-16 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
