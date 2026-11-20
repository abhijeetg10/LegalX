import React from "react";
import { MessageSquareText, FileText, Gavel, CheckCheck } from "lucide-react";

export function HowWeWorkTimeline() {
  const steps = [
    {
      num: "01",
      icon: <MessageSquareText className="w-5 h-5 text-[#DFB75E]" />,
      title: "Strategic Brief & Discovery",
      desc: "Comprehensive review of all court records, 7/12 extracts, previous notices, and limitation periods to evaluate litigation merits.",
    },
    {
      num: "02",
      icon: <FileText className="w-5 h-5 text-[#DFB75E]" />,
      title: "Precision Pleadings & Filing",
      desc: "Drafting bulletproof plaints, affidavits, and interlocutory stay petitions supported by High Court & Supreme Court precedents.",
    },
    {
      num: "03",
      icon: <Gavel className="w-5 h-5 text-[#DFB75E]" />,
      title: "Courtroom Advocacy & Trial",
      desc: "Lead trial advocacy by Adv. Amit S. Rathi, vigorous witness cross-examinations, and continuous real-time hearing updates.",
    },
    {
      num: "04",
      icon: <CheckCheck className="w-5 h-5 text-[#DFB75E]" />,
      title: "Execution, Decrees & Orders",
      desc: "Ensuring effective compliance through execution proceedings, mutation updates in land records, or compensation disbursement.",
    },
  ];

  return (
    <section className="py-24 bg-[#F8F6F1] border-b border-[#E2DDD3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C9A24B]/15 text-[#9C7728] text-xs font-bold uppercase tracking-wider mb-3 border border-[#C9A24B]/30">
            Procedural Methodology
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#071526]">
            How We Navigate Litigation
          </h2>
          <div className="w-20 h-1 bg-[#C9A24B] mx-auto my-4 rounded-full" />
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Every legal matter moves through our time-tested 4-stage framework, ensuring accountability and measurable progress at every hearing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((st, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-7 border border-[#E2DDD3] shadow-sm hover:shadow-xl hover:border-[#C9A24B]/60 hover:-translate-y-1.5 transition-all relative flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-11 h-11 rounded-xl bg-[#0B1F3A] flex items-center justify-center shadow-md group-hover:bg-[#132B4F] transition-colors">
                    {st.icon}
                  </div>
                  <span className="font-serif text-3xl font-bold text-[#C9A24B]/50 group-hover:text-[#C9A24B] transition-colors">
                    {st.num}
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-[#071526] mb-2.5 group-hover:text-[#9C7728] transition-colors">
                  {st.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {st.desc}
                </p>
              </div>

              <div className="mt-6 pt-3.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-[#9C7728]">
                <span>Stage {idx + 1} of 4</span>
                <span className="text-slate-400 font-normal">Chambers Protocol</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
