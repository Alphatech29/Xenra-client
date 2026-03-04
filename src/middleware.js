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

  /* ---------------- TOKENS ---------------- */
  let accessToken = req.cookies.get("access_token")?.value;
  const refreshToken = req.cookies.get("refresh_token")?.value;

  let authenticated = false;
  let isEmailVerified = false;
  let userEmail = null;

  let response = NextResponse.next();

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

  /* ---------------- SILENT REFRESH ---------------- */
  if (!authenticated && refreshToken) {
    try {
      const refreshRes = await fetch(
        `${req.nextUrl.origin}/api/auth/refresh-token`,
        {
          method: "POST",
          headers: {
            cookie: `refresh_token=${refreshToken}`,
          },
          cache: "no-store",
        }
      );

      if (refreshRes.ok) {
        const data = await refreshRes.json();

        response.cookies.set("access_token", data.accessToken, {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
        });

        if (data.refreshToken) {
          response.cookies.set("refresh_token", data.refreshToken, {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
          });
        }

        const decoded = decodeToken(data.accessToken);
        authenticated = decoded.authenticated;
        isEmailVerified = decoded.isEmailVerified;
        userEmail = decoded.email;

        accessToken = data.accessToken;
      }
    } catch {
      // silent fail
    }
  }

  /* =========================================================
     FINAL LOGIC FLOW
     ========================================================= */

  // 1️⃣ Protect dashboard (must be authenticated AND verified)
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

  // 2️⃣ Force unverified authenticated users to verify
  if (authenticated && !isEmailVerified && !isVerifyRoute) {
    const verifyUrl = new URL("/auth/verify", req.url);
    if (userEmail) {
      verifyUrl.searchParams.set("email", userEmail);
    }
    return NextResponse.redirect(verifyUrl);
  }

  // 3️⃣ Prevent verified users from login/register
  if (authenticated && isEmailVerified && isLoginOrRegister) {
    const from = req.nextUrl.searchParams.get("from");

    if (from && from.startsWith("/")) {
      return NextResponse.redirect(new URL(from, req.url));
    }

    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // 4️⃣ Prevent verified users from verify page
  if (authenticated && isEmailVerified && isVerifyRoute) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};