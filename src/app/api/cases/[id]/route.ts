import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const caseRecord = await prisma.case.findUnique({
      where: { id },
      include: {
        client: {
          include: {
            user: { select: { name: true, email: true, phone: true } },
          },
        },
        assignees: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
                teamProfile: true,
              },
            },
          },
        },
        hearings: {
          orderBy: { hearingDate: "desc" },
        },
        documents: {
          orderBy: { createdAt: "desc" },
        },
        invoices: {
          include: {
            items: true,
            payments: true,
          },
          orderBy: { issueDate: "desc" },
        },
        timelineEvents: {
          orderBy: { eventDate: "desc" },
        },
      },
    });

    if (!caseRecord) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    return NextResponse.json({ case: caseRecord });
  } catch (error: any) {
    console.error("Get case error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { status, stage, internalNotes, nextHearingDate, judgeName } = body;

    const updated = await prisma.case.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(stage && { stage }),
        ...(internalNotes !== undefined && { internalNotes }),
        ...(judgeName !== undefined && { judgeName }),
        ...(nextHearingDate && { nextHearingDate: new Date(nextHearingDate) }),
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: (session.user as any).id,
        action: "UPDATE_CASE",
        details: `Updated case ${updated.caseNumber}: stage=${stage || "same"}, status=${status || "same"}`,
      },
    }).catch(() => {});

    return NextResponse.json({ success: true, case: updated });
  } catch (error: any) {
    console.error("Update case error:", error);
    return NextResponse.json({ error: "Failed to update case." }, { status: 500 });
  }
}
