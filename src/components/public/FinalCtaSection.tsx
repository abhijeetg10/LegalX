import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Calendar, PhoneCall, ShieldCheck, ArrowRight, MapPin } from "lucide-react";

export function FinalCtaSection() {
  return (
    <section className="py-24 bg-[#071526] text-white relative overflow-hidden border-t border-[#142A4A]">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C9A24B]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-24 left-1/4 w-80 h-80 bg-[#132B4F]/40 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-7">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#132B4F] text-[#DFB75E] text-xs font-semibold border border-[#C9A24B]/35 shadow-md">
          <ShieldCheck className="w-3.5 h-3.5" />
          Confidential Courtroom Consultation
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
          Protect Your Rights & Assets with <br />
          <span className="gold-gradient-text">Authoritative Legal Counsel</span>
        </h2>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 font-light leading-relaxed">
          From trial strategy formulation to High Court appeals, Adv. Amit S. Rathi and the Legalex litigation team stand ready to represent you.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/book-consultation"
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-[#DFB75E] via-[#C9A24B] to-[#B88E33] text-[#071526] font-bold text-sm hover:from-[#E6C372] hover:to-[#DFB75E] shadow-2xl hover:-translate-y-0.5 transition-all"
          >
            <Calendar className="w-4 h-4" />
            <span>Schedule Consultation Appointment</span>
            <ArrowRight className="w-4 h-4 ml-0.5" />
          </Link>

          <a
            href={`tel:${siteConfig.contact.phone}`}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-[#0B1F3A]/90 hover:bg-[#132B4F] text-white border border-[#C9A24B]/40 font-semibold text-sm transition-all shadow-md"
          >
            <PhoneCall className="w-4 h-4 text-[#DFB75E]" />
            <span>Call Chambers: {siteConfig.contact.phoneDisplay}</span>
          </a>
        </div>

        <div className="pt-6 text-xs text-slate-400 flex items-center justify-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-[#C9A24B]" />
          <span>Court Office: C Building, District Court Compound, Shivaji Nagar, Pune • Serving all districts across Maharashtra</span>
        </div>
      </div>
    </section>
  );
}
