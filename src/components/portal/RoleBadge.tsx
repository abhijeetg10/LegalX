import React from "react";

export function RoleBadge({ role }: { role?: string }) {
  const r = role || "CLIENT";

  if (r === "SUPER_ADMIN") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E11D48]/15 text-[#E11D48] border border-[#E11D48]/30">
        Super Admin
      </span>
    );
  }

  if (r === "CLIENT_ADMIN") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#C9A24B]/15 text-[#DFB75E] border border-[#C9A24B]/40">
        Client Admin (Founder)
      </span>
    );
  }

  if (r === "TEAM_MEMBER") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#2563EB]/15 text-[#60A5FA] border border-[#2563EB]/30">
        Team Legalex
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#059669]/15 text-[#34D399] border border-[#059669]/30">
      Client User
    </span>
  );
}
