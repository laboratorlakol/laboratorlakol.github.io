import { NextResponse } from "next/server";

// Discord's public invite endpoint exposes approximate member / online
// counts without needing a bot token, as long as the server has the
// "Server Widget" / invite link enabled.
const INVITE_CODE = "dCAZbNzvaN";

export async function GET() {
  try {
    const res = await fetch(
      `https://discord.com/api/v10/invites/${INVITE_CODE}?with_counts=true`,
      { next: { revalidate: 30 } }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "discord_unavailable" },
        { status: 502 }
      );
    }

    const data = await res.json();

    return NextResponse.json({
      discordMembers: data.approximate_member_count ?? null,
      discordOnline: data.approximate_presence_count ?? null,
    });
  } catch {
    return NextResponse.json({ error: "discord_unavailable" }, { status: 502 });
  }
}
