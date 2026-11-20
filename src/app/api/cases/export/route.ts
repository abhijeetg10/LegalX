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

    const cases = await prisma.case.findMany({
      include: {
        client: true,
      },
      orderBy: { filingDate: "desc" },
    });

    // Generate CSV string
    const headers = [
      "Case Number",
      "Title",
      "Practice Area",
      "Court / Forum",
      "Status",
      "Stage",
      "Filing Date",
      "Next Hearing Date",
      "Client Name",
      "Client Code",
      "City",
    ];

    const rows = cases.map((c) => [
      `"${c.caseNumber}"`,
      `"${c.casingTitle.replace(/"/g, '""')}"`,
      `"${c.practiceArea}"`,
      `"${c.courtName.replace(/"/g, '""')}"`,
      `"${c.status}"`,
      `"${c.stage}"`,
      `"${c.filingDate.toISOString().split("T")[0]}"`,
      `"${c.nextHearingDate ? c.nextHearingDate.toISOString().split("T")[0] : "N/A"}"`,
      `"${c.client.companyName || "N/A"}"`,
      `"${c.client.clientCode}"`,
      `"${c.client.city}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    return new Response(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="legalex-cases-export-${Date.now()}.csv"`,
      },
    });
  } catch (error: any) {
    console.error("Export cases CSV error:", error);
    return NextResponse.json({ error: "Failed to export CSV." }, { status: 500 });
  }
}
