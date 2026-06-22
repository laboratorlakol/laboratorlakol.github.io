import { NextResponse } from "next/server";

// FiveM exposes a standard, unauthenticated query endpoint on the server's
// HTTP port (same port as the connect endpoint): /dynamic.json gives the
// live player/slot counts without needing to fetch and count /players.json.
const FIVEM_SERVER = "http://134.255.233.32:30298";

export async function GET() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch(`${FIVEM_SERVER}/dynamic.json`, {
      signal: controller.signal,
      cache: "no-store",
      headers: { "User-Agent": "faded-ro-website" },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "server_unavailable" },
        { status: 502 }
      );
    }

    const data = await res.json();

    return NextResponse.json({
      playersOnline: Number(data.clients) || 0,
      maxPlayers: Number(data.sv_maxclients) || null,
    });
  } catch {
    // Server offline, unreachable, or didn't respond in time.
    return NextResponse.json(
      { error: "server_unavailable" },
      { status: 502 }
    );
  } finally {
    clearTimeout(timeout);
  }
}
