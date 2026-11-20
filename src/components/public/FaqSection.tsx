"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { siteConfig } from "@/config/site";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "What practice areas does Legalex specialize in?",
      a: "Legalex concentrates on five core legal domains across Maharashtra: (1) Civil & Family Law (partition suits, title declarations, injunctions, matrimonial disputes), (2) Revenue & Land Litigation (Maharashtra Land Revenue Code, 7/12 extract disputes, SDO/Collector appeals, MRT revisions), (3) Consumer Protection (State & District commissions), (4) Criminal Law & Trial Advocacy (anticipatory & regular bail, trials, High Court quashing), and (5) Motor Accident Claims Tribunal (MACT compensation claims).",
    },
    {
      q: "Who leads the litigation and what is his Bar Council enrollment?",
      a: `Legalex is headed by veteran advocate ${siteConfig.founder.name}, enrolled with the Bar Council of Maharashtra & Goa under Sanad No. ${siteConfig.founder.sanadNumber}. Adv. Amit S. Rathi has over 16 years of continuous litigation standing and leads a multidisciplinary team of 7 specialized associate advocates, legal researchers, court clerks, and accounting officers.`,
    },
    {
      q: "Where are the chambers located and what courts are covered?",
      a: `Our principal chambers are located at ${siteConfig.contact.address.chambers}, ${siteConfig.contact.address.street}, ${siteConfig.contact.address.city}, Maharashtra ${siteConfig.contact.address.pinCode}. We regularly represent clients before the Bombay High Court (Principal Bench and benches), Pune District & Sessions Courts, Maharashtra Revenue Tribunal (MRT), Collectorate Courts, and Consumer Commissions.`,
    },
    {
      q: "How does the client portal work for case tracking?",
      a: "Every client represented by Legalex receives dedicated credentials to our secure online portal. Clients can log in 24/7 to monitor cause lists, see upcoming hearing dates, download certified order copies, view itemized GST invoices, and upload requested documents directly.",
    },
    {
      q: "What is the public Document Verification feature?",
      a: "To ensure absolute authenticity and prevent fraudulent paper copies, official documents, legal notices, and certified case briefs issued by Legalex are stamped with a unique alphanumeric Verification ID and QR code. Anyone (opposing counsel, registry, or financial institutions) can verify the authenticity on our public Document Verification page.",
    },
    {
      q: "How do I schedule an in-person or virtual consultation?",
      a: "You can book directly through our online Book Consultation module, which offers real-time available time slots across Monday to Saturday. Consultations can be scheduled in-person at our Shivaji Nagar, Pune chambers or via secure video conference.",
    },
    {
      q: "What is the procedure for urgent bail or ad-interim stay orders?",
      a: "For emergency matters (such as imminent arrest or illegal demolition/dispossession), our chambers maintain a rapid-action protocol. You may contact our emergency desk directly via phone or WhatsApp at +91 99220 79879 for immediate briefing and drafting.",
    },
    {
      q: "How are professional legal fees structured?",
      a: "We believe in total financial transparency. Legal fees are structured based on case complexity, court jurisdiction, and estimated courtroom appearances. Clients receive itemized retainers, clear fee schedules, and official GST-compliant tax invoices via the portal.",
    },
    {
      q: "How does Legalex handle land mutation and 7/12 extract disputes?",
      a: "Our revenue litigation team specializes in Maharashtra Land Revenue Code (MLRC) 1966 proceedings. We handle disputed mutation entries (Ferfar) under Section 150 before Tahsildar, appeals under Section 247 before SDO/Collector, and revisions under Section 315 before the Maharashtra Revenue Tribunal.",
    },
    {
      q: "Does visiting this website violate Bar Council of India advertising rules?",
      a: "No. In strict adherence to Bar Council of India Rule 36, Section IV, this website is not an advertisement or solicitation of work. All information is published strictly for informational, educational, and verification purposes requested voluntarily by visitors.",
    },
  ];

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-24 bg-[#F8F6F1]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C9A24B]/15 text-[#9C7728] text-xs font-bold uppercase tracking-wider mb-3 border border-[#C9A24B]/30">
            <HelpCircle className="w-3.5 h-3.5" /> Frequently Asked Questions
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#071526]">
            Courtroom & Procedural FAQs
          </h2>
          <div className="w-20 h-1 bg-[#C9A24B] mx-auto my-4 rounded-full" />
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Clear answers to common questions regarding litigation representation, jurisdiction, and chambers protocols.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#E2DDD3] overflow-hidden shadow-sm hover:border-[#C9A24B]/50 transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full px-6 sm:px-8 py-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                >
                  <span className="font-serif text-base sm:text-lg font-bold text-[#071526]">
                    {faq.q}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full bg-[#F8F6F1] flex items-center justify-center text-[#C9A24B] shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-[#0B1F3A] text-[#DFB75E]" : ""
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 sm:px-8 pb-6 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 animate-in fade-in duration-150 font-normal">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
