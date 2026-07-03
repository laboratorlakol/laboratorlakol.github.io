import { NextResponse, type NextRequest } from "next/server";

const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export function middleware(req: NextRequest) {
  if (!MUTATING_METHODS.has(req.method)) return NextResponse.next();

  const origin = req.headers.get("origin");
  // Same-origin requests from a browser always send Origin on mutating
  // fetches. No Origin header at all (e.g. some non-browser clients) is
  // allowed through — SameSite=Lax cookies are the primary defense there.
  if (!origin) return NextResponse.next();

  const host = req.headers.get("host");
  const originHost = new URL(origin).host;

  if (originHost !== host) {
    return NextResponse.json(
      { error: "cross_origin_forbidden" },
      { status: 403 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/auth/:path*",
};
