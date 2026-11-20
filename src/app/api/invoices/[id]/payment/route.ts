import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: invoiceId } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { amount, paymentMethod, transactionRef, notes } = body;

    const paymentAmount = Number(amount);
    if (!paymentAmount || paymentAmount <= 0) {
      return NextResponse.json({ error: "Valid payment amount is required." }, { status: 400 });
    }

    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found." }, { status: 404 });
    }

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        invoiceId,
        amount: paymentAmount,
        paymentDate: new Date(),
        paymentMethod: paymentMethod || "NEFT/RTGS",
        transactionRef: transactionRef || `REF-${Date.now().toString().slice(-6)}`,
        notes: notes || "Payment received and reconciled.",
      },
    });

    // Update invoice paid amount and status
    const newPaidAmount = invoice.paidAmount + paymentAmount;
    let newStatus = invoice.status;
    if (newPaidAmount >= invoice.totalAmount) {
      newStatus = "PAID";
    } else if (newPaidAmount > 0) {
      newStatus = "PARTIALLY_PAID";
    }

    const updatedInvoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        paidAmount: newPaidAmount,
        status: newStatus,
      },
      include: {
        items: true,
        payments: true,
      },
    });

    return NextResponse.json({
      success: true,
      payment,
      invoice: updatedInvoice,
    });
  } catch (error: any) {
    console.error("Record payment error:", error);
    return NextResponse.json({ error: "Failed to record payment." }, { status: 500 });
  }
}
