"use client";

import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import {
  Scale,
  ShieldCheck,
  Calendar,
  ArrowRight,
  Gavel,
  Landmark,
  Award,
  Users,
  CheckCircle2,
  Lock,
} from "lucide-react";

export function HeroSection({
  stats,
}: {
  stats?: {
    activeCases: number;
    completedCases: number;
    yearsOfExperience: number;
    teamSize: number;
  };
}) {
  const currentStats = stats || siteConfig.stats;

  return (
    <section className="relative legal-hero-pattern text-white overflow-hidden pt-14 pb-24 border-b border-[#142A4A]">
      {/* Ambient Gold Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#C9A24B]/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute -top-24 right-0 w-96 h-96 bg-[#132B4F]/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-24 left-0 w-80 h-80 bg-[#C9A24B]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-7">
          {/* Official Chambers Trust Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#0B1F3A]/90 border border-[#C9A24B]/40 text-xs font-medium text-[#DFB75E] shadow-lg backdrop-blur-md">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#DFB75E] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C9A24B]"></span>
            </span>
            <span className="tracking-wide">
              ESTD. {siteConfig.establishedYear} • ADV. AMIT S. RATHI • SANAD NO. {siteConfig.founder.sanadNumber}
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12]">
            Precision in Advocacy. <br />
            <span className="gold-gradient-text">Unyielding Trial Mastery.</span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal max-w-2xl mx-auto">
            Founded by veteran litigator <strong className="text-white font-semibold">Adv. Amit S. Rathi</strong>, LEGALEX delivers decisive courtroom advocacy across Maharashtra courts. Renowned for high-stakes Land Revenue disputes, Civil Title trials, Consumer Redressal, Criminal Defence, and MACT claims.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/book-consultation"
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#DFB75E] via-[#C9A24B] to-[#B88E33] text-[#071526] font-bold text-sm hover:from-[#E6C372] hover:to-[#DFB75E] shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Confidential Consultation</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </Link>

            <Link
              href="/verify-document"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#0B1F3A]/80 hover:bg-[#132B4F] text-slate-200 hover:text-white border border-[#C9A24B]/35 backdrop-blur-md font-semibold text-sm transition-all shadow-md"
            >
              <ShieldCheck className="w-4 h-4 text-[#DFB75E]" />
              <span>Verify Official Seal</span>
            </Link>
          </div>

          {/* Courtroom Forums Strip */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 hover:text-slate-200 transition-colors">
              <Landmark className="w-3.5 h-3.5 text-[#C9A24B]" /> Bombay High Court
            </span>
            <span className="text-[#C9A24B]/60 hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5 hover:text-slate-200 transition-colors">
              <Gavel className="w-3.5 h-3.5 text-[#C9A24B]" /> Maharashtra Revenue Tribunal
            </span>
            <span className="text-[#C9A24B]/60 hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5 hover:text-slate-200 transition-colors">
              <Scale className="w-3.5 h-3.5 text-[#C9A24B]" /> District & Sessions Courts
            </span>
          </div>
        </div>

        {/* Live Scaled Stats Monument */}
        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="group bg-[#0B1F3A]/90 border border-[#C9A24B]/30 hover:border-[#C9A24B]/70 rounded-2xl p-6 text-center backdrop-blur-md shadow-xl hover:-translate-y-1 transition-all">
            <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-[#132B4F] flex items-center justify-center text-[#DFB75E] group-hover:scale-110 transition-transform">
              <Scale className="w-5 h-5" />
            </div>
            <div className="font-serif text-3xl sm:text-4xl font-bold text-white mb-1">
              {currentStats.activeCases.toLocaleString()}
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#DFB75E]">
              Active Case Records
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Currently litigated across Maharashtra
            </p>
          </div>

          <div className="group bg-[#0B1F3A]/90 border border-[#C9A24B]/30 hover:border-[#C9A24B]/70 rounded-2xl p-6 text-center backdrop-blur-md shadow-xl hover:-translate-y-1 transition-all">
            <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-[#132B4F] flex items-center justify-center text-[#DFB75E] group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="font-serif text-3xl sm:text-4xl font-bold text-white mb-1">
              {currentStats.completedCases.toLocaleString()}
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#DFB75E]">
              Completed Matters
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Concluded decrees & settled orders
            </p>
          </div>

          <div className="group bg-[#0B1F3A]/90 border border-[#C9A24B]/30 hover:border-[#C9A24B]/70 rounded-2xl p-6 text-center backdrop-blur-md shadow-xl hover:-translate-y-1 transition-all">
            <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-[#132B4F] flex items-center justify-center text-[#DFB75E] group-hover:scale-110 transition-transform">
              <Award className="w-5 h-5" />
            </div>
            <div className="font-serif text-3xl sm:text-4xl font-bold text-white mb-1">
              {currentStats.yearsOfExperience}+ Years
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#DFB75E]">
              Continuous Practice
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Trademark registered since 2009
            </p>
          </div>

          <div className="group bg-[#0B1F3A]/90 border border-[#C9A24B]/30 hover:border-[#C9A24B]/70 rounded-2xl p-6 text-center backdrop-blur-md shadow-xl hover:-translate-y-1 transition-all">
            <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-[#132B4F] flex items-center justify-center text-[#DFB75E] group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <div className="font-serif text-3xl sm:text-4xl font-bold text-white mb-1">
              {currentStats.teamSize} Specialists
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#DFB75E]">
              Chambers Legal Team
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Founder + 7 specialized advocates & staff
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
