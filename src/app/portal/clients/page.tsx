import React from "react";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { Users, Search, Building, Phone, Mail, MapPin, Briefcase } from "lucide-react";

export default async function ClientsPage() {
  const session = await getServerSession(authOptions);
  const clients = await prisma.client.findMany({
    include: {
      user: { select: { name: true, email: true, phone: true } },
      cases: { select: { id: true, caseNumber: true, casingTitle: true, status: true } },
      invoices: { select: { totalAmount: true, paidAmount: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#071526]">
            Client Registry & KYC Records
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {clients.length} active enterprise & individual client accounts across Maharashtra
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((c) => {
          const totalBilled = c.invoices.reduce((acc, inv) => acc + inv.totalAmount, 0);
          return (
            <div
              key={c.id}
              className="bg-white rounded-3xl p-6 border border-[#E5E0D5] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0B1F3A] text-[#DFB75E] flex items-center justify-center font-bold text-sm">
                    {c.companyName ? c.companyName[0] : c.user?.name[0]}
                  </div>
                  <span className="font-mono text-xs font-bold text-[#C9A24B] bg-[#C9A24B]/10 px-2 py-0.5 rounded">
                    {c.clientCode}
                  </span>
                </div>

                <h3 className="font-serif text-base font-bold text-[#071526] line-clamp-1 mb-1">
                  {c.companyName || c.user?.name}
                </h3>
                <p className="text-xs text-gray-600 font-medium mb-3">
                  Contact: {c.user?.name}
                </p>

                <div className="space-y-1.5 text-xs text-gray-600 pb-4 border-b border-gray-100">
                  <p className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#C9A24B]" />
                    <span>{c.user?.phone || "+91 99220 00000"}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#C9A24B]" />
                    <span className="truncate">{c.user?.email}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#C9A24B]" />
                    <span>{c.city}, {c.state}</span>
                  </p>
                </div>

                <div className="pt-3 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-gray-400 block uppercase">Cases</span>
                    <span className="font-bold text-[#071526]">{c.cases.length} Matters</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block uppercase">Billed</span>
                    <span className="font-bold text-[#059669]">₹{totalBilled.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {c.cases.length > 0 && (
                <div className="pt-4 border-t border-gray-100 mt-4">
                  <Link
                    href={`/portal/cases/${c.cases[0].id}`}
                    className="text-xs font-bold text-[#0B1F3A] hover:text-[#C9A24B] flex items-center justify-between"
                  >
                    <span>Primary: {c.cases[0].caseNumber}</span>
                    <span>View Hub →</span>
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
