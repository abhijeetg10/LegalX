import React from "react";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CasesDataView } from "@/components/portal/CasesDataView";

export default async function CasesPage() {
  const session = await getServerSession(authOptions);
  const userRole = (session?.user as any)?.role || "CLIENT";
  const userId = (session?.user as any)?.id;
  const userEmail = session?.user?.email;

  const isClient = userRole === "CLIENT";
  const isTeam = userRole === "TEAM_MEMBER";
  const isAdmin = userRole === "CLIENT_ADMIN" || userRole === "SUPER_ADMIN";

  // Build query scope
  let whereClause: any = {};
  if (isClient && userEmail) {
    whereClause = {
      client: {
        user: { email: userEmail },
      },
    };
  } else if (isTeam && userId) {
    whereClause = {
      assignees: {
        some: { userId },
      },
    };
  }

  const [cases, clients] = await Promise.all([
    prisma.case.findMany({
      where: whereClause,
      include: {
        client: {
          select: {
            id: true,
            companyName: true,
            clientCode: true,
            city: true,
            user: { select: { name: true, phone: true } },
          },
        },
        assignees: {
          include: {
            user: { select: { name: true } },
          },
        },
      },
      orderBy: { filingDate: "desc" },
    }),
    isAdmin
      ? prisma.client.findMany({
          include: { user: { select: { name: true } } },
          take: 50,
        })
      : Promise.resolve([]),
  ]);

  return (
    <div className="space-y-6">
      <CasesDataView
        initialCases={cases}
        clients={clients}
        isAdmin={isAdmin}
        isClient={isClient}
      />
    </div>
  );
}
