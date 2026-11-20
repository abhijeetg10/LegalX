import React from "react";
import { ShieldCheck, Scale, Cpu, Trophy, Clock, Users } from "lucide-react";

export function WhyChooseSection() {
  const points = [
    {
      icon: <Scale className="w-6 h-6 text-[#DFB75E]" />,
      title: "16+ Years Courtroom Standing",
      desc: "Deep procedural familiarity across Bombay High Court benches, District Courts, and Maharashtra Revenue Tribunals continuously since 2009.",
    },
    {
      icon: <Cpu className="w-6 h-6 text-[#DFB75E]" />,
      title: "Client & Case SaaS Portal",
      desc: "Our proprietary portal provides 24/7 access to cause list tracking, itemized legal billing, verified order copies, and hearing reminders.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#DFB75E]" />,
      title: "Verifiable Digital Documents",
      desc: "Every order and pleading processed by Legalex features an encrypted QR-coded verification seal, protecting against counterfeit records.",
    },
    {
      icon: <Trophy className="w-6 h-6 text-[#DFB75E]" />,
      title: "Strategic Injunction Mastery",
      desc: "Decisive track record in obtaining timely ad-interim stays, status quo orders, and restraining illegal alienations or dispossession.",
    },
    {
      icon: <Clock className="w-6 h-6 text-[#DFB75E]" />,
      title: "Rigorous Procedural Compliance",
      desc: "Statutory limitation deadlines, court fee stamps, and registry procedures managed with clockwork precision by our dedicated court liaison.",
    },
    {
      icon: <Users className="w-6 h-6 text-[#DFB75E]" />,
      title: "Multidisciplinary Team Structure",
      desc: "Founder Adv. Amit S. Rathi leads 7 specialized associate advocates, legal researchers, court clerks, and accounting officers.",
    },
  ];

  return (
    <section className="py-24 bg-[#071526] text-white relative overflow-hidden border-b border-[#142A4A]">
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-[#C9A24B]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#132B4F] text-[#DFB75E] text-xs font-bold uppercase tracking-wider mb-3 border border-[#C9A24B]/30">
            The Legalex Advantage
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Why Discerning Clients Choose Legalex
          </h2>
          <div className="w-20 h-1 bg-[#C9A24B] mx-auto my-4 rounded-full" />
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light">
            Combining traditional courtroom fearlessness with modern technological transparency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {points.map((pt, idx) => (
            <div
              key={idx}
              className="bg-[#0B1F3A]/90 border border-[#C9A24B]/25 hover:border-[#C9A24B]/70 rounded-2xl p-8 hover:-translate-y-1.5 transition-all group backdrop-blur-md shadow-lg"
            >
              <div className="w-12 h-12 rounded-xl bg-[#132B4F] border border-[#C9A24B]/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {pt.icon}
              </div>
              <h3 className="font-serif text-xl font-bold text-white mb-2.5 group-hover:text-[#DFB75E] transition-colors">
                {pt.title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                {pt.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
