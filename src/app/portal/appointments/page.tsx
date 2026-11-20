import React from "react";
import prisma from "@/lib/prisma";
import { CalendarClock, Mail, Phone, CheckCircle2, Clock, MessageSquare } from "lucide-react";

export default async function AppointmentsManagementPage() {
  const [appointments, inquiries] = await Promise.all([
    prisma.appointmentSlot.findMany({
      where: { isBooked: true },
      orderBy: { date: "desc" },
    }),
    prisma.contactInquiry.findMany({
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-bold text-[#071526]">
          Consultations & Public Inquiries Desk
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Manage scheduled client consultations and website inquiries
        </p>
      </div>

      {/* Booked Consultations */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E5E0D5] shadow-sm space-y-4">
        <h2 className="font-serif text-lg font-bold text-[#071526] flex items-center gap-2">
          <CalendarClock className="w-5 h-5 text-[#C9A24B]" />
          <span>Scheduled Client Consultations ({appointments.length})</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-[10px] uppercase font-bold text-gray-400 bg-[#F8F6F1]">
                <th className="py-2 px-3">Date & Time</th>
                <th className="py-2 px-3">Client</th>
                <th className="py-2 px-3">Practice Area</th>
                <th className="py-2 px-3">Mode</th>
                <th className="py-2 px-3">Brief Notes</th>
                <th className="py-2 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {appointments.map((apt) => (
                <tr key={apt.id}>
                  <td className="py-3 px-3 font-semibold text-[#071526]">
                    {new Date(apt.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })} • {apt.startTime}
                  </td>
                  <td className="py-3 px-3">
                    <p className="font-bold text-[#0B1F3A]">{apt.clientName}</p>
                    <p className="text-[10px] text-gray-500">{apt.clientPhone} • {apt.clientEmail}</p>
                  </td>
                  <td className="py-3 px-3 text-gray-700 font-medium">
                    {apt.practiceArea}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F8F6F1] text-gray-800">
                      {apt.mode}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-gray-600 max-w-xs truncate">
                    {apt.notes || "Initial consultation brief"}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Confirmed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Website Contact Inquiries */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E5E0D5] shadow-sm space-y-4">
        <h2 className="font-serif text-lg font-bold text-[#071526] flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-[#C9A24B]" />
          <span>Website Inquiries & Confidential Messages ({inquiries.length})</span>
        </h2>

        <div className="space-y-3">
          {inquiries.map((inq) => (
            <div key={inq.id} className="p-4 rounded-2xl bg-[#F8F6F1] border border-[#E5E0D5] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#071526] text-sm">{inq.name}</span>
                <span className="text-[10px] text-gray-400">
                  {new Date(inq.createdAt).toLocaleString("en-IN")}
                </span>
              </div>
              <p className="text-[#C9A24B] font-semibold">Subject: {inq.subject}</p>
              <p className="text-gray-700 leading-relaxed">{inq.message}</p>
              <div className="pt-2 flex items-center gap-4 text-[11px] text-gray-500">
                <span>Phone: <strong>{inq.phone}</strong></span>
                <span>Email: <strong>{inq.email}</strong></span>
                <span>Area: <strong>{inq.practiceArea}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
