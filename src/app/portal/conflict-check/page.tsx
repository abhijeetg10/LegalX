import React from "react";
import { prisma } from "@/lib/prisma";
import { ConflictCheckManager } from "@/components/portal/ConflictCheckManager";

export const metadata = {
  title: "Conflict of Interest Check | Legalex Portal",
  description: "Screen prospective briefs, clients, and opposite parties against firm matters.",
};

export default async function ConflictCheckPage() {
  const checks = await prisma.conflictCheck.findMany({
    orderBy: { createdAt: "desc" },
  });

  const serialized = checks.map((c) => ({
    ...c,
    createdAt: c.createdAt.toISOString(),
  }));

  return <ConflictCheckManager initialChecks={serialized as any} />;
}
