import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET available upcoming slots
export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const availableSlots = await prisma.appointmentSlot.findMany({
      where: {
        date: { gte: today },
        isBooked: false,
      },
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
      take: 40,
    });

    return NextResponse.json({ slots: availableSlots });
  } catch (error: any) {
    console.error("Failed to fetch slots:", error);
    return NextResponse.json({ error: "Failed to fetch appointment slots." }, { status: 500 });
  }
}

// POST to book a specific slot
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { slotId, clientName, clientEmail, clientPhone, practiceArea, mode, notes } = body;

    if (!slotId || !clientName || !clientEmail || !clientPhone) {
      return NextResponse.json(
        { error: "Slot ID, Client Name, Email, and Phone are required." },
        { status: 400 }
      );
    }

    // Verify slot is still open
    const slot = await prisma.appointmentSlot.findUnique({
      where: { id: slotId },
    });

    if (!slot || slot.isBooked) {
      return NextResponse.json(
        { error: "The selected time slot is no longer available. Please select another slot." },
        { status: 409 }
      );
    }

    // Book the slot
    const updatedSlot = await prisma.appointmentSlot.update({
      where: { id: slotId },
      data: {
        isBooked: true,
        clientName: clientName.trim(),
        clientEmail: clientEmail.trim().toLowerCase(),
        clientPhone: clientPhone.trim(),
        practiceArea: practiceArea || "General Litigation",
        mode: mode || "In-Person Office (Pune)",
        notes: notes ? notes.trim() : null,
      },
    });

    console.log(`[APPOINTMENT BOOKED] ${updatedSlot.startTime} on ${updatedSlot.date.toDateString()} by ${clientName} (${clientPhone})`);

    return NextResponse.json({
      success: true,
      message: "Consultation appointment confirmed successfully.",
      appointment: updatedSlot,
    });
  } catch (error: any) {
    console.error("Failed to book appointment:", error);
    return NextResponse.json({ error: "Failed to confirm booking." }, { status: 500 });
  }
}
