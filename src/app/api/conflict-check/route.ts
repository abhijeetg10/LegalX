import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const checks = await prisma.conflictCheck.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, checks });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { searchQuery, category, notes } = body;

    if (!searchQuery) {
      return NextResponse.json({ success: false, error: "Search query required" }, { status: 400 });
    }

    const query = searchQuery.trim().toLowerCase();

    // Query clients matching
    const matchingClients = await prisma.client.findMany({
      where: {
        OR: [
          { companyName: { contains: query } },
          { user: { name: { contains: query } } },
        ],
      },
      include: { user: true },
    });

    // Query cases matching
    const matchingCases = await prisma.case.findMany({
      where: {
        OR: [
          { casingTitle: { contains: query } },
          { caseNumber: { contains: query } },
          { summary: { contains: query } },
        ],
      },
      take: 5,
    });

    const totalMatches = matchingClients.length + matchingCases.length;

    let status = "CLEARED";
    let matchSummary = `Zero conflicting records found across firm registry for "${searchQuery}".`;

    if (totalMatches > 0) {
      status = "POTENTIAL_CONFLICT";
      matchSummary = `Identified ${matchingClients.length} client(s) and ${matchingCases.length} case(s) mentioning "${searchQuery}". Requires manual clearance.`;
    }

    const checkRecord = await prisma.conflictCheck.create({
      data: {
        searchQuery,
        category: category || "OPPOSITE_PARTY",
        potentialMatches: totalMatches,
        matchSummary,
        status,
        reviewedBy: session.user?.name || "Adv. Amit S. Rathi",
        notes: notes || (totalMatches === 0 ? "Automated scan clean. No adverse party conflict detected." : "Conflict advisory flag raised. Senior partner review required before engagement."),
      },
    });

    return NextResponse.json({
      success: true,
      check: checkRecord,
      matchingClients,
      matchingCases,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
