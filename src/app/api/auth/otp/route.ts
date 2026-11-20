import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email address is required." }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      return NextResponse.json({ error: "No account found registered under this email." }, { status: 404 });
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.user.update({
      where: { id: user.id },
      data: {
        otpCode,
        otpExpiresAt,
      },
    });

    // Console log for demo mode & ready for SMS/Email webhook integration
    console.log(`\n======================================================`);
    console.log(`🔐 [LEGALEX DEMO OTP GATEWAY]`);
    console.log(`Recipient: ${user.name} <${user.email}>`);
    console.log(`Security Code: ${otpCode}`);
    console.log(`Expires At: ${otpExpiresAt.toISOString()}`);
    console.log(`Structured payload ready for SendGrid / Twilio / MSG91`);
    console.log(`======================================================\n`);

    return NextResponse.json({
      success: true,
      message: `OTP has been generated and sent to ${user.email}. (Demo Code logged to terminal: ${otpCode})`,
      demoOtp: otpCode, // Provided for instant 1-click preview convenience
    });
  } catch (error: any) {
    console.error("Error generating OTP:", error);
    return NextResponse.json({ error: "Failed to dispatch verification code." }, { status: 500 });
  }
}
