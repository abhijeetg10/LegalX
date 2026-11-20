import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query")?.trim();

    if (!query) {
      return NextResponse.json({ error: "Verification ID is required." }, { status: 400 });
    }

    const doc = await prisma.document.findFirst({
      where: {
        OR: [
          { verificationId: { equals: query } },
          { fileName: { contains: query } },
          { digitalSealHash: { equals: query } },
        ],
      },
      include: {
        case: {
          select: {
            caseNumber: true,
            casingTitle: true,
            courtName: true,
            practiceArea: true,
            jurisdiction: true,
          },
        },
      },
    });

    if (!doc) {
      return NextResponse.json({
        verified: false,
        message: "No authentic record found matching this verification query.",
      });
    }

    return NextResponse.json({
      verified: true,
      document: {
        id: doc.id,
        verificationId: doc.verificationId,
        title: doc.title,
        category: doc.category,
        fileName: doc.fileName,
        fileSize: doc.fileSize,
        qrCodeUrl: doc.qrCodeUrl,
        isVerified: doc.isVerified,
        verifiedAt: doc.verifiedAt,
        digitalSealHash: doc.digitalSealHash,
        uploadedBy: doc.uploadedBy,
        filePath: doc.filePath,
        case: doc.case,
      },
    });
  } catch (error: any) {
    console.error("Verification query error:", error);
    return NextResponse.json({ error: "Failed to process verification query." }, { status: 500 });
  }
}
