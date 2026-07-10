import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const url = new URL(req.url);
  const page = Math.max(1, Number(url.searchParams.get("page") ?? "1"));
  const pageSize = 20;
  const category = await prisma.forumCategory.findUnique({ where: { slug } });
  if (!category) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const [topics, total] = await Promise.all([
    prisma.forumTopic.findMany({ where: { categoryId: category.id }, orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }], skip: (page-1)*pageSize, take: pageSize, include: { author: { select: { username: true } }, _count: { select: { posts: true } } } }),
    prisma.forumTopic.count({ where: { categoryId: category.id } }),
  ]);
  return NextResponse.json({ category, topics, total, page, pageSize });
}
