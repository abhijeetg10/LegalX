import React from "react";
import { prisma } from "@/lib/prisma";
import { RemindersManager } from "@/components/portal/RemindersManager";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const metadata = {
  title: "Chambers Reminders | Legalex Portal",
  description: "Comprehensive alert and reminder management for hearings, deadlines, and tasks.",
};

export default async function RemindersPage() {
  const session = await getServerSession(authOptions);

  const reminders = await prisma.reminder.findMany({
    orderBy: { dueDate: "asc" },
  });

  const serialized = reminders.map((r) => ({
    ...r,
    dueDate: r.dueDate.toISOString(),
    completedAt: r.completedAt ? r.completedAt.toISOString() : null,
    snoozeUntil: r.snoozeUntil ? r.snoozeUntil.toISOString() : null,
    createdAt: r.createdAt.toISOString(),
  }));

  return <RemindersManager initialReminders={serialized as any} />;
}
