import React from "react";
import prisma from "@/lib/prisma";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Clock, User, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Legal Insights & Maharashtra Jurisprudence | LEGALEX",
  description: "In-depth legal analysis on Maharashtra Land Revenue Code, Anticipatory Bail, Consumer Rights, and Coparcenary Partition.",
};

export default async function InsightsPage() {
  let posts: any[] = [];
  try {
    posts = await prisma.blogPost.findMany({
      orderBy: { publishedAt: "desc" },
    });
  } catch (err) {
    console.error("Insights fetch error:", err);
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F6F1]">
      <Navbar />

      <main className="flex-grow">
        {/* Hero */}
        <div className="bg-[#071526] text-white py-20 sm:py-24 border-b border-[#142A4A] relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C9A24B]/10 rounded-full blur-[140px] pointer-events-none" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#132B4F] text-[#DFB75E] text-xs font-semibold border border-[#C9A24B]/30">
              <BookOpen className="w-3.5 h-3.5" /> Legal Jurisprudence & Commentary
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              Chambers Insights
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-light">
              Substantive statutory commentary, High Court precedent breakdowns, and practical guidance on Maharashtra laws.
            </p>
          </div>
        </div>

        {/* Posts Grid */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((p) => (
                <Link
                  key={p.id}
                  href={`/insights/${p.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-[#E2DDD3] shadow-sm hover:shadow-xl hover:border-[#C9A24B]/60 hover:-translate-y-1.5 transition-all flex flex-col"
                >
                  <div className="aspect-[16/9] relative overflow-hidden bg-slate-200" style={{ position: "relative" }}>
                    <Image
                      src={p.imageUrl}
                      alt={p.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 420px"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#0B1F3A]/90 text-[#DFB75E] backdrop-blur-md border border-[#C9A24B]/30">
                      {p.category}
                    </div>
                  </div>

                  <div className="p-7 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 mb-3">
                        <span className="flex items-center gap-1 font-medium text-slate-600">
                          <User className="w-3 h-3 text-[#C9A24B]" /> {p.authorName}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-slate-400">
                          <Clock className="w-3 h-3 text-[#C9A24B]" /> {p.readTime}
                        </span>
                      </div>

                      <h2 className="font-serif text-lg font-bold text-[#071526] group-hover:text-[#9C7728] transition-colors line-clamp-2 mb-3 leading-snug">
                        {p.title}
                      </h2>

                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-6 font-normal">
                        {p.excerpt}
                      </p>
                    </div>

                    <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0B1F3A] group-hover:text-[#9C7728] transition-colors">
                      <span>Read Full Commentary</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
