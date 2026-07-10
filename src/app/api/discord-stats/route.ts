import { NextResponse } from "next/server";
export async function GET() {
  try {
    const res = await fetch("https://discord.com/api/v10/invites/dCAZbNzvaN?with_counts=true", { next: { revalidate: 300 } });
    if (!res.ok) return NextResponse.json({ memberCount: null });
    const data = await res.json();
    return NextResponse.json({ memberCount: data.approximate_member_count ?? null });
  } catch { return NextResponse.json({ memberCount: null }); }
}
