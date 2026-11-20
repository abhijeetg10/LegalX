import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { storage } from "@/lib/storage";
import { generateDocumentSeal } from "@/lib/verification";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const caseId = formData.get("caseId") as string;
    const category = (formData.get("category") as string) || "OTHER";
    const customTitle = formData.get("title") as string;

    if (!file || !caseId) {
      return NextResponse.json({ error: "File and Case ID are required." }, { status: 400 });
    }

    const caseRecord = await prisma.case.findUnique({
      where: { id: caseId },
    });

    if (!caseRecord) {
      return NextResponse.json({ error: "Case record not found." }, { status: 404 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const docTitle = customTitle || file.name.replace(/\.[^/.]+$/, "");

    // 1. Storage abstraction save
    const storedFile = await storage.uploadFile(
      buffer,
      file.name,
      file.type || "application/pdf",
      "documents"
    );

    // 2. Generate Digital Seal & QR Code
    const seal = await generateDocumentSeal(caseRecord.caseNumber, docTitle);

    // 3. Create Document Record
    const newDoc = await prisma.document.create({
      data: {
        caseId,
        title: docTitle,
        category,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type || "application/pdf",
        filePath: storedFile.url,
        version: 1,
        uploadedBy: session.user.name || "Advocate",
        verificationId: seal.verificationId,
        qrCodeUrl: seal.qrCodeDataUrl,
        digitalSealHash: seal.digitalSealHash,
        isVerified: true,
        verifiedAt: new Date(),
      },
    });

    // 4. Case Timeline Event
    await prisma.caseTimeline.create({
      data: {
        caseId,
        title: `Document Lodged: ${docTitle}`,
        description: `Uploaded and certified by ${session.user.name}. Sealed under ID ${seal.verificationId}.`,
        eventDate: new Date(),
        eventType: "ORDER",
      },
    });

    // 5. System Audit Log
    await prisma.auditLog.create({
      data: {
        userId: (session.user as any).id,
        action: "UPLOAD_DOCUMENT",
        details: `Uploaded ${file.name} to case ${caseRecord.caseNumber} with seal ${seal.verificationId}`,
      },
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      document: newDoc,
      seal,
    });
  } catch (error: any) {
    console.error("Document upload error:", error);
    return NextResponse.json({ error: "Failed to upload and seal document." }, { status: 500 });
  }
}
