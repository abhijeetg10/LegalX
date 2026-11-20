"use client";

import React, { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import {
  Scale,
  ShieldCheck,
  Lock,
  Mail,
  KeyRound,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  UserCheck,
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/portal/dashboard";

  const [authMethod, setAuthMethod] = useState<"password" | "otp">("password");
  const [email, setEmail] = useState("admin@legalex.in");
  const [password, setPassword] = useState("Admin@1234");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpSuccessMessage, setOtpSuccessMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Demo Credentials Role Switcher
  const demoAccounts = [
    {
      role: "Client Admin",
      title: "Adv. Amit S. Rathi (Managing Partner)",
      email: "admin@legalex.in",
      pass: "Admin@1234",
      desc: "Full firm oversight, staff, billing, cases & documents",
    },
    {
      role: "Team Legalex",
      title: "Adv. Sneha Deshmukh (Sr. Associate)",
      email: "team@legalex.in",
      pass: "Team@1234",
      desc: "Assigned cases, courtroom hearings & PDF uploads",
    },
    {
      role: "Client User",
      title: "Rajesh Sharma (Rameshwar Industries)",
      email: "client@legalex.in",
      pass: "Client@1234",
      desc: "Own case status, hearing notices & invoice payments",
    },
    {
      role: "Super Admin",
      title: "System Administrator",
      email: "superadmin@legalex.in",
      pass: "Admin@1234",
      desc: "Full root access, audit logs, and security controls",
    },
  ];

  const selectDemoAccount = (acc: typeof demoAccounts[0]) => {
    setEmail(acc.email);
    setPassword(acc.pass);
    setOtpCode("123456");
    setErrorMessage("");
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: email.trim(),
        password,
        isOtpLogin: "false",
      });

      if (res?.error) {
        setErrorMessage(res.error || "Authentication failed. Please check credentials.");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setErrorMessage("An unexpected authentication error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!email) {
      setErrorMessage("Please enter your registered email address.");
      return;
    }

    setOtpLoading(true);
    setErrorMessage("");
    setOtpSuccessMessage("");

    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to dispatch verification code.");
      }

      setOtpSent(true);
      setOtpSuccessMessage(data.message);
      if (data.demoOtp) {
        setOtpCode(data.demoOtp);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Could not deliver OTP code.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: email.trim(),
        otpCode: otpCode.trim(),
        isOtpLogin: "true",
      });

      if (res?.error) {
        setErrorMessage(res.error || "Invalid or expired OTP code.");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setErrorMessage("Failed to verify OTP code.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#071526] text-white flex flex-col justify-between py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[#C9A24B]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header Logo */}
      <div className="max-w-md w-full mx-auto text-center mb-6 relative z-10">
        <Link href="/" className="inline-flex flex-col items-center gap-2 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="LEGALEX Law Solutions"
            className="h-12 w-auto object-contain group-hover:scale-105 transition-transform"
          />
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#132B4F]/80 border border-[#C9A24B]/30 text-[10px] font-semibold text-[#DFB75E] tracking-wider uppercase">
            Chambers & Case Portal
          </div>
        </Link>
        <p className="text-[11px] text-gray-400 mt-2">
          SECURE LITIGATION & CASE MANAGEMENT DESK
        </p>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto relative z-10">
        {/* Pitch Demo Role Switcher Bar */}
        <div className="mb-6 p-4 rounded-2xl bg-[#0B1F3A] border border-[#C9A24B]/40 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-[#DFB75E]">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#C9A24B]" />
              Pitch Demo Quick Role Switcher
            </span>
            <span className="text-[10px] text-gray-400">1-Click Auto Fill</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-left">
            {demoAccounts.map((acc) => {
              const isSelected = email === acc.email;
              return (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => selectDemoAccount(acc)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#132B4F] border-[#C9A24B] shadow-md"
                      : "bg-[#071526]/60 border-[#132B4F] hover:border-gray-500"
                  }`}
                >
                  <p className="text-[11px] font-bold text-white flex items-center justify-between">
                    <span>{acc.role}</span>
                    {isSelected && <UserCheck className="w-3 h-3 text-[#DFB75E]" />}
                  </p>
                  <p className="text-[10px] text-[#C9A24B] truncate mt-0.5">
                    {acc.email}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Login Box */}
        <div className="bg-[#0B1F3A]/90 rounded-3xl p-8 border border-[#132B4F] shadow-2xl backdrop-blur-md">
          {/* Method Tabs */}
          <div className="flex rounded-xl bg-[#071526] p-1 mb-6 border border-[#132B4F]">
            <button
              type="button"
              onClick={() => {
                setAuthMethod("password");
                setErrorMessage("");
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                authMethod === "password"
                  ? "bg-[#132B4F] text-[#DFB75E] shadow"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Password Login
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMethod("otp");
                setErrorMessage("");
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                authMethod === "otp"
                  ? "bg-[#132B4F] text-[#DFB75E] shadow"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Email OTP Login
            </button>
          </div>

          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-[#E11D48]/15 border border-[#E11D48]/30 text-xs text-[#E11D48] flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {otpSuccessMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-[#059669]/15 border border-[#059669]/30 text-xs text-[#059669] flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{otpSuccessMessage}</span>
            </div>
          )}

          {/* Password Form */}
          {authMethod === "password" && (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="advocate@legalex.in"
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-[#071526] border border-[#132B4F] text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24B] transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-gray-300">
                    Password
                  </label>
                  <span className="text-[10px] text-[#C9A24B]">Demo: Admin@1234 / Team@1234</span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-[#071526] border border-[#132B4F] text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24B] transition-all"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#DFB75E] to-[#C9A24B] text-[#071526] font-bold text-xs hover:from-[#E6C372] hover:to-[#DFB75E] transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading ? (
                    <span>Authenticating Credentials...</span>
                  ) : (
                    <>
                      <span>Sign In to Portal</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* OTP Form */}
          {authMethod === "otp" && (
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Email Address
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="client@legalex.in"
                      className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-[#071526] border border-[#132B4F] text-white focus:outline-none focus:ring-2 focus:ring-[#C9A24B] transition-all"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={otpLoading}
                    className="px-3.5 py-2.5 rounded-xl bg-[#132B4F] hover:bg-[#1D3B66] text-[#DFB75E] text-xs font-semibold border border-[#C9A24B]/30 whitespace-nowrap disabled:opacity-50"
                  >
                    {otpLoading ? "Sending..." : "Send OTP"}
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-gray-300">
                    6-Digit Verification Code
                  </label>
                  <span className="text-[10px] text-gray-400">Demo Code: 123456</span>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="123456"
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-[#071526] border border-[#132B4F] text-white font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-[#C9A24B] transition-all"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading || !otpCode}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#DFB75E] to-[#C9A24B] text-[#071526] font-bold text-xs hover:from-[#E6C372] hover:to-[#DFB75E] transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading ? (
                    <span>Verifying Code...</span>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Verify & Access Portal</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 pt-5 border-t border-[#132B4F] text-center text-xs text-gray-400">
            Need urgent assistance?{" "}
            <a href={`tel:${siteConfig.contact.phone}`} className="text-[#DFB75E] hover:underline">
              Contact Chambers
            </a>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-xs text-gray-400 hover:text-white transition-colors"
          >
            ← Return to Legalex Public Website
          </Link>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="max-w-md w-full mx-auto text-center text-[10px] text-gray-500 relative z-10 pt-6">
        Protected by 256-Bit TLS Encryption & Role-Based Access Control • © {new Date().getFullYear()} LEGALEX
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#071526] flex items-center justify-center text-white text-xs">Loading Legalex Portal Gateway...</div>}>
      <LoginForm />
    </Suspense>
  );
}
