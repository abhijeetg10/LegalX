import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect all /portal routes
  if (pathname.startsWith("/portal")) {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET || "legalex-chambers-secret-production-key-2026",
    });

    if (!token) {
      const url = new URL("/login", req.url);
      url.searchParams.set("callbackUrl", encodeURI(pathname));
      return NextResponse.redirect(url);
    }

    const role = (token.role as string) || "CLIENT";

    // Admin-only areas (Team management, CMS, Audit Logs)
    const adminOnlyPaths = ["/portal/team", "/portal/cms", "/portal/audit-logs"];
    const isAdminPath = adminOnlyPaths.some((p) => pathname.startsWith(p));

    if (isAdminPath && role !== "SUPER_ADMIN" && role !== "CLIENT_ADMIN") {
      // Unauthorized for team members or clients
      return NextResponse.redirect(new URL("/portal/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/portal/:path*"],
};
