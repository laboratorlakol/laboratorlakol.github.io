import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ROLE_LABELS } from "@/lib/auth/rbac";
import { Role } from "@prisma/client";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      role: true,
      createdAt: true,
      lastOnline: true,
      avatarUrl: true,
      bannerUrl: true,
      playtimeMinutes: true,
      _count: { select: { forumPosts: true } },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({
    profile: {
      id: user.id,
      username: user.username,
      role: user.role,
      roleLabel: ROLE_LABELS[user.role as Role] ?? user.role,
      createdAt: user.createdAt,
      lastOnline: user.lastOnline,
      avatarUrl: user.avatarUrl,
      bannerUrl: user.bannerUrl,
      playtimeHours: Math.floor((user.playtimeMinutes / 60) * 10) / 10,
      postCount: user._count.forumPosts,
    },
  });
}
