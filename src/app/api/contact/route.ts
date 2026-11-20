import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { name, email, phone, subject, practiceArea, message } = data;

    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: "Please fill in all required fields (Name, Email, Phone, Message)." },
        { status: 400 }
      );
    }

    const inquiry = await prisma.contactInquiry.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        subject: subject || "General Inquiry",
        practiceArea: practiceArea || "General Litigation",
        message: message.trim(),
        status: "NEW",
      },
    });

    console.log(`[CONTACT INQUIRY RECEIVED] From: ${name} (${phone}) - Subject: ${subject}`);

    return NextResponse.json({
      success: true,
      message: "Your message has been securely delivered to Chambers Registry.",
      inquiryId: inquiry.id,
    });
  } catch (error: any) {
    console.error("Contact inquiry creation error:", error);
    return NextResponse.json({ error: "Failed to submit message." }, { status: 500 });
  }
}
