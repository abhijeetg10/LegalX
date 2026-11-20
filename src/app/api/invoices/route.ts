import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const invoices = await prisma.invoice.findMany({
      include: {
        case: { select: { caseNumber: true, casingTitle: true } },
        client: { select: { companyName: true, clientCode: true, user: { select: { name: true } } } },
        items: true,
        payments: true,
      },
      orderBy: { issueDate: "desc" },
    });

    return NextResponse.json({ invoices });
  } catch (error: any) {
    console.error("Get invoices error:", error);
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { caseId, clientId, dueDate, items, notes } = body;

    if (!clientId || !items || !items.length) {
      return NextResponse.json({ error: "Client and at least one line item are required." }, { status: 400 });
    }

    // Calculate subtotal, 18% GST tax, total
    let subtotal = 0;
    const formattedItems = items.map((item: any) => {
      const qty = Number(item.quantity) || 1;
      const unitPrice = Number(item.unitPrice) || 0;
      const amount = qty * unitPrice;
      subtotal += amount;
      return {
        description: item.description,
        quantity: qty,
        unitPrice,
        amount,
      };
    });

    const taxPercent = 18.0;
    const taxAmount = (subtotal * taxPercent) / 100;
    const totalAmount = subtotal + taxAmount;

    // Generate Invoice Number
    const count = await prisma.invoice.count();
    const invoiceNumber = `INV-LX-2024-${String(count + 1).padStart(3, "0")}`;

    const newInvoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        caseId: caseId || null,
        clientId,
        issueDate: new Date(),
        dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        subtotal,
        taxPercent,
        taxAmount,
        totalAmount,
        paidAmount: 0,
        status: "ISSUED",
        notes: notes || "Standard Legal Fee Invoice under Legalex Chambers Retainer.",
        items: {
          create: formattedItems,
        },
      },
      include: {
        items: true,
        case: true,
        client: true,
      },
    });

    return NextResponse.json({ success: true, invoice: newInvoice });
  } catch (error: any) {
    console.error("Create invoice error:", error);
    return NextResponse.json({ error: "Failed to create invoice." }, { status: 500 });
  }
}
