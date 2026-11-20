import React from "react";
import { siteConfig } from "@/config/site";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { Scale } from "lucide-react";

export const metadata = {
  title: "Terms of Engagement & Service | LEGALEX",
  description: "Terms governing retainer agreements, courtroom representation, and portal access at LEGALEX Chambers.",
};

export default function TermsPage() {
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
                  Terms of Legal Engagement
                </h1>
                <p className="text-xs text-[#B88E33] font-semibold mt-0.5">
                  LEGALEX Chambers (Estd. 2009, Pune, Maharashtra)
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
              <h2 className="font-serif text-lg font-bold text-[#071526]">1. Engagement & Vakalatnama</h2>
              <p>
                Representation before any Court, Tribunal, or Revenue Authority commences strictly upon execution of a formal Vakalatnama or Memo of Appearance and payment of agreed professional retainers.
              </p>

              <h2 className="font-serif text-lg font-bold text-[#071526]">2. Courtroom Representation & Causelists</h2>
              <p>
                Court hearing dates are determined by the judicial board and cause lists issued by respective court registries. While Legalex monitors daily cause lists diligently, statutory court adjournments, bench reconstitution, and judicial administrative delays are governed by court schedule rules.
              </p>

              <h2 className="font-serif text-lg font-bold text-[#071526]">3. Portal Credentials & Access</h2>
              <p>
                Authorized portal users (Client Admins, Team Advocates, and Clients) must maintain security of their login credentials. Any suspected breach must be immediately notified to Chambers administration.
              </p>

              <h2 className="font-serif text-lg font-bold text-[#071526]">4. Jurisdiction</h2>
              <p>
                All engagement agreements, fee disputes, and arbitrations are exclusively subject to the jurisdiction of the competent courts in Pune, Maharashtra.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
