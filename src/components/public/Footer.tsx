import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import {
  Scale,
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#071526] text-gray-300 border-t border-[#132B4F] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top 4-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Firm Identity */}
          <div className="space-y-4">
            <Link href="/" className="inline-block group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="LEGALEX Law Solutions"
                className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </Link>
            <p className="text-xs text-gray-400 leading-relaxed">
              Established in {siteConfig.establishedYear} • Trademark Registered {siteConfig.trademarkRegisteredYear}.
              Authoritative litigation advocacy, land revenue arbitration, and constitutional representation across Maharashtra.
            </p>
            <div className="pt-2 text-xs text-gray-300 border-t border-[#132B4F] space-y-1">
              <p className="font-semibold text-white">Lead Counsel & Director:</p>
              <p className="text-[#DFB75E] font-medium">{siteConfig.founder.name}</p>
              <p className="text-gray-400 text-[11px]">Sanad No. {siteConfig.founder.sanadNumber}</p>
              <p className="text-gray-400 text-[11px]">{siteConfig.founder.barCouncil}</p>
            </div>
          </div>

          {/* Col 2: Practice Areas */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-b border-[#C9A24B]/30 pb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C9A24B]" />
              Litigation Practice
            </h4>
            <ul className="space-y-2.5 text-xs">
              {siteConfig.practiceAreas.map((pa) => (
                <li key={pa.slug}>
                  <Link
                    href={`/practice-areas/${pa.slug}`}
                    className="hover:text-[#DFB75E] transition-colors flex items-center gap-1.5"
                  >
                    <span className="text-[#C9A24B]">›</span> {pa.title}
                  </Link>
                </li>
              ))}
              <li className="pt-1">
                <Link
                  href="/verify-document"
                  className="inline-flex items-center gap-1 text-[#DFB75E] hover:underline font-semibold"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Public Document Verification Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Links & Portal Access */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-b border-[#C9A24B]/30 pb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C9A24B]" />
              Navigation & Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-[#DFB75E] transition-colors">
                  About Chambers & 8-Member Team
                </Link>
              </li>
              <li>
                <Link href="/case-results" className="hover:text-[#DFB75E] transition-colors">
                  Landmark Case Outcomes & Orders
                </Link>
              </li>
              <li>
                <Link href="/insights" className="hover:text-[#DFB75E] transition-colors">
                  Legal Insights & Maharashtra Jurisprudence
                </Link>
              </li>
              <li>
                <Link href="/book-consultation" className="hover:text-[#DFB75E] transition-colors">
                  Book Courtroom Consultation Slot
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-[#DFB75E] font-medium hover:underline">
                  Client & Team Portal Login →
                </Link>
              </li>
              <li className="pt-2 border-t border-[#132B4F]">
                <div className="bg-[#132B4F]/60 p-2.5 rounded-lg border border-[#C9A24B]/20">
                  <p className="text-[11px] text-gray-300 font-medium">Jurisdiction:</p>
                  <p className="text-xs text-white font-semibold">{siteConfig.jurisdiction}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">High Court & District Courts</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Col 4: Chambers Location & Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-b border-[#C9A24B]/30 pb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C9A24B]" />
              Chambers Location
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C9A24B] shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">{siteConfig.contact.address.chambers}</p>
                  <p className="text-gray-400">{siteConfig.contact.address.building}</p>
                  <p className="text-gray-400">{siteConfig.contact.address.street}</p>
                  <p className="text-gray-400">{siteConfig.contact.address.city}, {siteConfig.contact.address.state} - {siteConfig.contact.address.pinCode}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C9A24B] shrink-0" />
                <a href={`tel:${siteConfig.contact.phone}`} className="text-white hover:text-[#DFB75E]">
                  {siteConfig.contact.phoneDisplay}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C9A24B] shrink-0" />
                <a href={`mailto:${siteConfig.contact.email}`} className="text-white hover:text-[#DFB75E]">
                  {siteConfig.contact.email}
                </a>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#C9A24B] shrink-0 mt-0.5" />
                <p className="text-gray-400 text-[11px]">{siteConfig.contact.hours}</p>
              </div>

              <a
                href={siteConfig.contact.address.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#DFB75E] hover:underline font-medium pt-1"
              >
                <span>View on Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* BCI Mandatory Disclaimer Box */}
        <div className="bg-[#0B1F3A] border border-[#C9A24B]/30 rounded-xl p-4 mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#DFB75E] uppercase tracking-wider mb-1.5">
            <ShieldCheck className="w-4 h-4" />
            {siteConfig.bciDisclaimer.rule} Compliance Notice
          </div>
          <p className="text-[11px] text-gray-400 leading-relaxed">
            {siteConfig.bciDisclaimer.text}
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#132B4F] pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>
            © {new Date().getFullYear()} {siteConfig.name} Chambers & Advocates. All rights reserved. Registered Trademark {siteConfig.trademarkRegisteredYear}.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/disclaimer" className="hover:text-white transition-colors">
              BCI Disclaimer
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Engagement
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
