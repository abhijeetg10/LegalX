"use client";

import React, { useState } from "react";
import { siteConfig } from "@/config/site";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Send,
} from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    practiceArea: "Civil & Family",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit message");
      }

      setSuccessMessage("Your message has been securely submitted to Legalex Chambers. Our legal coordinator will get back to you promptly.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        practiceArea: "Civil & Family",
        subject: "",
        message: "",
      });
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred while transmitting your message.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F6F1]">
      <Navbar />

      <main className="flex-grow">
        {/* Header */}
        <div className="bg-[#071526] text-white py-20 sm:py-24 border-b border-[#142A4A] relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C9A24B]/10 rounded-full blur-[140px] pointer-events-none" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#132B4F] text-[#DFB75E] text-xs font-semibold border border-[#C9A24B]/30">
              <MapPin className="w-3.5 h-3.5" /> Pune Chambers & Maharashtra Jurisdiction
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              Contact Chambers
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-light">
              Connect with our litigation coordinator for court inquiries, emergency bail representation, or scheduled consultations.
            </p>
          </div>
        </div>

        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
              {/* Contact Information & Channels */}
              <div className="lg:col-span-5 space-y-8">
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#071526] mb-2">
                    Legalex Chambers & Office
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    Conveniently situated adjacent to the Shivaji Nagar District & Sessions Court complex in Pune.
                  </p>
                </div>

                {/* Direct Action Cards */}
                <div className="space-y-4">
                  {/* Phone */}
                  <a
                    href={`tel:${siteConfig.contact.phone}`}
                    className="flex items-start gap-4 p-6 rounded-2xl bg-white border border-[#E2DDD3] hover:border-[#C9A24B]/60 transition-all shadow-sm group hover:-translate-y-0.5"
                  >
                    <div className="w-11 h-11 rounded-xl bg-[#0B1F3A] flex items-center justify-center text-[#DFB75E] group-hover:scale-105 transition-transform shrink-0 shadow-sm">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Chambers Telephone
                      </h4>
                      <p className="font-serif text-base font-bold text-[#071526] mt-0.5 group-hover:text-[#9C7728] transition-colors">
                        {siteConfig.contact.phoneDisplay}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Direct line to legal coordination desk
                      </p>
                    </div>
                  </a>

                  {/* WhatsApp */}
                  <a
                    href={`https://wa.me/${siteConfig.contact.whatsapp}?text=Hello%20Legalex%20Chambers,%20I%20would%20like%20to%20inquire%20regarding%20a%20legal%20matter.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-4 p-6 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 hover:bg-emerald-50 transition-all shadow-sm group hover:-translate-y-0.5"
                  >
                    <div className="w-11 h-11 rounded-xl bg-emerald-600 flex items-center justify-center text-white group-hover:scale-105 transition-transform shrink-0 shadow-sm">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                        Direct WhatsApp Desk
                      </h4>
                      <p className="font-serif text-base font-bold text-[#071526] mt-0.5">
                        Chat on WhatsApp
                      </p>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Transmit court notices or schedule an urgent relief briefing
                      </p>
                    </div>
                  </a>

                  {/* Email */}
                  <div className="flex items-start gap-4 p-6 rounded-2xl bg-white border border-[#E2DDD3] shadow-sm">
                    <div className="w-11 h-11 rounded-xl bg-[#0B1F3A] flex items-center justify-center text-[#DFB75E] shrink-0 shadow-sm">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Official Email
                      </h4>
                      <p className="text-sm font-bold text-[#071526] mt-0.5">
                        {siteConfig.contact.email}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Encrypted case briefs & filings
                      </p>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex items-start gap-4 p-6 rounded-2xl bg-white border border-[#E2DDD3] shadow-sm">
                    <div className="w-11 h-11 rounded-xl bg-[#0B1F3A] flex items-center justify-center text-[#DFB75E] shrink-0 shadow-sm">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Consultation Timings
                      </h4>
                      <p className="text-xs font-semibold text-[#071526] mt-0.5 leading-relaxed">
                        {siteConfig.contact.hours}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Map Card */}
                <div className="bg-white rounded-2xl p-6 border border-[#E2DDD3] shadow-sm space-y-3">
                  <h4 className="text-xs font-bold text-[#071526] uppercase tracking-wider flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#C9A24B]" /> Chambers Location & Directions
                  </h4>
                  <div className="aspect-[16/9] w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                    <iframe
                      title="Legalex Chambers Location"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.189196582522!2d73.85194467598822!3d18.520430282574465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c062772be4cf%3A0xb21473950cf84ee9!2sShivajinagar%2C%20Pune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen={false}
                      loading="lazy"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {siteConfig.contact.address.chambers}, {siteConfig.contact.address.building}, {siteConfig.contact.address.street}, {siteConfig.contact.address.city} - {siteConfig.contact.address.pinCode}
                  </p>
                </div>
              </div>

              {/* Working Contact Form */}
              <div className="lg:col-span-7">
                <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E2DDD3] shadow-sm">
                  <div className="mb-8">
                    <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-bold bg-[#C9A24B]/15 text-[#9C7728] uppercase mb-2 border border-[#C9A24B]/30">
                      Registry Desk
                    </div>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#071526]">
                      Send Secure Message to Chambers
                    </h3>
                    <p className="text-xs text-slate-600 mt-1.5 font-normal">
                      All communications are privileged and treated with strict courtroom confidentiality.
                    </p>
                  </div>

                  {successMessage && (
                    <div className="mb-6 p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                      <div>
                        <p className="font-bold">Message Transmitted Successfully</p>
                        <p className="mt-0.5">{successMessage}</p>
                      </div>
                    </div>
                  )}

                  {errorMessage && (
                    <div className="mb-6 p-4 rounded-xl bg-red-50/70 border border-red-200 text-xs text-red-800 flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                      <div>
                        <p className="font-bold">Transmission Error</p>
                        <p className="mt-0.5">{errorMessage}</p>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-semibold text-[#071526] mb-1.5 uppercase tracking-wide">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Rameshwar Deshmukh"
                          className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#C9A24B] focus:border-transparent transition-all bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#071526] mb-1.5 uppercase tracking-wide">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 98220 00000"
                          className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#C9A24B] focus:border-transparent transition-all bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-semibold text-[#071526] mb-1.5 uppercase tracking-wide">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="your.email@domain.com"
                          className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#C9A24B] focus:border-transparent transition-all bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#071526] mb-1.5 uppercase tracking-wide">
                          Practice Area Concern
                        </label>
                        <select
                          value={formData.practiceArea}
                          onChange={(e) => setFormData({ ...formData, practiceArea: e.target.value })}
                          className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#C9A24B] focus:border-transparent bg-white transition-all"
                        >
                          <option value="Civil & Family">Civil & Family Law</option>
                          <option value="Revenue & Land Laws">Revenue & Land Laws (MLRC / 7/12)</option>
                          <option value="Consumer Protection">Consumer Protection Forum</option>
                          <option value="Criminal Defence & Bail">Criminal Defence & Anticipatory Bail</option>
                          <option value="MACT Accident Claims">MACT Accident Claims</option>
                          <option value="Other">Other Courtroom Matter</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#071526] mb-1.5 uppercase tracking-wide">
                        Subject / Case Reference
                      </label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="e.g. Urgent stay on illegal mutation in Gat No. 142"
                        className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#C9A24B] focus:border-transparent transition-all bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#071526] mb-1.5 uppercase tracking-wide">
                        Summary of Facts / Brief Details *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Please state key dates, court name (if already instituted), notices received, and desired legal relief..."
                        className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#C9A24B] focus:border-transparent transition-all bg-white"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 rounded-xl bg-[#0B1F3A] hover:bg-[#132B4F] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
                      >
                        {isSubmitting ? (
                          <span>Transmitting Securely...</span>
                        ) : (
                          <>
                            <Send className="w-4 h-4 text-[#DFB75E]" />
                            <span>Transmit Confidential Inquiry</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>

                  <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
                    <span>Need immediate slot confirmation?</span>
                    <Link
                      href="/book-consultation"
                      className="text-[#9C7728] font-bold hover:underline inline-flex items-center gap-1"
                    >
                      <Calendar className="w-3.5 h-3.5" /> Book Online Slot Directly →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
