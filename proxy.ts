import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Paths that don't require authentication
const PUBLIC_PATHS = ["/login", "/register", "/api/auth"];

function isPublic(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname.startsWith(p));
}

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Allow the DLH UI to be reviewed locally without requiring a seeded
  // database account. Production keeps the normal session protection.
  if (
    process.env.NODE_ENV === "development" &&
    (pathname.startsWith("/dinas") || pathname.startsWith("/api/dinas"))
  ) {
    return NextResponse.next();
  }

  // Logout — redirect to login (Better Auth handles cookie clearing client-side)
  if (searchParams.has("logout")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Allow public paths through without auth
  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  // Optimistic session cookie check
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Session cookie exists — let the route handle actual auth validation
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff2?|ttf|otf|eot)).*)",
  ],
};
