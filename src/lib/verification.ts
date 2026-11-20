import QRCode from "qrcode";
import crypto from "crypto";

export interface VerificationResult {
  verificationId: string;
  qrCodeDataUrl: string;
  digitalSealHash: string;
  issuedAt: Date;
}

export async function generateDocumentSeal(caseNumber: string, docTitle: string): Promise<VerificationResult> {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const year = new Date().getFullYear();
  const verificationId = `LX-${year}-${randomSuffix}`;

  const payload = `${verificationId}|${caseNumber}|${docTitle}|${Date.now()}|LEGALEX_PUNE_VERIFIED`;
  const digitalSealHash = crypto.createHash("sha256").update(payload).digest("hex");

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const verifyUrl = `${baseUrl}/verify-document/${verificationId}`;

  const qrCodeDataUrl = await QRCode.toDataURL(verifyUrl, {
    width: 256,
    margin: 2,
    color: {
      dark: "#0B1F3A",
      light: "#FFFFFF",
    },
  });

  return {
    verificationId,
    qrCodeDataUrl,
    digitalSealHash,
    issuedAt: new Date(),
  };
}

export function formatIndianCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
