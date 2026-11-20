import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      caseNumber,
      casingTitle,
      practiceArea,
      courtName,
      judgeName,
      filingDate,
      status,
      stage,
      summary,
      internalNotes,
      clientId,
      nextHearingDate,
    } = body;

    if (!caseNumber || !casingTitle || !practiceArea || !courtName || !clientId) {
      return NextResponse.json(
        { error: "Case number, title, practice area, court name, and client are required." },
        { status: 400 }
      );
    }

    // Check duplicate case number
    const existing = await prisma.case.findUnique({
      where: { caseNumber: caseNumber.trim() },
    });
    if (existing) {
      return NextResponse.json({ error: "A case with this number already exists." }, { status: 409 });
    }

    const newCase = await prisma.case.create({
      data: {
        caseNumber: caseNumber.trim(),
        casingTitle: casingTitle.trim(),
        practiceArea,
        courtName: courtName.trim(),
        judgeName: judgeName ? judgeName.trim() : null,
        filingDate: filingDate ? new Date(filingDate) : new Date(),
        status: status || "ACTIVE",
        stage: stage || "Initial Filing & Registry Scrutiny",
        summary: summary || "New matter instituted in Chambers Registry.",
        internalNotes: internalNotes || null,
        clientId,
        nextHearingDate: nextHearingDate ? new Date(nextHearingDate) : null,
      },
    });

    // Add initial timeline event
    await prisma.caseTimeline.create({
      data: {
        caseId: newCase.id,
        title: "Matter Registered in Legalex Chambers",
        description: `Case ${newCase.caseNumber} registered by ${session.user.name}.`,
        eventDate: new Date(),
        eventType: "FILING",
      },
    });

    // Assign current user or founder
    await prisma.caseAssignee.create({
      data: {
        caseId: newCase.id,
        userId: (session.user as any).id,
        roleInCase: "Lead Counsel",
      },
    }).catch(() => {});

    return NextResponse.json({ success: true, case: newCase });
  } catch (error: any) {
    console.error("Create case error:", error);
    return NextResponse.json({ error: "Failed to create case." }, { status: 500 });
  }
}
