import React from "react";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DocumentsMasterView } from "@/components/portal/DocumentsMasterView";

export default async function DocumentsPage() {
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

  const [docs, cases] = await Promise.all([
    prisma.document.findMany({
      where: whereClause,
      include: {
        case: {
          select: {
            id: true,
            caseNumber: true,
            casingTitle: true,
            courtName: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.case.findMany({
      select: { id: true, caseNumber: true, casingTitle: true },
      orderBy: { caseNumber: "asc" },
    }),
  ]);

  return (
    <DocumentsMasterView
      initialDocs={docs as any}
      cases={cases}
      isAdmin={isAdmin}
      isClient={isClient}
    />
  );
}
