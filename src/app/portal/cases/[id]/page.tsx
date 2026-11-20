import React from "react";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CaseDetailHub } from "@/components/portal/CaseDetailHub";

export default async function CaseDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const { tab } = await searchParams;
  const session = await getServerSession(authOptions);
  const userRole = (session?.user as any)?.role || "CLIENT";
  const isAdmin = userRole === "CLIENT_ADMIN" || userRole === "SUPER_ADMIN";
  const isClient = userRole === "CLIENT";

  const caseRecord = await prisma.case.findUnique({
    where: { id },
    include: {
      client: {
        include: {
          user: { select: { name: true, email: true, phone: true } },
          cases: { select: { id: true, caseNumber: true, casingTitle: true, status: true } },
        },
      },
      assignees: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              role: true,
              teamProfile: true,
            },
          },
        },
      },
      hearings: {
        orderBy: { hearingDate: "desc" },
      },
      documents: {
        orderBy: { createdAt: "desc" },
      },
      invoices: {
        include: {
          items: true,
          payments: true,
        },
        orderBy: { issueDate: "desc" },
      },
      timelineEvents: {
        orderBy: { eventDate: "desc" },
      },
    },
  });

  if (!caseRecord) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <CaseDetailHub
        initialCase={caseRecord}
        initialTab={tab || "details"}
        isAdmin={isAdmin}
        isClient={isClient}
        currentUserRole={userRole}
      />
    </div>
  );
}
