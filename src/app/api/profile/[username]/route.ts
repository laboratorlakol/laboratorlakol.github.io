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
      id: true, username: true, role: true,
      createdAt: true, lastOnline: true,
      avatarUrl: true, bannerUrl: true, avatarFrame: true,
      playtimeMinutes: true,
      _count: { select: { forumPosts: true } },
      forumPosts: {
        where: { isFirstPost: false },
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true, content: true, createdAt: true,
          topic: { select: { id: true, title: true, category: { select: { slug: true, name: true } } } },
        },
      },
    },
  });

  if (!user) return NextResponse.json({ error: "not_found" }, { status: 404 });

  // Also fetch topics (first posts = topic creation)
  const topics = await prisma.forumTopic.findMany({
    where: { authorId: user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      id: true, title: true, createdAt: true,
      category: { select: { slug: true, name: true } },
      _count: { select: { posts: true } },
    },
  });

  return NextResponse.json({
    profile: {
      id: user.id, username: user.username, role: user.role,
      roleLabel: ROLE_LABELS[user.role as Role] ?? user.role,
      createdAt: user.createdAt, lastOnline: user.lastOnline,
      avatarUrl: user.avatarUrl, bannerUrl: user.bannerUrl, avatarFrame: user.avatarFrame,
      playtimeHours: Math.floor((user.playtimeMinutes / 60) * 10) / 10,
      postCount: user._count.forumPosts,
      recentPosts: user.forumPosts,
      recentTopics: topics,
    },
  });
}
