import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { Scale, ArrowRight, CheckCircle2, Landmark, ShieldCheck, Gavel, CarFront } from "lucide-react";

export const metadata = {
  title: "Practice Areas & Jurisdictions | LEGALEX Chambers",
  description: "Explore LEGALEX Chambers' dedicated litigation practices across Maharashtra: Civil & Family, Land Revenue, Consumer, Criminal, and MACT.",
};

const iconMap: Record<string, React.ReactNode> = {
  Scale: <Scale className="w-6 h-6 text-[#DFB75E]" />,
  Landmark: <Landmark className="w-6 h-6 text-[#DFB75E]" />,
  ShieldCheck: <ShieldCheck className="w-6 h-6 text-[#DFB75E]" />,
  Gavel: <Gavel className="w-6 h-6 text-[#DFB75E]" />,
  CarFront: <CarFront className="w-6 h-6 text-[#DFB75E]" />,
};

export default function PracticeAreasPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8F6F1]">
      <Navbar />

      <main className="flex-grow">
        <div className="bg-[#071526] text-white py-20 sm:py-24 border-b border-[#142A4A] relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C9A24B]/10 rounded-full blur-[140px] pointer-events-none" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#132B4F] text-[#DFB75E] text-xs font-semibold border border-[#C9A24B]/30">
              <Scale className="w-3.5 h-3.5" /> High Court & Trial Jurisdictions
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              Litigation Practice Areas
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-light">
              Specialized trial and appellate advocacy across Maharashtra courts, backed by 16+ years of continuous courtroom practice.
            </p>
          </div>
        </div>

        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {siteConfig.practiceAreas.map((area) => (
                <div
                  key={area.slug}
                  className="bg-white rounded-2xl p-8 border border-[#E2DDD3] shadow-sm hover:shadow-xl hover:border-[#C9A24B]/60 hover:-translate-y-1.5 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-xl bg-[#0B1F3A] flex items-center justify-center shadow-md group-hover:bg-[#132B4F] transition-colors">
                        {iconMap[area.icon] || <Scale className="w-6 h-6 text-[#DFB75E]" />}
                      </div>
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#C9A24B]/10 text-[#9C7728] border border-[#C9A24B]/20">
                        {area.statHighlight}
                      </span>
                    </div>

                    <h2 className="font-serif text-2xl font-bold text-[#071526] mb-3 group-hover:text-[#9C7728] transition-colors">
                      {area.title}
                    </h2>

                    <p className="text-xs text-slate-600 leading-relaxed mb-6 font-normal">
                      {area.fullDescription.slice(0, 160)}...
                    </p>

                    <div className="space-y-2 mb-6 pt-4 border-t border-slate-100">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Core Court Forums:
                      </p>
                      {area.courtForums.map((forum, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A24B] shrink-0" />
                          <span>{forum}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link
                    href={`/practice-areas/${area.slug}`}
                    className="inline-flex items-center justify-between w-full pt-4 border-t border-slate-100 text-xs font-bold text-[#0B1F3A] group-hover:text-[#C9A24B] transition-colors"
                  >
                    <span>View In-Depth Scope & Precedents</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
