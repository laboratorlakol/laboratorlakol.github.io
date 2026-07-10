import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ user: null });

  const user = await prisma.user.update({
    where: { id: session.sub },
    data: { lastOnline: new Date() },
    select: {
      id: true, username: true, email: true, role: true,
      emailVerified: true, citizenId: true, characterName: true,
      playtimeMinutes: true, avatarUrl: true, bannerUrl: true, createdAt: true,
    },
  });

  if (!user) return NextResponse.json({ user: null });

  return NextResponse.json({
    user: {
      ...user,
      playtimeHours: Math.floor((user.playtimeMinutes / 60) * 10) / 10,
    },
  });
}
