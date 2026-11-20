import React from "react";
import { siteConfig } from "@/config/site";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { Scale, ShieldAlert } from "lucide-react";

export const metadata = {
  title: "Bar Council of India Disclaimer | LEGALEX Chambers",
  description: "Mandatory compliance disclaimer under Bar Council of India Rule 36, Section IV.",
};

export default function DisclaimerPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8F6F1]">
      <Navbar />

      <main className="flex-grow py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E5E0D5] shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-6 border-b border-gray-100">
              <div className="w-12 h-12 rounded-2xl bg-[#0B1F3A] flex items-center justify-center text-[#DFB75E] shrink-0">
                <Scale className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#071526]">
                  Bar Council of India Compliance Disclaimer
                </h1>
                <p className="text-xs text-[#B88E33] font-semibold mt-0.5">
                  Rule 36, Section IV of Bar Council of India Rules
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
              <p className="font-semibold text-[#071526]">
                Please review this regulatory compliance declaration carefully before proceeding further:
              </p>

              <p>
                As per the rules of the Bar Council of India (specifically Rule 36, Section IV, Chapter II, Part VI), advocates and legal consultants are legally restrained from advertising, soliciting clients, or promoting their practice either directly or indirectly through any public medium.
              </p>

              <div className="p-5 rounded-2xl bg-[#F8F6F1] border border-[#E5E0D5] space-y-2 text-xs">
                <p className="font-bold text-[#071526] uppercase tracking-wider">
                  By accessing this website (legalex.in), the user unequivocally confirms and acknowledges that:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-gray-700">
                  <li>
                    There has been no advertisement, personal solicitation, invitation, or inducement of any sort whatsoever from Legalex Chambers, Adv. Amit S. Rathi, or any associate to solicit work through this website.
                  </li>
                  <li>
                    The user desires to obtain information about Legalex Chambers solely for their own information, educational interest, academic research, or verifying official document authenticity.
                  </li>
                  <li>
                    The information provided on this platform is provided solely at the user&apos;s voluntary request and does not constitute legal advice or opinion under the Advocates Act, 1961.
                  </li>
                  <li>
                    Transmission, receipt, or use of this website does not invite or establish an advocate-client relationship.
                  </li>
                  <li>
                    Legalex Chambers is not liable for any action taken by any user relying upon material or commentary provided on this website. For specific legal issues, users must consult formal independent legal counsel.
                  </li>
                </ul>
              </div>

              <p>
                All materials, case briefs, and statutory commentaries published on this site are the intellectual property of Legalex Chambers (established 2009, registered trademark 2009) and Adv. Amit S. Rathi (Sanad No. 5803-2008).
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
