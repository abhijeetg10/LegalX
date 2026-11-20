import React from "react";
import prisma from "@/lib/prisma";
import { History, ShieldCheck, User, Clock } from "lucide-react";

export default async function AuditLogsPage() {
  const logs = await prisma.auditLog.findMany({
    include: {
      user: { select: { name: true, email: true, role: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-[#071526]">
          Chambers Security & Audit Trail
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Immutable event log tracking user logins, document uploads, and case record modifications
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#E5E0D5] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-[10px] uppercase font-bold text-gray-400 bg-[#F8F6F1]">
                <th className="py-3 px-5">Timestamp</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/80">
                  <td className="py-3.5 px-5 font-mono text-gray-500 text-[11px]">
                    {new Date(log.createdAt).toLocaleString("en-IN")}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#0B1F3A]">
                    <span className="px-2 py-0.5 rounded bg-[#0B1F3A]/10 text-[#0B1F3A] font-mono text-[10px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#071526]">
                    {log.user?.name || "System"}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] text-gray-500 font-semibold">
                      {log.user?.role || "SYSTEM"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-gray-700">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
