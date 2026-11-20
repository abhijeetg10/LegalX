import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const expenses = await prisma.expense.findMany({
      orderBy: { expenseDate: "desc" },
    });
    return NextResponse.json({ success: true, expenses });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, category, amount, expenseDate, caseId, paidTo, paymentMethod, description, recordedBy } = body;

    if (!title || !amount || !category) {
      return NextResponse.json({ success: false, error: "Title, category, and amount are required" }, { status: 400 });
    }

    const expense = await prisma.expense.create({
      data: {
        title,
        category,
        amount: parseFloat(amount),
        expenseDate: expenseDate ? new Date(expenseDate) : new Date(),
        caseId: caseId || null,
        paidTo: paidTo || null,
        paymentMethod: paymentMethod || "CASH",
        description: description || null,
        recordedBy: recordedBy || session.user?.name || "Accounts Desk",
      },
    });

    return NextResponse.json({ success: true, expense }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
