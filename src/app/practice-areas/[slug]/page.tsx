import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import prisma from "@/lib/prisma";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import {
  Scale,
  CheckCircle2,
  Calendar,
  Landmark,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

export function generateStaticParams() {
  return siteConfig.practiceAreas.map((pa) => ({
    slug: pa.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const area = siteConfig.practiceAreas.find((pa) => pa.slug === slug);
  if (!area) return { title: "Practice Area | LEGALEX" };

  return {
    title: `${area.title} Litigation | LEGALEX Chambers`,
    description: area.shortDescription,
  };
}

export default async function PracticeAreaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const area = siteConfig.practiceAreas.find((pa) => pa.slug === slug);

  if (!area) {
    notFound();
  }

  // Fetch related case results if available
  let relatedResults: any[] = [];
  try {
    relatedResults = await prisma.caseResult.findMany({
      where: {
        practiceArea: {
          contains: slug.includes("revenue") ? "REVENUE" : slug.includes("consumer") ? "CONSUMER" : slug.includes("criminal") ? "CRIMINAL" : slug.includes("mact") ? "MACT" : "CIVIL",
        },
      },
      take: 2,
    });
  } catch (err) {
    console.error("Related results fetch error:", err);
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F6F1]">
      <Navbar />

      <main className="flex-grow">
        {/* Detail Hero */}
        <div className="bg-[#071526] text-white py-16 border-b border-[#132B4F]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
              <Link href="/" className="hover:text-white">Home</Link>
              <ChevronRight className="w-3.5 h-3.5 text-[#C9A24B]" />
              <Link href="/practice-areas" className="hover:text-white">Practice Areas</Link>
              <ChevronRight className="w-3.5 h-3.5 text-[#C9A24B]" />
              <span className="text-[#DFB75E]">{area.title}</span>
            </div>

            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#132B4F] text-[#DFB75E] text-xs font-semibold mb-4 border border-[#C9A24B]/30">
                <ShieldCheck className="w-3.5 h-3.5" /> {area.statHighlight}
              </div>
              <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
                {area.title}
              </h1>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                {area.shortDescription}
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-8 space-y-10">
                <div className="bg-white rounded-2xl p-8 border border-[#E5E0D5] shadow-sm space-y-6">
                  <h2 className="font-serif text-2xl font-bold text-[#071526]">
                    Practice Overview & Courtroom Scope
                  </h2>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {area.fullDescription}
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Under the lead direction of <strong>Adv. Amit S. Rathi</strong> (Sanad No. 5803-2008), our litigation team prepares every brief with meticulous examination of documentary evidence, certified court registries, and landmark High Court precedents.
                  </p>
                </div>

                {/* Key Matters Litigated */}
                <div className="bg-white rounded-2xl p-8 border border-[#E5E0D5] shadow-sm space-y-6">
                  <h3 className="font-serif text-xl font-bold text-[#071526]">
                    Key Matters & Substantive Representations
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {area.keyMatters.map((matter, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-[#F8F6F1] border border-[#E5E0D5]/70">
                        <CheckCircle2 className="w-4 h-4 text-[#C9A24B] shrink-0 mt-0.5" />
                        <span className="text-xs text-gray-800 font-medium leading-relaxed">{matter}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Relevant Case Results if any */}
                {relatedResults.length > 0 && (
                  <div className="bg-white rounded-2xl p-8 border border-[#E5E0D5] shadow-sm space-y-6">
                    <h3 className="font-serif text-xl font-bold text-[#071526]">
                      Related Landmark Victories in this Domain
                    </h3>
                    <div className="space-y-4">
                      {relatedResults.map((r) => (
                        <div key={r.id} className="p-4 rounded-xl bg-[#F8F6F1] border border-[#E5E0D5]">
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                            <span className="font-semibold text-[#0B1F3A]">{r.forum}</span>
                            <span>{r.year}</span>
                          </div>
                          <h4 className="font-serif text-sm font-bold text-[#071526] mb-1">
                            {r.title}
                          </h4>
                          <p className="text-xs text-gray-600 mb-2">{r.summary}</p>
                          <div className="text-xs font-bold text-[#059669] flex items-center gap-1">
                            <Scale className="w-3.5 h-3.5" />
                            <span>{r.outcome}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar: Forums & Booking CTA */}
              <div className="lg:col-span-4 space-y-6">
                {/* Court Forums Card */}
                <div className="bg-white rounded-2xl p-6 border border-[#E5E0D5] shadow-sm space-y-4">
                  <h3 className="font-serif text-base font-bold text-[#071526] flex items-center gap-2">
                    <Landmark className="w-4 h-4 text-[#C9A24B]" />
                    Applicable Forums & Courts
                  </h3>
                  <div className="space-y-2 text-xs">
                    {area.courtForums.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-[#F8F6F1] text-gray-800">
                        <span className="text-[#C9A24B] font-bold">›</span>
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Book Consultation Widget */}
                <div className="bg-[#0B1F3A] rounded-2xl p-6 text-white border border-[#C9A24B]/30 shadow-lg space-y-4">
                  <h3 className="font-serif text-lg font-bold text-white">
                    Litigate with Precision
                  </h3>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Have an ongoing dispute or received an urgent notice in {area.title}? Schedule a direct consultation with our litigation desk.
                  </p>
                  <Link
                    href={`/book-consultation?practice=${area.slug}`}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-[#DFB75E] to-[#C9A24B] text-[#071526] font-bold text-xs hover:from-[#E6C372] hover:to-[#DFB75E] transition-all"
                  >
                    <Calendar className="w-4 h-4" />
                    Book Consultation Slot
                  </Link>
                  <div className="text-[11px] text-gray-400 text-center">
                    In-person at Shivaji Nagar, Pune or Video Conference
                  </div>
                </div>

                {/* Other Practice Areas List */}
                <div className="bg-white rounded-2xl p-6 border border-[#E5E0D5] shadow-sm">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                    Other Practice Areas:
                  </h4>
                  <div className="space-y-2 text-xs">
                    {siteConfig.practiceAreas
                      .filter((pa) => pa.slug !== area.slug)
                      .map((pa) => (
                        <Link
                          key={pa.slug}
                          href={`/practice-areas/${pa.slug}`}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-[#F8F6F1] text-gray-700 hover:text-[#0B1F3A] transition-colors"
                        >
                          <span>{pa.title}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                        </Link>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
