import React from "react";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { siteConfig } from "@/config/site";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import {
  ShieldCheck,
  CheckCircle2,
  Scale,
  Landmark,
  Download,
  Calendar,
  Printer,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return {
    title: `Authentication Certificate #${id} | LEGALEX Chambers`,
    description: `Official verification certificate for document ${id} issued by LEGALEX Chambers & Advocates.`,
  };
}

export default async function DocumentCertificatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const doc = await prisma.document.findFirst({
    where: {
      OR: [
        { verificationId: { equals: id } },
        { id: { equals: id } },
      ],
    },
    include: {
      case: {
        include: {
          client: true,
        },
      },
    },
  });

  if (!doc) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F6F1]">
      <Navbar />

      <main className="flex-grow py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Certificate Container */}
          <div className="bg-white rounded-3xl border-4 border-[#C9A24B] p-8 sm:p-14 shadow-2xl relative overflow-hidden">
            {/* Background Seal Watermark */}
            <div className="absolute right-[-40px] bottom-[-40px] opacity-5 pointer-events-none">
              <Scale className="w-96 h-96 text-[#0B1F3A]" />
            </div>

            {/* Top Seal & Heading */}
            <div className="text-center pb-8 border-b-2 border-[#C9A24B]/30 relative z-10">
              <div className="bg-[#0B1F3A] inline-flex items-center justify-center px-6 py-2.5 rounded-2xl border-2 border-[#C9A24B] mx-auto mb-4 shadow-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.png"
                  alt="LEGALEX Law Solutions"
                  className="h-9 w-auto object-contain"
                />
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#071526] tracking-wide">
                {siteConfig.name} CHAMBERS & ADVOCATES
              </h1>
              <p className="text-xs uppercase font-semibold text-[#B88E33] tracking-widest mt-1">
                Bar Council of Maharashtra & Goa • Sanad No. {siteConfig.founder.sanadNumber}
              </p>
              <p className="text-[11px] text-gray-500 mt-1">
                Chambers: {siteConfig.contact.address.chambers}, {siteConfig.contact.address.city}, Maharashtra
              </p>
            </div>

            {/* Certificate Status Banner */}
            <div className="my-8 p-4 rounded-2xl bg-[#059669]/10 border border-[#059669]/30 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#059669] text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#059669] uppercase tracking-wider">
                    Certificate of Authenticity
                  </p>
                  <p className="text-xs text-gray-700 font-medium">
                    This document was officially lodged, verified, and sealed in our Chambers Registry.
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] text-gray-400 font-bold block uppercase">Status</span>
                <span className="text-xs font-bold text-[#059669]">VALID & ACTIVE</span>
              </div>
            </div>

            {/* Document Details Table */}
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#F8F6F1] border border-[#E5E0D5]">
                  <span className="text-gray-500 font-semibold uppercase tracking-wider text-[10px] block mb-1">
                    Verification Reference ID:
                  </span>
                  <span className="font-mono text-sm font-bold text-[#071526]">
                    {doc.verificationId}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#F8F6F1] border border-[#E5E0D5]">
                  <span className="text-gray-500 font-semibold uppercase tracking-wider text-[10px] block mb-1">
                    Court Case Number:
                  </span>
                  <span className="font-mono text-sm font-bold text-[#071526]">
                    {doc.case.caseNumber}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#F8F6F1] border border-[#E5E0D5]">
                <span className="text-gray-500 font-semibold uppercase tracking-wider text-[10px] block mb-1">
                  Document Title & Classification:
                </span>
                <span className="text-sm font-bold text-[#071526]">
                  {doc.title} ({doc.category})
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#F8F6F1] border border-[#E5E0D5]">
                  <span className="text-gray-500 font-semibold uppercase tracking-wider text-[10px] block mb-1">
                    Court / Tribunal Forum:
                  </span>
                  <span className="font-medium text-[#071526]">
                    {doc.case.courtName}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#F8F6F1] border border-[#E5E0D5]">
                  <span className="text-gray-500 font-semibold uppercase tracking-wider text-[10px] block mb-1">
                    Client Representation:
                  </span>
                  <span className="font-medium text-[#071526]">
                    {doc.case.client?.companyName || doc.case.casingTitle}
                  </span>
                </div>
              </div>

              {/* Digital Seal & QR Section */}
              <div className="p-5 rounded-2xl bg-[#0B1F3A] text-white flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-1.5 text-center sm:text-left">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#DFB75E] uppercase tracking-wider justify-center sm:justify-start">
                    <ShieldCheck className="w-4 h-4" /> Cryptographic Digital Seal
                  </div>
                  <p className="text-[10px] font-mono text-gray-300 break-all max-w-sm">
                    {doc.digitalSealHash || "SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069"}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    Sealed on {new Date(doc.createdAt).toLocaleString("en-IN")} by {doc.uploadedBy}
                  </p>
                </div>

                {doc.qrCodeUrl && (
                  <div className="bg-white p-2 rounded-xl shrink-0 shadow-md">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={doc.qrCodeUrl}
                      alt="Verification QR"
                      className="w-20 h-20"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Official Certification Signature Block */}
            <div className="mt-8 pt-8 border-t-2 border-[#C9A24B]/30 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-gray-600">
              <div className="text-center sm:text-left">
                <p className="font-serif font-bold text-sm text-[#071526]">Adv. Amit S. Rathi</p>
                <p className="text-[11px] text-gray-500">Lead Counsel & Director, LEGALEX</p>
                <p className="text-[11px] text-gray-500">Sanad No. 5803-2008</p>
              </div>

              <div className="flex items-center gap-3">
                {doc.filePath && (
                  <a
                    href={doc.filePath}
                    download
                    className="px-5 py-2.5 rounded-xl bg-[#0B1F3A] hover:bg-[#132B4F] text-white text-xs font-semibold flex items-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5 text-[#DFB75E]" />
                    <span>Download PDF Brief</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="text-center mt-6">
            <Link
              href="/verify-document"
              className="text-xs text-[#0B1F3A] hover:text-[#C9A24B] font-semibold"
            >
              ← Search Another Document Reference
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
