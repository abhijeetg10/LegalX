import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, tasks });
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
    const { title, description, caseId, assignedTo, priority, dueDate } = body;

    if (!title) {
      return NextResponse.json({ success: false, error: "Title is required" }, { status: 400 });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description: description || null,
        caseId: caseId || null,
        assignedTo: assignedTo || "Adv. Amit S. Rathi",
        priority: priority || "NORMAL",
        status: "NOT_STARTED",
        dueDate: dueDate ? new Date(dueDate) : null,
        isCompleted: false,
      },
    });

    return NextResponse.json({ success: true, task }, { status: 201 });
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
    const { id, status, isCompleted } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Task ID required" }, { status: 400 });
    }

    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (isCompleted !== undefined) {
      updateData.isCompleted = isCompleted;
      if (isCompleted) updateData.status = "COMPLETED";
    }

    const task = await prisma.task.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, task });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
