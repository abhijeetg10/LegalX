"use client";

import React, { useState, useEffect } from "react";
import { siteConfig } from "@/config/site";
import { Scale, ShieldCheck } from "lucide-react";

export function BciDisclaimerModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasAcknowledged = localStorage.getItem("legalex_bci_acknowledged");
    if (!hasAcknowledged) {
      setIsOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("legalex_bci_acknowledged", "true");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0B1F3A] border-2 border-[#C9A24B] rounded-2xl max-w-lg w-full p-6 sm:p-8 text-white shadow-2xl relative">
        <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-[#132B4F]">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="LEGALEX Law Solutions"
              className="h-8 w-auto object-contain mb-1"
            />
            <p className="text-[11px] text-[#DFB75E] font-medium">
              Adv. Amit S. Rathi (Sanad 5803-2008) • Pune
            </p>
          </div>
          <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded bg-[#132B4F] text-slate-300 border border-[#C9A24B]/30 shrink-0">
            Rule 36 BCI
          </span>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-gray-300 leading-relaxed max-h-60 overflow-y-auto pr-1 border-y border-[#132B4F] py-3 my-4">
          <p>
            Under the rules of the Bar Council of India, advocates and legal practitioners are strictly prohibited from soliciting work or advertising their practice in any public format.
          </p>
          <p>
            By accessing this platform, the user acknowledges and confirms that:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-gray-300">
            <li>There has been no advertisement, personal communication, solicitation, invitation, or inducement of any sort whatsoever from Legalex Chambers or any of its advocates.</li>
            <li>The user is seeking information regarding Legalex solely for personal knowledge, academic understanding, or verifying existing case briefs.</li>
            <li>The information provided herein does not constitute legal advice nor does it create an attorney-client relationship.</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pt-2">
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C9A24B]" />
            Adv. Amit S. Rathi (Sanad No. 5803-2008)
          </div>
          <button
            type="button"
            onClick={handleAccept}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#DFB75E] to-[#C9A24B] text-[#071526] font-semibold text-xs hover:from-[#E6C372] hover:to-[#DFB75E] shadow-md transition-all cursor-pointer"
          >
            I Acknowledge & Agree
          </button>
        </div>
      </div>
    </div>
  );
}
