import React from "react";
import { prisma } from "@/lib/prisma";
import { ExpensesManager } from "@/components/portal/ExpensesManager";

export const metadata = {
  title: "Chambers Expenses | Legalex Portal",
  description: "Track firm expenditures, court fees, printing, and advocate transit costs.",
};

export default async function ExpensesPage() {
  const expenses = await prisma.expense.findMany({
    orderBy: { expenseDate: "desc" },
  });

  const serialized = expenses.map((e) => ({
    ...e,
    expenseDate: e.expenseDate.toISOString(),
    createdAt: e.createdAt.toISOString(),
  }));

  return <ExpensesManager initialExpenses={serialized as any} />;
}
