import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status");

    const where: any = {};
    if (category && category !== "ALL") {
      where.category = category;
    }
    if (status && status !== "ALL") {
      if (status === "OVERDUE") {
        where.status = "OVERDUE";
      } else if (status === "COMPLETED") {
        where.isCompleted = true;
      } else if (status === "SNOOZED") {
        where.status = "SNOOZED";
      } else if (status === "PENDING") {
        where.isCompleted = false;
        where.status = { not: "COMPLETED" };
      }
    }

    const reminders = await prisma.reminder.findMany({
      where,
      orderBy: { dueDate: "asc" },
    });

    return NextResponse.json({ success: true, reminders });
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
    const { title, description, category, caseId, clientId, assignedTo, dueDate, dueTime, priority } = body;

    if (!title || !dueDate) {
      return NextResponse.json({ success: false, error: "Title and due date are required" }, { status: 400 });
    }

    const reminder = await prisma.reminder.create({
      data: {
        title,
        description: description || null,
        category: category || "HEARING",
        caseId: caseId || null,
        clientId: clientId || null,
        assignedTo: assignedTo || "Adv. Amit S. Rathi",
        dueDate: new Date(dueDate),
        dueTime: dueTime || null,
        priority: priority || "NORMAL",
        status: "PENDING",
        isCompleted: false,
      },
    });

    return NextResponse.json({ success: true, reminder }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, action, snoozeMinutes } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Reminder ID required" }, { status: 400 });
    }

    if (action === "TOGGLE_COMPLETE") {
      const existing = await prisma.reminder.findUnique({ where: { id } });
      if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

      const updated = await prisma.reminder.update({
        where: { id },
        data: {
          isCompleted: !existing.isCompleted,
          status: !existing.isCompleted ? "COMPLETED" : "PENDING",
          completedAt: !existing.isCompleted ? new Date() : null,
        },
      });
      return NextResponse.json({ success: true, reminder: updated });
    }

    if (action === "SNOOZE") {
      const minutes = snoozeMinutes || 60;
      const snoozeDate = new Date(Date.now() + minutes * 60 * 1000);
      const updated = await prisma.reminder.update({
        where: { id },
        data: {
          status: "SNOOZED",
          snoozeUntil: snoozeDate,
        },
      });
      return NextResponse.json({ success: true, reminder: updated });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
