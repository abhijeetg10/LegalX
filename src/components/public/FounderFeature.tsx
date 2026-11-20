import React from "react";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { Award, CheckCircle, ArrowRight, BookOpen, Scale, Calendar, Users, Shield } from "lucide-react";

export function FounderFeature() {
  const f = siteConfig.founder;

  return (
    <section className="py-24 bg-white border-y border-[#E2DDD3] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Founder Portrait & Official Credentials Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md rounded-2xl overflow-hidden shadow-2xl border-2 border-[#C9A24B]/40 bg-[#0B1F3A]">
              <div className="aspect-[4/5] relative" style={{ position: "relative" }}>
                <Image
                  src={f.image}
                  alt={f.name}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 480px"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050E1A] via-transparent to-transparent opacity-85" />
              </div>

              {/* Sanad Certificate Badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-[#0B1F3A]/95 backdrop-blur-md border border-[#C9A24B]/50 rounded-xl p-4 text-white shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-[#DFB75E] font-semibold uppercase tracking-wider">
                      <Shield className="w-3.5 h-3.5" />
                      Bar Council of Maharashtra & Goa
                    </div>
                    <p className="text-sm font-bold text-white mt-0.5">
                      Sanad Enrollment No. {f.sanadNumber}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-[#132B4F] flex items-center justify-center text-[#DFB75E] border border-[#C9A24B]/40 shadow-inner">
                    <Scale className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Gold Accent Frame */}
            <div className="hidden sm:block absolute -bottom-5 -right-5 w-44 h-44 border-2 border-[#C9A24B]/25 rounded-2xl -z-10 pointer-events-none" />
          </div>

          {/* Founder Bio & Leadership Summary */}
          <div className="lg:col-span-7 space-y-7">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C9A24B]/15 text-[#9C7728] text-xs font-bold uppercase tracking-wider mb-3 border border-[#C9A24B]/30">
                Chambers Leadership & Senior Counsel
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#071526] leading-tight">
                {f.name}
              </h2>
              <p className="text-sm sm:text-base font-semibold text-[#9C7728] mt-1.5 flex items-center gap-2">
                <span>{f.title}</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-600">Sanad No. {f.sanadNumber}</span>
              </p>
            </div>

            {/* Blockquote */}
            <blockquote className="border-l-3 border-[#C9A24B] pl-4 py-1 text-slate-700 italic text-sm sm:text-base leading-relaxed bg-[#F8F6F1] rounded-r-xl p-3 font-serif">
              &ldquo;In high-stakes litigation, procedural diligence is the ultimate armor. Whether before the Revenue Tribunal or the Sessions Bench, cases are won through exhaustive groundwork before the first argument is ever voiced.&rdquo;
            </blockquote>

            <p className="text-sm text-slate-700 leading-relaxed font-normal">
              {f.bio}
            </p>

            {/* Academic & Professional Credentials */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="bg-[#F8F6F1] rounded-xl p-4 border border-[#E2DDD3]">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <BookOpen className="w-4 h-4 text-[#C9A24B]" />
                  <p className="text-xs font-bold text-[#071526] uppercase tracking-wide">Legal Qualifications</p>
                </div>
                <p className="text-xs text-slate-700 font-semibold">
                  {f.education}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">Specialized in Indian Jurisprudence & Procedural Law</p>
              </div>

              <div className="bg-[#F8F6F1] rounded-xl p-4 border border-[#E2DDD3]">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <Award className="w-4 h-4 text-[#C9A24B]" />
                  <p className="text-xs font-bold text-[#071526] uppercase tracking-wide">Courtroom Standing</p>
                </div>
                <p className="text-xs text-slate-700 font-semibold">
                  16+ Years Continuous Practice (Since 2008)
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">1,770+ Matters Litigated Across Maharashtra</p>
              </div>
            </div>

            {/* Courtroom Tenets */}
            <div className="space-y-3 pt-1">
              <p className="text-xs font-bold text-[#071526] uppercase tracking-wider">
                Courtroom Tenets & Practice Ethos:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#C9A24B] shrink-0" />
                  <span>Unflinching Trial Advocacy</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#C9A24B] shrink-0" />
                  <span>Rigorous Pre-Hearing Discovery</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#C9A24B] shrink-0" />
                  <span>Total Client Billing Transparency</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#C9A24B] shrink-0" />
                  <span>Prompt Ad-Interim Stay Execution</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 flex flex-wrap items-center gap-4">
              <Link
                href="/book-consultation"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0B1F3A] hover:bg-[#142d52] text-white text-xs font-bold transition-colors shadow-md"
              >
                <Calendar className="w-4 h-4 text-[#DFB75E]" />
                <span>Consult with Adv. Amit S. Rathi</span>
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#F8F6F1] hover:bg-[#EDE8DE] text-[#071526] text-xs font-semibold border border-[#E2DDD3] transition-colors"
              >
                <Users className="w-4 h-4 text-[#C9A24B]" />
                <span>Meet the Full 8-Member Team</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
