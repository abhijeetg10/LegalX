import React from "react";
import { Star, Quote, ShieldCheck } from "lucide-react";

interface TestimonialItem {
  id: string;
  clientName: string;
  clientRole: string;
  practiceArea: string;
  feedback: string;
  rating: number;
  caseYear: string;
}

export function TestimonialsSection({ testimonials }: { testimonials?: TestimonialItem[] }) {
  const defaultTestimonials: TestimonialItem[] = [
    {
      id: "t1",
      clientName: "Rajesh S. Sharma",
      clientRole: "Managing Director, Rameshwar Industries Ltd.",
      practiceArea: "Civil & Commercial Litigation",
      feedback: "Adv. Amit S. Rathi and the Legalex team represented our manufacturing group in an intricate land injunction dispute. Their command over statutory nuances and strategic cross-examination secured an interim injunction that saved our operational plant.",
      rating: 5,
      caseYear: "2023",
    },
    {
      id: "t2",
      clientName: "Sunil V. Kadam",
      clientRole: "Founder, Sahyadri Agro Infrastructure",
      practiceArea: "Revenue & Land Litigation",
      feedback: "When our 12-acre agricultural consolidation was unlawfully contested in the revenue records, Legalex pursued the matter up to the Maharashtra Revenue Tribunal. Their depth in the Maharashtra Land Revenue Code is peerless.",
      rating: 5,
      caseYear: "2022",
    },
    {
      id: "t3",
      clientName: "Meenakshi R. Iyer",
      clientRole: "Executive Director, Iyer Biotech",
      practiceArea: "Consumer Protection Commission",
      feedback: "After waiting five agonizing years for our luxury commercial premises, Legalex represented us before the State Consumer Commission. They recovered our entire investment with 11% interest and substantial damages.",
      rating: 5,
      caseYear: "2024",
    },
  ];

  const list = testimonials && testimonials.length > 0 ? testimonials.slice(0, 6) : defaultTestimonials;

  return (
    <section className="py-24 bg-white border-b border-[#E2DDD3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C9A24B]/15 text-[#9C7728] text-xs font-bold uppercase tracking-wider mb-3 border border-[#C9A24B]/30">
            Client Voices & Decisive Outcomes
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#071526]">
            Words From Those We Champion
          </h2>
          <div className="w-20 h-1 bg-[#C9A24B] mx-auto my-4 rounded-full" />
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Direct feedback from industrial leaders, agriculturalists, and families across Maharashtra represented by Legalex.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {list.map((item) => (
            <div
              key={item.id}
              className="bg-[#F8F6F1] rounded-2xl p-8 border border-[#E2DDD3] flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-[#C9A24B]/60 hover:-translate-y-1.5 transition-all relative"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-1">
                    {[...Array(item.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#C9A24B] text-[#C9A24B]" />
                    ))}
                  </div>
                  <Quote className="w-7 h-7 text-[#C9A24B]/35" />
                </div>

                <div className="inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold bg-[#0B1F3A] text-[#DFB75E] mb-4">
                  {item.practiceArea}
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic mb-6 font-normal">
                  &ldquo;{item.feedback}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-[#E2DDD3] flex items-center justify-between">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#071526]">
                    {item.clientName}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1">
                    {item.clientRole}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 font-medium block">
                    {item.caseYear}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-semibold">
                    <ShieldCheck className="w-3 h-3" /> Verified
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
