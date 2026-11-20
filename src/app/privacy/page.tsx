import React from "react";
import { siteConfig } from "@/config/site";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Privacy & Client Confidentiality Policy | LEGALEX",
  description: "Strict privacy standards, encrypted document handling, and client confidentiality policies at LEGALEX Chambers.",
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8F6F1]">
      <Navbar />

      <main className="flex-grow py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E5E0D5] shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-6 border-b border-gray-100">
              <div className="w-12 h-12 rounded-2xl bg-[#0B1F3A] flex items-center justify-center text-[#DFB75E] shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#071526]">
                  Privacy & Client Privilege Policy
                </h1>
                <p className="text-xs text-[#B88E33] font-semibold mt-0.5">
                  Privileged Communications & Encrypted Data Retention
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
              <h2 className="font-serif text-lg font-bold text-[#071526]">1. Advocate-Client Professional Privilege</h2>
              <p>
                Under Section 126 and 129 of the Indian Evidence Act, 1872 / Bharatiya Sakshya Adhiniyam, communications between clients and their advocates are statutorily privileged. Legalex Chambers maintains stringent data confidentiality protocols across all physical case files and digital records.
              </p>

              <h2 className="font-serif text-lg font-bold text-[#071526]">2. Information We Collect</h2>
              <p>
                We collect contact details, KYC identifiers (masked Aadhaar/PAN), court case numbers, and litigation briefs provided voluntarily when scheduling consultations, submitting contact requests, or using the client management portal.
              </p>

              <h2 className="font-serif text-lg font-bold text-[#071526]">3. Document Storage & Verification</h2>
              <p>
                Uploaded documents, certified court orders, and petitions are stored in encrypted environments. Public verification hashes only expose cryptographic validation tokens and do not disclose privileged confidential case strategies to unauthorized third parties.
              </p>

              <h2 className="font-serif text-lg font-bold text-[#071526]">4. Contact for Privacy Inquiries</h2>
              <p>
                For questions regarding data retention or privilege, please write to our Chambers Data Officer at {siteConfig.contact.email} or call {siteConfig.contact.phoneDisplay}.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
