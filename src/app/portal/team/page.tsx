import React from "react";
import prisma from "@/lib/prisma";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { UserCheck, Mail, Phone, Scale, Award, Briefcase, Plus } from "lucide-react";

export default async function TeamManagementPage() {
  const teamMembers = await prisma.teamMember.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          avatar: true,
          isActive: true,
          assignedCases: { select: { id: true } },
        },
      },
    },
    orderBy: { order: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#071526]">
            Chambers Legal Team Management
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Adv. Amit S. Rathi + 7 Specialized Associates & Registry Officers
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            All 8 Roster Members Active
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {teamMembers.map((tm) => (
          <div
            key={tm.id}
            className="bg-white rounded-3xl p-5 border border-[#E5E0D5] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="aspect-[4/4] relative rounded-2xl overflow-hidden bg-gray-100 mb-4 border border-gray-200" style={{ position: "relative" }}>
                <Image
                  src={tm.user.avatar || siteConfig.founder.image}
                  alt={tm.user.name}
                  fill
                  className="object-cover"
                />
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-[#0B1F3A]/90 text-[#DFB75E] backdrop-blur-sm">
                  {tm.experienceYears} Yrs Exp
                </span>
              </div>

              <h3 className="font-serif text-base font-bold text-[#071526] mb-0.5">
                {tm.user.name}
              </h3>
              <p className="text-xs font-bold text-[#B88E33] mb-1">
                {tm.designation}
              </p>
              {tm.sanadNumber && (
                <p className="text-[11px] text-gray-500 font-mono mb-2">
                  Sanad: {tm.sanadNumber}
                </p>
              )}

              <p className="text-xs text-gray-600 line-clamp-3 mb-4 leading-relaxed">
                {tm.bio || tm.specialization}
              </p>
            </div>

            <div className="pt-3 border-t border-gray-100 space-y-1.5 text-xs text-gray-600">
              <div className="flex items-center justify-between text-[11px] text-gray-500 mb-2">
                <span>Caseload:</span>
                <span className="font-bold text-[#0B1F3A]">
                  {tm.user.assignedCases.length} Matters
                </span>
              </div>
              <div className="flex items-center gap-1.5 truncate text-[11px]">
                <Mail className="w-3 h-3 text-[#C9A24B] shrink-0" />
                <span className="truncate">{tm.user.email}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px]">
                <Phone className="w-3 h-3 text-[#C9A24B] shrink-0" />
                <span>{tm.user.phone || "+91 99220 79879"}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
