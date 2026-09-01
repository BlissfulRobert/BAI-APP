import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Map: which route prefix requires which role
const ROUTE_ROLE_MAP: Record<string, string> = {
  "/client": "client",
  "/broker": "broker",
  "/compliance": "compliance",
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Find the matched protected route
  const matchedRoute = Object.keys(ROUTE_ROLE_MAP).find((route) =>
    pathname.startsWith(route),
  );

  // Not a protected route — let it through
  if (!matchedRoute) return NextResponse.next();

  // Check for JWT access token — if missing, not logged in at all
  const accessToken = request.cookies.get("jwt-access-token")?.value;

  if (!accessToken) {
    // Not logged in → redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Check the user's role cookie
  const userRole = request.cookies.get("user-role")?.value;

  if (!userRole) {
    // Logged in but role unknown → redirect to login to re-authenticate
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const requiredRole = ROUTE_ROLE_MAP[matchedRoute];

  if (userRole !== requiredRole) {
    // Logged in but WRONG role → redirect to their own portal
    if (userRole === "client")
      return NextResponse.redirect(new URL("/client", request.url));
    if (userRole === "broker")
      return NextResponse.redirect(new URL("/broker", request.url));
    if (userRole === "compliance")
      return NextResponse.redirect(new URL("/compliance", request.url));

    // Unknown role → back to login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Correct role — allow through
  return NextResponse.next();
}

export const config = {
  matcher: ["/client/:path*", "/broker/:path*", "/compliance/:path*"],
};
