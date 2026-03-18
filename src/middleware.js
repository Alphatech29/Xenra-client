import { NextResponse } from "next/server";
import { decodeJwt } from "jose";

export async function middleware(req) {
  const { pathname, search } = req.nextUrl;

  /* ---------------- SKIP STATIC FILES ---------------- */
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  /* ---------------- ROUTE GROUPS ---------------- */
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isVerifyRoute = pathname.startsWith("/auth/verify");
  const isLoginRoute = pathname.startsWith("/auth/login");
  const isRegisterRoute = pathname.startsWith("/auth/register");
  const isLoginOrRegister = isLoginRoute || isRegisterRoute;

  /* ---------------- ACCESS TOKEN ---------------- */
  const accessToken = req.cookies.get("access_token")?.value;

  let authenticated = false;
  let isEmailVerified = false;
  let userEmail = null;

  const response = NextResponse.next();

  /* ---------------- HELPER: DECODE TOKEN ---------------- */
  const decodeToken = (token) => {
    try {
      const payload = decodeJwt(token);

      return {
        authenticated: true,
        isEmailVerified: Boolean(payload.is_email_verified),
        email: payload.email || null,
      };
    } catch {
      return {
        authenticated: false,
        isEmailVerified: false,
        email: null,
      };
    }
  };

  /* ---------------- DECODE ACCESS TOKEN ---------------- */
  if (accessToken) {
    const decoded = decodeToken(accessToken);
    authenticated = decoded.authenticated;
    isEmailVerified = decoded.isEmailVerified;
    userEmail = decoded.email;
  }

  /* ---------------- FINAL LOGIC FLOW ---------------- */

  // Protect dashboard
  if (isDashboardRoute) {
    if (!authenticated) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("from", pathname + search);
      return NextResponse.redirect(loginUrl);
    }

    if (!isEmailVerified) {
      const verifyUrl = new URL("/auth/verify", req.url);
      if (userEmail) {
        verifyUrl.searchParams.set("email", userEmail);
      }
      return NextResponse.redirect(verifyUrl);
    }
  }

  // Force unverified authenticated users to verify
  if (authenticated && !isEmailVerified && !isVerifyRoute) {
    const verifyUrl = new URL("/auth/verify", req.url);
    if (userEmail) {
      verifyUrl.searchParams.set("email", userEmail);
    }
    return NextResponse.redirect(verifyUrl);
  }

  // Prevent verified users from login/register
  if (authenticated && isEmailVerified && isLoginOrRegister) {
    const from = req.nextUrl.searchParams.get("from");

    if (from && from.startsWith("/")) {
      return NextResponse.redirect(new URL(from, req.url));
    }

    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Prevent verified users from verify page
  if (authenticated && isEmailVerified && isVerifyRoute) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};