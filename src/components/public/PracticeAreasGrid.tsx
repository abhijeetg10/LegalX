import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import {
  Scale,
  Landmark,
  ShieldCheck,
  Gavel,
  CarFront,
  ArrowRight,
  CheckCircle2,
  PhoneCall,
  Calendar,
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  Scale: <Scale className="w-6 h-6 text-[#DFB75E]" />,
  Landmark: <Landmark className="w-6 h-6 text-[#DFB75E]" />,
  ShieldCheck: <ShieldCheck className="w-6 h-6 text-[#DFB75E]" />,
  Gavel: <Gavel className="w-6 h-6 text-[#DFB75E]" />,
  CarFront: <CarFront className="w-6 h-6 text-[#DFB75E]" />,
};

export function PracticeAreasGrid() {
  return (
    <section className="py-24 bg-[#F8F6F1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C9A24B]/15 text-[#9C7728] text-xs font-bold uppercase tracking-wider mb-3 border border-[#C9A24B]/30">
            Dedicated Jurisdictions
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#071526]">
            Core Practice Domains
          </h2>
          <div className="w-20 h-1 bg-[#C9A24B] mx-auto my-4 rounded-full" />
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Legalex delivers focused trial and appellate counsel across five specialized legal domains throughout the State of Maharashtra.
          </p>
        </div>

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

                <h3 className="font-serif text-xl font-bold text-[#071526] mb-3 group-hover:text-[#9C7728] transition-colors">
                  {area.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed mb-6 font-normal">
                  {area.shortDescription}
                </p>

                <div className="space-y-2 pt-4 border-t border-slate-100 mb-6">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Primary Representations:
                  </p>
                  {area.keyMatters.slice(0, 3).map((matter, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A24B] shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{matter}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href={`/practice-areas/${area.slug}`}
                className="inline-flex items-center justify-between w-full pt-4 border-t border-slate-100 text-xs font-bold text-[#0B1F3A] group-hover:text-[#C9A24B] transition-colors"
              >
                <span>Explore Jurisprudential Scope</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </Link>
            </div>
          ))}

          {/* Consultation Highlight Box */}
          <div className="bg-[#0B1F3A] rounded-2xl p-8 text-white flex flex-col justify-between border border-[#C9A24B]/40 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#C9A24B]/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-[#132B4F] flex items-center justify-center mb-6 border border-[#C9A24B]/30">
                <Gavel className="w-6 h-6 text-[#DFB75E]" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-white mb-3">
                Need Immediate Courtroom Counsel?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-6 font-light">
                Litigation requires decisive action before statutory limitation periods lapse or adverse ex-parte interim orders are issued. Brief Adv. Amit S. Rathi directly.
              </p>
              <div className="text-xs text-[#DFB75E] font-medium space-y-2 mb-6">
                <p className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#DFB75E]" />
                  Ad-Interim Stays & Injunctions (Order 39)
                </p>
                <p className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#DFB75E]" />
                  7/12 Mutation Disputes (MLRC Sec. 150/247)
                </p>
                <p className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#DFB75E]" />
                  Anticipatory Bail & Trial Defence
                </p>
              </div>
            </div>

            <div className="space-y-3 relative z-10 pt-4 border-t border-[#132B4F]">
              <Link
                href="/book-consultation"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#DFB75E] to-[#C9A24B] hover:from-[#E6C372] hover:to-[#DFB75E] text-[#071526] font-bold text-xs shadow-md transition-all"
              >
                <Calendar className="w-3.5 h-3.5" />
                Book Trial Strategy Session
              </Link>
              <a
                href={`tel:${siteConfig.contact.phone}`}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#132B4F] hover:bg-[#1A3865] text-slate-200 text-xs font-semibold border border-[#C9A24B]/20 transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#DFB75E]" />
                Emergency Hotline: {siteConfig.contact.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
