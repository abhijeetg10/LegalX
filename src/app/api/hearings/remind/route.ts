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

    const { hearingId, channel } = await req.json();

    const hearing = await prisma.hearing.findUnique({
      where: { id: hearingId },
      include: {
        case: {
          include: {
            client: {
              include: {
                user: { select: { name: true, phone: true, email: true } },
              },
            },
          },
        },
      },
    });

    if (!hearing) {
      return NextResponse.json({ error: "Hearing record not found" }, { status: 404 });
    }

    const clientName = hearing.case.client?.user?.name || "Client";
    const clientPhone = hearing.case.client?.user?.phone || "+91 99220 79879";
    const hearingDateFormatted = new Date(hearing.hearingDate).toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    // Console log for demo mode & structured for Twilio / MSG91 / SendGrid
    console.log(`\n======================================================`);
    console.log(`🔔 [LEGALEX HEARING REMINDER DISPATCHED]`);
    console.log(`Channel: ${channel || "ALL (WhatsApp + SMS + Email)"}`);
    console.log(`Client: ${clientName} (${clientPhone})`);
    console.log(`Case: ${hearing.case.caseNumber} - ${hearing.case.casingTitle}`);
    console.log(`Hearing Date: ${hearingDateFormatted} at ${hearing.courtRoom || "Court Hall #1"}`);
    console.log(`Court: ${hearing.case.courtName}`);
    console.log(`Purpose: ${hearing.purpose}`);
    console.log(`Advocate in Charge: Adv. Amit S. Rathi`);
    console.log(`Structured payload ready for WhatsApp Business API`);
    console.log(`======================================================\n`);

    // Create system notification
    await prisma.notification.create({
      data: {
        userId: (session.user as any).id,
        title: `Reminder Sent: ${hearing.case.caseNumber}`,
        message: `Hearing reminder for ${hearingDateFormatted} successfully dispatched to ${clientName}.`,
        link: `/portal/cases/${hearing.caseId}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Hearing reminder for ${hearing.case.caseNumber} dispatched to ${clientName} via ${channel || "WhatsApp/SMS"}. (Logged to server console)`,
    });
  } catch (error: any) {
    console.error("Hearing reminder error:", error);
    return NextResponse.json({ error: "Failed to dispatch reminder." }, { status: 500 });
  }
}
