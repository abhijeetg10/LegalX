import React from "react";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { HearingsManager } from "@/components/portal/HearingsManager";

export default async function HearingsPage() {
  const session = await getServerSession(authOptions);
  const userRole = (session?.user as any)?.role || "CLIENT";
  const userId = (session?.user as any)?.id;
  const userEmail = session?.user?.email;

  const isClient = userRole === "CLIENT";
  const isTeam = userRole === "TEAM_MEMBER";
  const isAdmin = userRole === "CLIENT_ADMIN" || userRole === "SUPER_ADMIN";

  let whereClause: any = {};
  if (isClient && userEmail) {
    whereClause = {
      case: {
        client: {
          user: { email: userEmail },
        },
      },
    };
  } else if (isTeam && userId) {
    whereClause = {
      case: {
        assignees: {
          some: { userId },
        },
      },
    };
  }

  const [hearings, cases] = await Promise.all([
    prisma.hearing.findMany({
      where: whereClause,
      include: {
        case: {
          select: {
            caseNumber: true,
            casingTitle: true,
            courtName: true,
            practiceArea: true,
            client: {
              select: {
                companyName: true,
                user: { select: { name: true, phone: true } },
              },
            },
          },
        },
      },
      orderBy: { hearingDate: "asc" },
    }),
    prisma.case.findMany({
      select: { id: true, caseNumber: true, casingTitle: true },
      orderBy: { caseNumber: "asc" },
    }),
  ]);

  return (
    <HearingsManager
      initialHearings={hearings}
      cases={cases}
      isAdmin={isAdmin}
      isClient={isClient}
    />
  );
}
