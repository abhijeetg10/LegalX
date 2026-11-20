import React from "react";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { InvoicesManager } from "@/components/portal/InvoicesManager";

export default async function InvoicesPage() {
  const session = await getServerSession(authOptions);
  const userRole = (session?.user as any)?.role || "CLIENT";
  const userId = (session?.user as any)?.id;
  const userEmail = session?.user?.email;

  const isClient = userRole === "CLIENT";
  const isAdmin = userRole === "CLIENT_ADMIN" || userRole === "SUPER_ADMIN";

  let whereClause: any = {};
  if (isClient && userEmail) {
    whereClause = {
      client: {
        user: { email: userEmail },
      },
    };
  }

  const [invoices, clients, cases] = await Promise.all([
    prisma.invoice.findMany({
      where: whereClause,
      include: {
        case: { select: { id: true, caseNumber: true, casingTitle: true } },
        client: { select: { id: true, companyName: true, clientCode: true, user: { select: { name: true } } } },
        items: true,
        payments: true,
      },
      orderBy: { issueDate: "desc" },
    }),
    isAdmin
      ? prisma.client.findMany({
          include: { user: { select: { name: true } } },
        })
      : Promise.resolve([]),
    isAdmin
      ? prisma.case.findMany({
          select: { id: true, caseNumber: true, casingTitle: true, clientId: true },
        })
      : Promise.resolve([]),
  ]);

  return (
    <InvoicesManager
      initialInvoices={invoices}
      clients={clients}
      cases={cases}
      isAdmin={isAdmin}
      isClient={isClient}
    />
  );
}
