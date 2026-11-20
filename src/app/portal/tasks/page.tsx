import React from "react";
import { prisma } from "@/lib/prisma";
import { TasksManager } from "@/components/portal/TasksManager";

export const metadata = {
  title: "Tasks & Legal Operations | Legalex Portal",
  description: "Manage legal action items, pleadings drafting, and courtroom research.",
};

export default async function TasksPage() {
  const tasks = await prisma.task.findMany({
    orderBy: { createdAt: "desc" },
  });

  const serialized = tasks.map((t) => ({
    ...t,
    dueDate: t.dueDate ? t.dueDate.toISOString() : null,
    createdAt: t.createdAt.toISOString(),
  }));

  return <TasksManager initialTasks={serialized as any} />;
}
