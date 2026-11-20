import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: caseId } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { hearingDate, courtRoom, purpose, nextSteps } = body;

    if (!hearingDate || !purpose) {
      return NextResponse.json({ error: "Hearing date and purpose are required." }, { status: 400 });
    }

    const hearing = await prisma.hearing.create({
      data: {
        caseId,
        hearingDate: new Date(hearingDate),
        courtRoom: courtRoom || "Court Hall #1",
        purpose: purpose.trim(),
        nextSteps: nextSteps ? nextSteps.trim() : null,
        isCompleted: false,
      },
    });

    // Update case nextHearingDate
    await prisma.case.update({
      where: { id: caseId },
      data: {
        nextHearingDate: new Date(hearingDate),
        status: "HEARING_SCHEDULED",
      },
    });

    // Timeline entry
    await prisma.caseTimeline.create({
      data: {
        caseId,
        title: `Hearing Scheduled: ${purpose}`,
        description: `Listed on ${new Date(hearingDate).toLocaleDateString("en-IN")} at ${courtRoom || "Court Hall #1"}.`,
        eventDate: new Date(hearingDate),
        eventType: "HEARING",
      },
    });

    return NextResponse.json({ success: true, hearing });
  } catch (error: any) {
    console.error("Create hearing error:", error);
    return NextResponse.json({ error: "Failed to create hearing." }, { status: 500 });
  }
}
