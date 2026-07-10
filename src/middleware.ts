import { NextResponse, type NextRequest } from "next/server";
const MUTATING = new Set(["POST","PUT","PATCH","DELETE"]);
export function middleware(req: NextRequest) {
  if (!MUTATING.has(req.method)) return NextResponse.next();
  const origin = req.headers.get("origin");
  if (!origin) return NextResponse.next();
  const host = req.headers.get("host");
  if (new URL(origin).host !== host) return NextResponse.json({ error: "cross_origin_forbidden" }, { status: 403 });
  return NextResponse.next();
}
export const config = { matcher: "/api/auth/:path*" };
