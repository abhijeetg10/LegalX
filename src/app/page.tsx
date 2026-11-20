import React from "react";
import prisma from "@/lib/prisma";
import { siteConfig } from "@/config/site";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { HeroSection } from "@/components/public/HeroSection";
import { PracticeAreasGrid } from "@/components/public/PracticeAreasGrid";
import { FounderFeature } from "@/components/public/FounderFeature";
import { WhyChooseSection } from "@/components/public/WhyChooseSection";
import { HowWeWorkTimeline } from "@/components/public/HowWeWorkTimeline";
import { TestimonialsSection } from "@/components/public/TestimonialsSection";
import { FaqSection } from "@/components/public/FaqSection";
import { FinalCtaSection } from "@/components/public/FinalCtaSection";
import { BciDisclaimerModal } from "@/components/public/BciDisclaimerModal";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, Scale, Award, CheckCircle2, Clock } from "lucide-react";

export default async function HomePage() {
  let testimonials: any[] = [];
  let blogPosts: any[] = [];
  let caseResults: any[] = [];
  let activeCasesCount = siteConfig.stats.activeCases;
  let completedCasesCount = siteConfig.stats.completedCases;

  try {
    const [dbTestimonials, dbPosts, dbResults, activeCount, completedCount] =
      await Promise.all([
        prisma.testimonial.findMany({ take: 6 }),
        prisma.blogPost.findMany({ take: 3, orderBy: { publishedAt: "desc" } }),
        prisma.caseResult.findMany({ take: 3 }),
        prisma.case.count({ where: { status: "ACTIVE" } }),
        prisma.case.count({ where: { status: "COMPLETED" } }),
      ]);

    testimonials = dbTestimonials;
    blogPosts = dbPosts;
    caseResults = dbResults;

    if (activeCount > 0) activeCasesCount = Math.max(activeCount, siteConfig.stats.activeCases);
    if (completedCount > 0) completedCasesCount = Math.max(completedCount, siteConfig.stats.completedCases);
  } catch (err) {
    console.error("Home data fetch fallback:", err);
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F6F1]">
      <BciDisclaimerModal />
      <Navbar />

      <main className="flex-grow">
        {/* Cinematic Hero with Live Scaled Stats */}
        <HeroSection
          stats={{
            activeCases: activeCasesCount,
            completedCases: completedCasesCount,
            yearsOfExperience: siteConfig.stats.yearsOfExperience,
            teamSize: siteConfig.stats.teamSize,
          }}
        />

        {/* Core Practice Areas Grid */}
        <PracticeAreasGrid />

        {/* Founder Spotlight - Adv. Amit S. Rathi */}
        <FounderFeature />

        {/* Case Victories & Landmark Outcomes Preview */}
        {caseResults.length > 0 && (
          <section className="py-24 bg-[#F8F6F1] border-b border-[#E2DDD3]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
                <div>
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C9A24B]/15 text-[#9C7728] text-xs font-bold uppercase tracking-wider mb-3 border border-[#C9A24B]/30">
                    <Award className="w-3.5 h-3.5" /> Proven Track Record
                  </div>
                  <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#071526]">
                    Landmark Judicial Outcomes
                  </h2>
                  <p className="text-slate-600 text-sm mt-2 max-w-xl">
                    Selected reported decrees, status quo orders, and appellate verdicts across Maharashtra courts.
                  </p>
                </div>
                <Link
                  href="/case-results"
                  className="mt-6 md:mt-0 text-xs font-bold text-[#0B1F3A] hover:text-[#9C7728] inline-flex items-center gap-2 group transition-colors"
                >
                  <span>View All Landmark Orders</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {caseResults.map((res) => (
                  <div
                    key={res.id}
                    className="bg-white rounded-2xl p-7 border border-[#E2DDD3] shadow-sm hover:shadow-xl hover:border-[#C9A24B]/60 hover:-translate-y-1.5 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                        <span className="font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {res.forum}
                        </span>
                        <span className="font-medium text-slate-400">{res.year}</span>
                      </div>
                      <h3 className="font-serif text-lg font-bold text-[#071526] mb-3 group-hover:text-[#9C7728] transition-colors leading-snug">
                        {res.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed mb-6 font-normal">
                        {res.summary}
                      </p>
                    </div>
                    <div className="pt-4 border-t border-slate-100 text-xs font-bold text-emerald-700 flex items-center gap-2 bg-emerald-50/60 p-3 rounded-xl border border-emerald-100">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                      <span>{res.outcome}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Why Choose Legalex */}
        <WhyChooseSection />

        {/* How We Work 4-Stage Timeline */}
        <HowWeWorkTimeline />

        {/* Testimonials */}
        <TestimonialsSection testimonials={testimonials} />

        {/* Latest Legal Insights & Articles */}
        {blogPosts.length > 0 && (
          <section className="py-24 bg-white border-b border-[#E2DDD3]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
                <div>
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C9A24B]/15 text-[#9C7728] text-xs font-bold uppercase tracking-wider mb-3 border border-[#C9A24B]/30">
                    <BookOpen className="w-3.5 h-3.5" /> Chambers Thought Leadership
                  </div>
                  <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#071526]">
                    Legal Insights & Jurisprudence
                  </h2>
                  <p className="text-slate-600 text-sm mt-2 max-w-xl">
                    Authored by Adv. Amit S. Rathi, dissecting landmark precedents and statutory updates in Maharashtra.
                  </p>
                </div>
                <Link
                  href="/insights"
                  className="mt-6 md:mt-0 text-xs font-bold text-[#0B1F3A] hover:text-[#9C7728] inline-flex items-center gap-2 group transition-colors"
                >
                  <span>Browse Full Commentary Library</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {blogPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/insights/${post.slug}`}
                    className="group bg-[#F8F6F1] rounded-2xl overflow-hidden border border-[#E2DDD3] shadow-sm hover:shadow-xl hover:border-[#C9A24B]/60 hover:-translate-y-1.5 transition-all flex flex-col"
                  >
                    <div className="aspect-[16/9] relative overflow-hidden bg-slate-200" style={{ position: "relative" }}>
                      <Image
                        src={post.imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 420px"
                      />
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#0B1F3A]/90 text-[#DFB75E] backdrop-blur-md border border-[#C9A24B]/30">
                        {post.category}
                      </div>
                    </div>
                    <div className="p-7 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2.5">
                          <span className="font-medium text-slate-500">By {post.authorName || "Adv. Amit S. Rathi"}</span>
                          <span className="flex items-center gap-1 text-slate-400">
                            <Clock className="w-3 h-3" />
                            {post.readTime}
                          </span>
                        </div>
                        <h3 className="font-serif text-lg font-bold text-[#071526] group-hover:text-[#9C7728] transition-colors line-clamp-2 mb-2.5 leading-snug">
                          {post.title}
                        </h3>
                        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-5 font-normal">
                          {post.excerpt}
                        </p>
                      </div>
                      <div className="text-xs font-bold text-[#0B1F3A] flex items-center gap-1.5 group-hover:text-[#9C7728] pt-3 border-t border-[#E2DDD3]">
                        <span>Read Full Commentary</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Courtroom FAQs */}
        <FaqSection />

        {/* Final CTA Banner */}
        <FinalCtaSection />
      </main>

      <Footer />
    </div>
  );
}
