import { NextResponse } from "next/server";

// Deliberately NOT prefixed with NEXT_PUBLIC_ — read live, server-side, on
// every request. A Turnstile site key is meant to be public (it's embedded
// in every page that uses it), so serving it over an unauthenticated GET
// is fine; the actual security boundary is the SECRET key, server-side.
export async function GET() {
  return NextResponse.json({
    siteKey: process.env.TURNSTILE_SITE_KEY ?? null,
  });
}
