import { NextResponse } from "next/server";
const FIVEM_SERVER = "http://134.255.233.32:30298";
export async function GET() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(`${FIVEM_SERVER}/dynamic.json`, { signal: controller.signal, cache: "no-store" });
    if (!res.ok) return NextResponse.json({ error: "server_unavailable" }, { status: 502 });
    const data = await res.json();
    return NextResponse.json({ playersOnline: Number(data.clients) || 0, maxPlayers: Number(data.sv_maxclients) || null });
  } catch { return NextResponse.json({ error: "server_unavailable" }, { status: 502 }); }
  finally { clearTimeout(timeout); }
}
