import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { siteConfig } from "@/config/site";
import { Settings, Shield, User, Globe, Lock, CheckCircle2 } from "lucide-react";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="font-serif text-2xl font-bold text-[#071526]">
          Portal Account & Firm Settings
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Manage user profile, credentials, and regional localization preferences
        </p>
      </div>

      {/* User Profile Card */}
      <div className="bg-white rounded-3xl p-7 border border-[#E5E0D5] shadow-sm space-y-4">
        <h2 className="font-serif text-base font-bold text-[#071526] flex items-center gap-2">
          <User className="w-4 h-4 text-[#C9A24B]" />
          <span>Active User Profile</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-[#F8F6F1] border border-[#E5E0D5]">
            <span className="text-gray-500 block text-[10px] uppercase font-semibold">Account Holder</span>
            <span className="font-bold text-[#071526] text-sm">{session?.user?.name}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8F6F1] border border-[#E5E0D5]">
            <span className="text-gray-500 block text-[10px] uppercase font-semibold">Registered Email</span>
            <span className="font-bold text-[#071526] text-sm">{session?.user?.email}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8F6F1] border border-[#E5E0D5]">
            <span className="text-gray-500 block text-[10px] uppercase font-semibold">Security Role</span>
            <span className="font-bold text-[#C9A24B] text-sm font-mono">{(session?.user as any)?.role}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8F6F1] border border-[#E5E0D5]">
            <span className="text-gray-500 block text-[10px] uppercase font-semibold">Authentication Method</span>
            <span className="font-bold text-[#071526] text-sm">Credentials & OTP Active</span>
          </div>
        </div>
      </div>

      {/* Localization Readiness (Hindi / Marathi) */}
      <div className="bg-white rounded-3xl p-7 border border-[#E5E0D5] shadow-sm space-y-4">
        <h2 className="font-serif text-base font-bold text-[#071526] flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#C9A24B]" />
          <span>Language & Regional Jurisdiction Preference</span>
        </h2>
        <p className="text-xs text-gray-600">
          The LEGALEX platform architecture is pre-configured for multi-language courtroom localization across Maharashtra.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[#0B1F3A] text-white flex items-center justify-between border border-[#C9A24B]">
            <div>
              <p className="font-bold">English (Default)</p>
              <p className="text-[10px] text-[#DFB75E]">Active UI Interface</p>
            </div>
            <CheckCircle2 className="w-4 h-4 text-[#DFB75E]" />
          </div>

          <div className="p-3 rounded-xl bg-[#F8F6F1] text-gray-700 border border-[#E5E0D5]">
            <p className="font-bold">मराठी (Marathi)</p>
            <p className="text-[10px] text-gray-500">MLRC & Cause Lists Ready</p>
          </div>

          <div className="p-3 rounded-xl bg-[#F8F6F1] text-gray-700 border border-[#E5E0D5]">
            <p className="font-bold">हिन्दी (Hindi)</p>
            <p className="text-[10px] text-gray-500">Central Tribunals Ready</p>
          </div>
        </div>
      </div>

      {/* Firm Seed Details */}
      <div className="bg-white rounded-3xl p-7 border border-[#E5E0D5] shadow-sm space-y-3 text-xs text-gray-600">
        <h3 className="font-serif text-base font-bold text-[#071526]">
          Centralized Firm Configuration
        </h3>
        <p>
          To update firm metadata, Sanad credentials, phone, address, or team members, edit:
          <code className="ml-1 px-2 py-0.5 rounded bg-gray-100 text-[#0B1F3A] font-mono">/src/config/site.ts</code>
        </p>
      </div>
    </div>
  );
}
