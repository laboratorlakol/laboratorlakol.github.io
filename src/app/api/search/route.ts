import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) return NextResponse.json({ topics: [], posts: [], articles: [] });
  const [topics, posts, articles] = await Promise.all([
    prisma.forumTopic.findMany({ where: { title: { contains: q, mode: "insensitive" } }, take: 8, orderBy: { updatedAt: "desc" }, include: { category: { select: { slug: true, name: true } } } }),
    prisma.newsPost.findMany({ where: { published: true, OR: [{ title: { contains: q, mode: "insensitive" } }, { excerpt: { contains: q, mode: "insensitive" } }] }, take: 8, orderBy: { createdAt: "desc" } }),
    prisma.regulationArticle.findMany({ where: { OR: [{ title: { contains: q, mode: "insensitive" } }, { content: { contains: q, mode: "insensitive" } }] }, take: 8, include: { chapter: { select: { id: true, title: true } } } }),
  ]);
  return NextResponse.json({ topics, posts, articles });
}
