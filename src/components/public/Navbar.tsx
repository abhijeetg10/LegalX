"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import {
  Scale,
  Menu,
  X,
  ChevronDown,
  Calendar,
  PhoneCall,
  MapPin,
  Clock,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPracticeDropdownOpen, setIsPracticeDropdownOpen] = useState(false);
  const [isMobilePracticeOpen, setIsMobilePracticeOpen] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsPracticeDropdownOpen(false);
    setIsMobilePracticeOpen(false);
  }, [pathname]);

  // Handle scroll styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Dropdown hover delay helpers
  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setIsPracticeDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsPracticeDropdownOpen(false);
    }, 150);
  };

  // Pure public-facing essential navigation links
  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About Firm", href: "/about" },
    { label: "Practice Areas", href: "/practice-areas", hasDropdown: true },
    { label: "Case Results", href: "/case-results" },
    { label: "Insights", href: "/insights" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <>
      {/* Top Chambers Utility Bar (Desktop only, Client-focused) */}
      <div className="hidden lg:block bg-[#0A1324] text-slate-300 text-xs py-2 border-b border-[#1E2E4A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-[#D6B45F] shrink-0" />
              <span>Court Office: Shivaji Nagar, District Court Compound, Pune</span>
            </span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-[#D6B45F] shrink-0" />
              <span>Mon–Sat: 9:30 AM – 7:30 PM (Sun by Appointment)</span>
            </span>
          </div>

          <div className="flex items-center gap-5">
            <a
              href={`tel:${siteConfig.contact.phone}`}
              className="flex items-center gap-1.5 text-[#D6B45F] hover:text-white font-medium transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 shrink-0" />
              <span>Chambers Hotline: {siteConfig.contact.phoneDisplay}</span>
            </a>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Jurisdiction: {siteConfig.jurisdiction}</span>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header
        className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#101D36]/95 backdrop-blur-md shadow-xl border-b border-[#D6B45F]/20 py-3"
            : "bg-[#101D36] border-b border-[#1E2E4A] py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-6">
            
            {/* ======================================================== */}
            {/* LEFT SECTION – Brand Identity                           */}
            {/* ======================================================== */}
            <Link
              href="/"
              className="flex items-center gap-3 shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B45F] rounded-lg"
              aria-label="LEGALEX Law Solutions - Home"
            >
              <div className="flex flex-col justify-center">
                <div className="flex items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/logo.png"
                    alt="LEGALEX Law Solutions"
                    className="h-8 sm:h-9 xl:h-10 w-auto object-contain transition-transform group-hover:scale-[1.02]"
                  />
                </div>
                <p className="text-[9px] sm:text-[9.5px] text-slate-300 font-medium tracking-wider whitespace-nowrap mt-1">
                  <span className="hidden sm:inline">ESTD. {siteConfig.establishedYear} • </span>
                  ADV. AMIT S. RATHI (SANAD {siteConfig.founder.sanadNumber})
                </p>
              </div>
            </Link>

            {/* ======================================================== */}
            {/* CENTER SECTION – Pure Public Navigation                 */}
            {/* ======================================================== */}
            <nav className="hidden md:flex items-center gap-5 lg:gap-7 xl:gap-8">
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);

                if (link.hasDropdown) {
                  return (
                    <div
                      key={link.href}
                      className="relative"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      <Link
                        href={link.href}
                        className={`relative flex items-center gap-1.5 text-sm font-medium transition-colors py-1 whitespace-nowrap ${
                          isActive
                            ? "text-[#D6B45F] font-semibold"
                            : "text-slate-200 hover:text-white"
                        }`}
                      >
                        <span>{link.label}</span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${
                            isPracticeDropdownOpen ? "rotate-180 text-[#D6B45F]" : "opacity-70"
                          }`}
                        />
                        {isActive && (
                          <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#D6B45F] rounded-full shadow-[0_0_8px_rgba(214,180,95,0.6)]" />
                        )}
                      </Link>

                      {/* Dropdown Menu */}
                      {isPracticeDropdownOpen && (
                        <div
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-80 bg-[#101D36] border border-[#D6B45F]/30 rounded-xl shadow-2xl p-2.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                          onMouseEnter={handleMouseEnter}
                          onMouseLeave={handleMouseLeave}
                        >
                          <div className="px-3 py-1.5 text-[11px] font-semibold text-[#D6B45F] uppercase tracking-wider border-b border-[#1E2E4A] mb-1">
                            Core Practice Areas
                          </div>
                          {siteConfig.practiceAreas.map((area) => (
                            <Link
                              key={area.slug}
                              href={`/practice-areas/${area.slug}`}
                              className="block px-3 py-2 rounded-lg hover:bg-[#152647] transition-colors group"
                            >
                              <div className="text-xs font-semibold text-white group-hover:text-[#D6B45F] transition-colors flex items-center justify-between">
                                <span>{area.title}</span>
                                <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#D6B45F]" />
                              </div>
                              <div className="text-[11px] text-slate-300 line-clamp-1 mt-0.5">
                                {area.shortDescription}
                              </div>
                            </Link>
                          ))}
                          
                          <div className="border-t border-[#1E2E4A] mt-1 pt-1.5 space-y-1">
                            <Link
                              href="/practice-areas"
                              className="flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-semibold text-[#D6B45F] hover:text-white hover:bg-[#152647] transition-colors"
                            >
                              <span>Explore All Practice Areas</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                            <Link
                              href="/verify-document"
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] text-slate-300 hover:text-[#D6B45F] hover:bg-[#152647] transition-colors"
                            >
                              <ShieldCheck className="w-3.5 h-3.5 text-[#D6B45F]" />
                              <span>Public Document Verification</span>
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative text-sm font-medium transition-colors py-1 whitespace-nowrap ${
                      isActive
                        ? "text-[#D6B45F] font-semibold"
                        : "text-slate-200 hover:text-white"
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive && (
                      <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#D6B45F] rounded-full shadow-[0_0_8px_rgba(214,180,95,0.6)]" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* ======================================================== */}
            {/* RIGHT SECTION – Single Primary Public CTA               */}
            {/* ======================================================== */}
            <div className="hidden md:flex items-center shrink-0">
              <Link
                href="/book-consultation"
                className="h-10 px-5 rounded-lg bg-gradient-to-r from-[#DFB75E] via-[#D6B45F] to-[#C9A24B] hover:from-[#E6C372] hover:to-[#DFB75E] text-[#071526] text-xs font-bold inline-flex items-center gap-2 transition-all shadow-md hover:shadow-lg whitespace-nowrap group hover:scale-[1.02]"
              >
                <Calendar className="w-4 h-4 text-[#071526] group-hover:rotate-6 transition-transform shrink-0" />
                <span>Book Consultation</span>
              </Link>
            </div>

            {/* ======================================================== */}
            {/* MOBILE CONTROLS (< 768px)                                */}
            {/* ======================================================== */}
            <div className="md:hidden flex items-center gap-2">
              <Link
                href="/book-consultation"
                className="h-9 px-3 rounded-lg bg-gradient-to-r from-[#DFB75E] via-[#D6B45F] to-[#C9A24B] text-[#071526] text-xs font-bold inline-flex items-center gap-1 shadow-sm whitespace-nowrap"
              >
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                <span>Consult</span>
              </Link>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="h-9 w-9 rounded-lg border border-[#D6B45F]/30 bg-[#152647] text-slate-200 hover:text-white flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#D6B45F]"
                aria-label="Toggle Navigation Menu"
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* MOBILE SLIDE-DOWN DRAWER                                 */}
        {/* ======================================================== */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#0A1324] border-b border-[#1E2E4A] px-4 pt-3 pb-6 space-y-4 mt-2.5 animate-in slide-in-from-top-2 duration-200 shadow-2xl">
            {/* Public Navigation Links */}
            <div className="space-y-1">
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);

                if (link.hasDropdown) {
                  return (
                    <div key={link.href} className="space-y-1">
                      <button
                        type="button"
                        onClick={() => setIsMobilePracticeOpen(!isMobilePracticeOpen)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-[#152647] text-[#D6B45F] font-semibold"
                            : "text-slate-200 hover:bg-[#152647]/50"
                        }`}
                      >
                        <span>{link.label}</span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            isMobilePracticeOpen ? "rotate-180 text-[#D6B45F]" : "opacity-70"
                          }`}
                        />
                      </button>

                      {isMobilePracticeOpen && (
                        <div className="pl-4 pr-1 py-1 space-y-1 border-l-2 border-[#D6B45F]/30 ml-3">
                          {siteConfig.practiceAreas.map((area) => (
                            <Link
                              key={area.slug}
                              href={`/practice-areas/${area.slug}`}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="block px-2.5 py-1.5 rounded-md text-xs text-slate-300 hover:text-[#D6B45F] hover:bg-[#152647]/40 transition-colors"
                            >
                              {area.title}
                            </Link>
                          ))}
                          <Link
                            href="/practice-areas"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block px-2.5 py-1.5 text-xs font-semibold text-[#D6B45F] hover:underline"
                          >
                            All 5 Practice Areas →
                          </Link>
                          <Link
                            href="/verify-document"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block px-2.5 py-1.5 text-xs text-slate-300 hover:text-[#D6B45F]"
                          >
                            Verify Official Seal →
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-[#152647] text-[#D6B45F] font-semibold"
                        : "text-slate-200 hover:bg-[#152647]/50 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Primary CTA */}
            <div className="pt-3 border-t border-[#1E2E4A]">
              <Link
                href="/book-consultation"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full h-11 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#DFB75E] via-[#D6B45F] to-[#C9A24B] text-[#071526] text-xs font-bold shadow-md"
              >
                <Calendar className="w-4 h-4 shrink-0" />
                <span>Book Legal Consultation</span>
              </Link>
            </div>

            {/* Mobile Contact Quick Details */}
            <div className="pt-2 text-[11px] text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#D6B45F]" />
                Pune District Court
              </span>
              <a
                href={`tel:${siteConfig.contact.phone}`}
                className="text-[#D6B45F] font-semibold flex items-center gap-1"
              >
                <PhoneCall className="w-3 h-3" />
                {siteConfig.contact.phoneDisplay}
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
