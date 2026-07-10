import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const url = new URL(req.url);
  const page = Math.max(1, Number(url.searchParams.get("page") ?? "1"));
  const pageSize = 20;
  const topic = await prisma.forumTopic.findUnique({ where: { id }, include: { category: true, author: { select: { username: true, role: true } } } });
  if (!topic) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const [posts, total] = await Promise.all([prisma.forumPost.findMany({ where: { topicId: id }, orderBy: { createdAt: "asc" }, skip: (page-1)*pageSize, take: pageSize, include: { author: { select: { username: true, role: true } } } }), prisma.forumPost.count({ where: { topicId: id } })]);
  return NextResponse.json({ topic, posts, total, page, pageSize });
}
