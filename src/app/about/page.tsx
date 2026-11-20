import React from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { Scale, Award, ShieldCheck, Mail, Phone, Calendar, ArrowRight } from "lucide-react";

export const metadata = {
  title: "About Firm & Team | LEGALEX Chambers",
  description: "Learn about LEGALEX established in 2009 by Adv. Amit S. Rathi (Sanad No. 5803-2008) and our 8-member specialized litigation team across Maharashtra.",
};

export default function AboutPage() {
  const f = siteConfig.founder;

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F6F1]">
      <Navbar />

      <main className="flex-grow">
        {/* Page Hero */}
        <div className="bg-[#071526] text-white py-20 sm:py-24 border-b border-[#142A4A] relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C9A24B]/10 rounded-full blur-[140px] pointer-events-none" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#132B4F] text-[#DFB75E] text-xs font-semibold border border-[#C9A24B]/30">
              <Scale className="w-3.5 h-3.5" /> Established 2009 • Trademark Registered 2009
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              About LEGALEX Chambers
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-light">
              Sixteen years of relentless trial advocacy, strategic dispute resolution, and institutional ethics across the State of Maharashtra.
            </p>
          </div>
        </div>

        {/* Firm Story Section */}
        <section className="py-24 bg-white border-b border-[#E2DDD3]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              <div className="lg:col-span-7 space-y-6 text-slate-700 text-sm leading-relaxed">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C9A24B]/15 text-[#9C7728] text-xs font-bold uppercase tracking-wider border border-[#C9A24B]/30">
                  Chambers Genesis & Foundation
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#071526] leading-tight">
                  A Legacy of Grounded Legal Mastery Since 2009
                </h2>
                <p>
                  LEGALEX was founded in 2009 by Advocate Amit S. Rathi with a singular conviction: courtroom advocacy must combine deep substantive mastery of statutory jurisprudence with unyielding ethical rigor.
                </p>
                <p>
                  Over the past decade and a half, the firm has evolved from a boutique trial practice into one of Maharashtra&apos;s most respected litigation chambers. Operating from its principal offices in Shivaji Nagar, Pune—steps away from the District & Sessions Court—Legalex regularly represents corporate conglomerates, cooperative agricultural societies, developers, and citizens before the Bombay High Court, the Maharashtra Revenue Tribunal (MRT), Collectorate Courts, and Consumer Commissions.
                </p>
                <p>
                  Today, Legalex pairs traditional courtroom cross-examination depth with a modern, transparent client management portal, enabling litigants to track hearings, orders, and case records with absolute clarity.
                </p>
              </div>

              {/* Core Pillars */}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="bg-[#F8F6F1] p-6 rounded-2xl border border-[#E2DDD3] hover:border-[#C9A24B]/50 transition-colors">
                  <Scale className="w-7 h-7 text-[#C9A24B] mb-3" />
                  <h3 className="font-serif text-base font-bold text-[#071526] mb-1.5">
                    Constitutional Integrity
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    Uncompromising defense of statutory rights under Article 21 and strict compliance with Bar Council ethical standards.
                  </p>
                </div>

                <div className="bg-[#F8F6F1] p-6 rounded-2xl border border-[#E2DDD3] hover:border-[#C9A24B]/50 transition-colors">
                  <Award className="w-7 h-7 text-[#C9A24B] mb-3" />
                  <h3 className="font-serif text-base font-bold text-[#071526] mb-1.5">
                    Trial Thoroughness
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    Exhaustive document verification, precedent research, and forensic scrutiny before any petition is filed.
                  </p>
                </div>

                <div className="bg-[#F8F6F1] p-6 rounded-2xl border border-[#E2DDD3] hover:border-[#C9A24B]/50 transition-colors">
                  <ShieldCheck className="w-7 h-7 text-[#C9A24B] mb-3" />
                  <h3 className="font-serif text-base font-bold text-[#071526] mb-1.5">
                    Verifiable Records
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    Digitally signed certified briefs, QR verification, and real-time cause list notifications for all clients.
                  </p>
                </div>

                <div className="bg-[#0B1F3A] p-6 rounded-2xl text-white border border-[#C9A24B]/30 shadow-md">
                  <span className="font-serif text-3xl font-bold text-[#DFB75E] block mb-1">
                    16+ Yrs
                  </span>
                  <h3 className="font-serif text-base font-bold text-white mb-1.5">
                    Continuous Standing
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-light">
                    Represented over 1,770+ complex litigation cases across Maharashtra since 2009.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Founder Spotlight */}
        <section className="py-24 bg-[#F8F6F1] border-b border-[#E2DDD3]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-14">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C9A24B]/15 text-[#9C7728] text-xs font-bold uppercase tracking-wider mb-2 border border-[#C9A24B]/30">
                Head of Chambers
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#071526]">
                Founder, Director & CGO
              </h2>
            </div>

            <div className="bg-white rounded-3xl border border-[#E2DDD3] p-8 sm:p-12 shadow-sm max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
                <div className="md:col-span-5 text-center">
                  <div className="aspect-[4/5] relative rounded-2xl overflow-hidden shadow-lg border-2 border-[#C9A24B]/40 max-w-xs mx-auto" style={{ position: "relative" }}>
                    <Image
                      src={f.image}
                      alt={f.name}
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                </div>

                <div className="md:col-span-7 space-y-4 text-left">
                  <div>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#071526]">
                      {f.name}
                    </h3>
                    <p className="text-sm font-semibold text-[#9C7728] mt-1">
                      {f.title}
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#0B1F3A] text-white text-xs font-medium">
                    <span>Sanad No. {f.sanadNumber}</span>
                    <span className="text-[#C9A24B]">•</span>
                    <span>{f.barCouncil}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                    {f.bio}
                  </p>

                  <div className="pt-2 text-xs text-slate-600 space-y-1">
                    <p><strong className="text-slate-800">Qualifications:</strong> {f.education}</p>
                    <p><strong className="text-slate-800">Standing:</strong> 16+ Years in Trial & Appellate Courts</p>
                    <p><strong className="text-slate-800">Chambers Desk:</strong> {f.phone} | {f.email}</p>
                  </div>

                  <div className="pt-3">
                    <Link
                      href="/book-consultation"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#DFB75E] to-[#C9A24B] text-[#071526] font-bold text-xs hover:from-[#E6C372] hover:to-[#DFB75E] transition-all shadow-md"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Book Consultation with Adv. Amit Rathi</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Full Team Roster: 7 Specialized Assistants */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C9A24B]/15 text-[#9C7728] text-xs font-bold uppercase tracking-wider mb-3 border border-[#C9A24B]/30">
                Team Legalex
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#071526]">
                Our Specialized Legal Team
              </h2>
              <div className="w-20 h-1 bg-[#C9A24B] mx-auto my-4 rounded-full" />
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Adv. Amit S. Rathi is supported by 7 dedicated associate advocates, researchers, court clerks, and accounting officers working in unison on every case brief.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {siteConfig.teamMembers.slice(1).map((member) => (
                <div
                  key={member.id}
                  className="bg-[#F8F6F1] rounded-2xl overflow-hidden border border-[#E2DDD3] shadow-sm hover:shadow-xl hover:border-[#C9A24B]/60 hover:-translate-y-1.5 transition-all flex flex-col group"
                >
                  <div className="aspect-[4/4] relative overflow-hidden bg-slate-200" style={{ position: "relative" }}>
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 320px"
                    />
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#0B1F3A]/90 text-[#DFB75E] backdrop-blur-md border border-[#C9A24B]/30">
                      {member.experienceYears} Yrs Exp
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#071526] mb-1 group-hover:text-[#9C7728] transition-colors">
                        {member.name}
                      </h3>
                      <p className="text-xs font-semibold text-[#9C7728] mb-1">
                        {member.designation}
                      </p>
                      {member.sanadNumber && (
                        <p className="text-[11px] text-slate-500 font-mono mb-2">
                          Sanad: {member.sanadNumber}
                        </p>
                      )}
                      <p className="text-xs text-slate-600 leading-relaxed mb-4 font-normal">
                        {member.bio}
                      </p>
                    </div>

                    <div className="pt-3.5 border-t border-[#E2DDD3] text-[11px] text-slate-500 space-y-1">
                      <div className="flex items-center gap-1.5 truncate">
                        <Mail className="w-3.5 h-3.5 text-[#C9A24B] shrink-0" />
                        <span className="truncate">{member.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#C9A24B] shrink-0" />
                        <span>{member.phone}</span>
                      </div>
                    </div>
                  </div>
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
