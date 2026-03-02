import { NextResponse } from "next/server";

function log(...args) {
  console.log("[AUTH-MIDDLEWARE]", ...args);
}

export async function middleware(req) {
  const { pathname, search } = req.nextUrl;

  log("------------------------------------------------");
  log("Route:", pathname + search);

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
  const isAuthRoute = pathname.startsWith("/auth");

  const isPublicOnlyAuthPage =
    pathname === "/auth/login" || pathname === "/auth/register";

  /* ---------------- TOKENS ---------------- */
  let accessToken = req.cookies.get("access_token")?.value;
  let refreshToken = req.cookies.get("refresh_token")?.value;

  let authenticated = !!accessToken;

  log("access:", !!accessToken, "refresh:", !!refreshToken);

  /* ---------------- SILENT REFRESH ---------------- */
  if (!accessToken && refreshToken) {
    log("No access token → attempting refresh");

    try {
      const refreshRes = await fetch(`${req.nextUrl.origin}/api/auth/refresh-token`, {
        method: "POST",
        headers: {
          cookie: `refresh_token=${refreshToken}`,
        },
        cache: "no-store",
      });

      log("refresh status:", refreshRes.status);

      if (refreshRes.ok) {
        const data = await refreshRes.json();

        const response = NextResponse.next();

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

        authenticated = true;
        log("Refresh success → authenticated");
        return response;
      }
    } catch (e) {
      log("Refresh failed:", e.message);
    }
  }

  /* ---------------- PROTECT DASHBOARD ---------------- */
  if (isDashboardRoute && !authenticated) {
    log("Redirect → login");

    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("from", pathname + search);

    return NextResponse.redirect(loginUrl);
  }

  /* ---------------- RETURN AFTER LOGIN ---------------- */
  if (isAuthRoute && authenticated) {
    const from = req.nextUrl.searchParams.get("from");
    if (from && from.startsWith("/")) {
      log("Return to:", from);
      return NextResponse.redirect(new URL(from, req.url));
    }
  }

  /* ---------------- BLOCK LOGIN WHEN LOGGED IN ---------------- */
  if (isPublicOnlyAuthPage && authenticated) {
    log("Already logged in → dashboard");
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  log("Allow");
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};