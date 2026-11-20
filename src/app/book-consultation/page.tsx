"use client";

import React, { useState, useEffect } from "react";
import { siteConfig } from "@/config/site";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import {
  Calendar,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  Video,
  MapPin,
  Scale,
  ArrowRight,
  ArrowLeft,
  Building,
} from "lucide-react";
import Link from "next/link";

interface Slot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
}

export default function BookConsultationPage() {
  const [step, setStep] = useState(1);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(true);

  // Form selections
  const [selectedPractice, setSelectedPractice] = useState("Revenue & Land Litigation");
  const [selectedMode, setSelectedMode] = useState("In-Person Office (Pune)");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlotId, setSelectedSlotId] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [confirmedAppointment, setConfirmedAppointment] = useState<any>(null);

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      setLoadingSlots(true);
      const res = await fetch("/api/appointments");
      const data = await res.json();
      if (data.slots && data.slots.length > 0) {
        setSlots(data.slots);
        // Pre-select first available date
        const firstDate = new Date(data.slots[0].date).toISOString().split("T")[0];
        setSelectedDate(firstDate);
      }
    } catch (err) {
      console.error("Error loading slots:", err);
    } finally {
      setLoadingSlots(false);
    }
  };

  // Group slots by date string YYYY-MM-DD
  const uniqueDates = Array.from(
    new Set(
      slots.map((s) => new Date(s.date).toISOString().split("T")[0])
    )
  );

  const availableSlotsForDate = slots.filter((s) => {
    const sDate = new Date(s.date).toISOString().split("T")[0];
    return sDate === selectedDate;
  });

  const handleNextStep1 = () => {
    setStep(2);
  };

  const handleNextStep2 = () => {
    if (!selectedSlotId) {
      setErrorMsg("Please select an available consultation time slot.");
      return;
    }
    setErrorMsg("");
    setStep(3);
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slotId: selectedSlotId,
          clientName: formData.name,
          clientEmail: formData.email,
          clientPhone: formData.phone,
          practiceArea: selectedPractice,
          mode: selectedMode,
          notes: formData.notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to confirm consultation slot.");
      }

      setConfirmedAppointment(data.appointment);
      setStep(4);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to book appointment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F6F1]">
      <Navbar />

      <main className="flex-grow">
        {/* Header */}
        <div className="bg-[#071526] text-white py-14 border-b border-[#132B4F]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#132B4F] text-[#DFB75E] text-xs font-semibold mb-3 border border-[#C9A24B]/30">
              <Calendar className="w-3.5 h-3.5" /> Real-Time Chambers Schedule
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
              Book Courtroom Consultation
            </h1>
            <p className="text-gray-300 text-xs sm:text-sm">
              Schedule an in-person or video conference consultation with Adv. Amit S. Rathi and senior associates.
            </p>
          </div>
        </div>

        <section className="py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Step Progress Indicator */}
            {step < 4 && (
              <div className="mb-8">
                <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-2">
                  <span className={step >= 1 ? "text-[#0B1F3A] font-bold" : ""}>
                    1. Practice & Mode
                  </span>
                  <span className={step >= 2 ? "text-[#0B1F3A] font-bold" : ""}>
                    2. Date & Time Slot
                  </span>
                  <span className={step >= 3 ? "text-[#0B1F3A] font-bold" : ""}>
                    3. Client Details
                  </span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#C9A24B] transition-all duration-300"
                    style={{ width: `${(step / 3) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="mb-6 p-4 rounded-xl bg-[#E11D48]/10 border border-[#E11D48]/30 text-xs text-[#E11D48] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Step 1: Practice & Mode */}
            {step === 1 && (
              <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#E5E0D5] shadow-sm space-y-6 animate-in fade-in">
                <h3 className="font-serif text-xl font-bold text-[#071526]">
                  Step 1: Select Matter Domain & Consultation Mode
                </h3>

                <div>
                  <label className="block text-xs font-bold text-[#071526] uppercase tracking-wider mb-2">
                    Litigation Practice Domain:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      "Revenue & Land Litigation",
                      "Civil & Family Disputes",
                      "Consumer Protection Forum",
                      "Criminal Defence & Bail",
                      "MACT Accident Claims",
                      "General Legal Opinion",
                    ].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setSelectedPractice(p)}
                        className={`p-3.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                          selectedPractice === p
                            ? "bg-[#0B1F3A] text-white border-[#C9A24B]"
                            : "bg-[#F8F6F1] text-gray-700 border-[#E5E0D5] hover:border-gray-400"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <label className="block text-xs font-bold text-[#071526] uppercase tracking-wider mb-2">
                    Consultation Format:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setSelectedMode("In-Person Office (Pune)")}
                      className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                        selectedMode.includes("In-Person")
                          ? "bg-[#0B1F3A] text-white border-[#C9A24B]"
                          : "bg-[#F8F6F1] text-gray-700 border-[#E5E0D5] hover:border-gray-400"
                      }`}
                    >
                      <Building className="w-5 h-5 text-[#C9A24B] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold">In-Person Chambers (Pune)</p>
                        <p className={`text-[11px] mt-0.5 ${selectedMode.includes("In-Person") ? "text-gray-300" : "text-gray-500"}`}>
                          Suite 402, Prestige Commercial Arcade, Shivaji Nagar, Pune
                        </p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedMode("Video Conference")}
                      className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                        selectedMode.includes("Video")
                          ? "bg-[#0B1F3A] text-white border-[#C9A24B]"
                          : "bg-[#F8F6F1] text-gray-700 border-[#E5E0D5] hover:border-gray-400"
                      }`}
                    >
                      <Video className="w-5 h-5 text-[#C9A24B] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold">Video Conference</p>
                        <p className={`text-[11px] mt-0.5 ${selectedMode.includes("Video") ? "text-gray-300" : "text-gray-500"}`}>
                          Encrypted Google Meet link dispatched upon booking
                        </p>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={handleNextStep1}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0B1F3A] hover:bg-[#132B4F] text-white font-bold text-xs transition-all shadow-md cursor-pointer"
                  >
                    <span>Proceed to Slot Selection</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Date & Slot */}
            {step === 2 && (
              <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#E5E0D5] shadow-sm space-y-6 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-xl font-bold text-[#071526]">
                    Step 2: Choose Date & Available Time Slot
                  </h3>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs text-gray-500 hover:text-[#0B1F3A] flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </button>
                </div>

                {loadingSlots ? (
                  <div className="py-12 text-center text-xs text-gray-500">
                    Loading live appointment calendar from Chambers database...
                  </div>
                ) : uniqueDates.length === 0 ? (
                  <div className="py-8 text-center text-xs text-gray-500">
                    No open slots found for the next two weeks. Please contact Chambers directly.
                  </div>
                ) : (
                  <>
                    {/* Date Horizontal Picker */}
                    <div>
                      <label className="block text-xs font-bold text-[#071526] uppercase tracking-wider mb-2">
                        Select Date:
                      </label>
                      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                        {uniqueDates.slice(0, 10).map((dStr) => {
                          const dateObj = new Date(dStr + "T00:00:00");
                          const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" });
                          const dayNum = dateObj.getDate();
                          const monthName = dateObj.toLocaleDateString("en-US", { month: "short" });
                          const isSelected = selectedDate === dStr;

                          return (
                            <button
                              key={dStr}
                              type="button"
                              onClick={() => {
                                setSelectedDate(dStr);
                                setSelectedSlotId("");
                              }}
                              className={`flex-shrink-0 w-20 py-3 rounded-2xl border text-center transition-all ${
                                isSelected
                                  ? "bg-[#0B1F3A] text-white border-[#C9A24B] shadow-md scale-105"
                                  : "bg-[#F8F6F1] text-gray-700 border-[#E5E0D5] hover:border-gray-400"
                              }`}
                            >
                              <p className="text-[10px] uppercase font-bold text-[#C9A24B]">
                                {dayName}
                              </p>
                              <p className="text-lg font-bold font-serif my-0.5">
                                {dayNum}
                              </p>
                              <p className="text-[10px] text-gray-400">
                                {monthName}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Time Slots for Selected Date */}
                    <div>
                      <label className="block text-xs font-bold text-[#071526] uppercase tracking-wider mb-2">
                        Available Chambers Time Slots:
                      </label>
                      {availableSlotsForDate.length === 0 ? (
                        <p className="text-xs text-gray-500 py-4">
                          All consultation slots for this date are fully reserved. Please pick another date.
                        </p>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {availableSlotsForDate.map((slot) => {
                            const isSelected = selectedSlotId === slot.id;
                            return (
                              <button
                                key={slot.id}
                                type="button"
                                onClick={() => setSelectedSlotId(slot.id)}
                                className={`p-3 rounded-xl border text-center text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                                  isSelected
                                    ? "bg-[#0B1F3A] text-[#DFB75E] border-[#C9A24B] shadow-sm font-bold"
                                    : "bg-[#F8F6F1] text-gray-700 border-[#E5E0D5] hover:border-gray-400"
                                }`}
                              >
                                <Clock className="w-3.5 h-3.5" />
                                <span>{slot.startTime}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div className="pt-4 flex justify-between items-center">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-700 hover:bg-gray-50"
                      >
                        Previous Step
                      </button>
                      <button
                        type="button"
                        onClick={handleNextStep2}
                        disabled={!selectedSlotId}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0B1F3A] hover:bg-[#132B4F] text-white font-bold text-xs transition-all shadow-md disabled:opacity-50 cursor-pointer"
                      >
                        <span>Next: Enter Contact Info</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Step 3: Client Info */}
            {step === 3 && (
              <form
                onSubmit={handleConfirmBooking}
                className="bg-white rounded-3xl p-8 sm:p-10 border border-[#E5E0D5] shadow-sm space-y-6 animate-in fade-in"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-xl font-bold text-[#071526]">
                    Step 3: Client Information & Matter Summary
                  </h3>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-xs text-gray-500 hover:text-[#0B1F3A] flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </button>
                </div>

                {/* Booking Summary Pill */}
                <div className="p-4 rounded-xl bg-[#F8F6F1] border border-[#E5E0D5] flex flex-wrap items-center justify-between gap-3 text-xs text-gray-700">
                  <div>
                    <span className="font-semibold text-[#0B1F3A]">Domain:</span> {selectedPractice}
                  </div>
                  <div>
                    <span className="font-semibold text-[#0B1F3A]">Date:</span> {selectedDate}
                  </div>
                  <div>
                    <span className="font-semibold text-[#0B1F3A]">Mode:</span> {selectedMode}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#071526] mb-1.5">
                      Client Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Adv. or Mr./Ms. Rameshwar Deshmukh"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C9A24B] focus:border-transparent transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#071526] mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="client@company.com"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C9A24B] focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#071526] mb-1.5">
                        Mobile Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 99220 00000"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C9A24B] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#071526] mb-1.5">
                      Brief Matter Summary / Court Details (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Mention any existing suit or FIR numbers, upcoming hearing dates, or specific questions..."
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C9A24B] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-700 hover:bg-gray-50"
                  >
                    Change Slot
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#DFB75E] to-[#C9A24B] text-[#071526] font-bold text-xs hover:from-[#E6C372] hover:to-[#DFB75E] transition-all shadow-md disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span>Reserving Slot...</span>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirm Consultation Appointment</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Step 4: Confirmed State */}
            {step === 4 && confirmedAppointment && (
              <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-[#C9A24B] shadow-2xl text-center space-y-6 animate-in zoom-in-95">
                <div className="w-16 h-16 rounded-full bg-[#059669]/10 text-[#059669] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#C9A24B]/15 text-[#9C7728] uppercase mb-2">
                    Booking Confirmed
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#071526]">
                    Consultation Confirmed with Legalex Chambers
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">
                    Your appointment has been registered directly into the Chambers cause list scheduler.
                  </p>
                </div>

                {/* Details Card */}
                <div className="bg-[#F8F6F1] rounded-2xl p-6 border border-[#E5E0D5] text-left text-xs space-y-3 max-w-md mx-auto">
                  <div className="flex justify-between py-1 border-b border-gray-200">
                    <span className="text-gray-500">Client Name:</span>
                    <span className="font-bold text-[#071526]">{confirmedAppointment.clientName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-200">
                    <span className="text-gray-500">Practice Area:</span>
                    <span className="font-bold text-[#071526]">{confirmedAppointment.practiceArea}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-200">
                    <span className="text-gray-500">Slot Time:</span>
                    <span className="font-bold text-[#071526]">{confirmedAppointment.startTime} - {confirmedAppointment.endTime}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-200">
                    <span className="text-gray-500">Format:</span>
                    <span className="font-bold text-[#071526]">{confirmedAppointment.mode}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">Confirmation Reference:</span>
                    <span className="font-mono font-bold text-[#C9A24B]">{confirmedAppointment.id.slice(-8).toUpperCase()}</span>
                  </div>
                </div>

                <div className="pt-2 text-xs text-gray-600 max-w-md mx-auto">
                  <p>
                    A calendar invitation and instructions have been routed to <strong>{confirmedAppointment.clientEmail}</strong>. If attending in person, please bring certified copies of all relevant notices and 7/12 extracts.
                  </p>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    href="/"
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#0B1F3A] hover:bg-[#132B4F] text-white font-bold text-xs transition-all"
                  >
                    Return to Homepage
                  </Link>
                  <Link
                    href="/login"
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-[#C9A24B] text-[#071526] hover:bg-[#C9A24B]/10 font-bold text-xs transition-all"
                  >
                    Access Client Portal →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
