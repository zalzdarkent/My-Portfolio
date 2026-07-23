import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { verifyToken } from "@/lib/auth";

const intlMiddleware = createMiddleware(routing);

const ADMIN_PREFIX = "/admin";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip middleware for API routes and admin routes
  if (pathname.startsWith("/api") || pathname.startsWith(ADMIN_PREFIX)) {
    // But still protect /admin (not /admin/login)
    if (pathname.startsWith(ADMIN_PREFIX)) {
      const isLogin = pathname === "/admin/login";
      if (isLogin) return NextResponse.next();

      const token = req.cookies.get("admin_auth")?.value;
      if (!token) {
        const url = req.nextUrl.clone();
        url.pathname = "/admin/login";
        url.searchParams.set("from", pathname);
        return NextResponse.redirect(url);
      }

      const payload = await verifyToken(token);
      if (!payload) {
        const url = req.nextUrl.clone();
        url.pathname = "/admin/login";
        url.searchParams.set("from", pathname);
        const response = NextResponse.redirect(url);
        response.cookies.set("admin_auth", "", {
          path: "/",
          maxAge: 0,
          httpOnly: true,
          sameSite: "lax",
        });
        return response;
      }
    }
    return NextResponse.next();
  }

  // Run intl middleware for all other routes
  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!_next|_vercel|.*\\..*).*)"],
};
