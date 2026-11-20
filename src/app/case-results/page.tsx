import React from "react";
import prisma from "@/lib/prisma";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { Scale, Award, Landmark, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Landmark Case Results & Outcomes | LEGALEX Chambers",
  description: "Review landmark orders, stay victories, and final decrees secured by LEGALEX Chambers across Maharashtra courts.",
};

export default async function CaseResultsPage() {
  let results: any[] = [];
  try {
    results = await prisma.caseResult.findMany({
      orderBy: { year: "desc" },
    });
  } catch (err) {
    console.error("Case results fetch error:", err);
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
              <Award className="w-3.5 h-3.5" /> High Court & Tribunal Representations
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              Landmark Case Results
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-light">
              A curated selection of orders, decrees, and settlements achieved through meticulous advocacy across Maharashtra.
            </p>
          </div>
        </div>

        {/* Results Grid */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {results.map((r) => (
                <div
                  key={r.id}
                  className="bg-white rounded-2xl p-8 border border-[#E2DDD3] shadow-sm hover:shadow-xl hover:border-[#C9A24B]/60 hover:-translate-y-1.5 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-4 pb-3 border-b border-slate-100">
                      <span className="flex items-center gap-1.5 font-semibold text-[#0B1F3A]">
                        <Landmark className="w-3.5 h-3.5 text-[#C9A24B]" /> {r.forum}
                      </span>
                      <span className="bg-[#F8F6F1] px-2.5 py-0.5 rounded font-mono text-[11px] font-medium text-slate-600">
                        {r.year}
                      </span>
                    </div>

                    <div className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#C9A24B]/15 text-[#9C7728] mb-3 uppercase tracking-wider">
                      {r.practiceArea.replace("_", " ")}
                    </div>

                    <h2 className="font-serif text-lg font-bold text-[#071526] mb-3 leading-snug group-hover:text-[#9C7728] transition-colors">
                      {r.title}
                    </h2>

                    <p className="text-xs text-slate-600 leading-relaxed mb-6 font-normal">
                      {r.summary}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                          Judicial Outcome
                        </p>
                        <p className="text-xs font-bold text-emerald-700 leading-snug mt-0.5">
                          {r.outcome}
                        </p>
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
