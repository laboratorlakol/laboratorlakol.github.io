import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth/admin-guard";
export async function GET(req: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const url = new URL(req.url);
  const q = url.searchParams.get("q")?.trim() ?? "";
  const page = Math.max(1, Number(url.searchParams.get("page") ?? "1"));
  const pageSize = 25;
  const where = q ? { title: { contains: q, mode: "insensitive" as const } } : {};
  const [topics, total] = await Promise.all([prisma.forumTopic.findMany({ where, orderBy: { updatedAt: "desc" }, skip: (page-1)*pageSize, take: pageSize, include: { category: { select: { name:true, slug:true } }, author: { select: { username: true } }, _count: { select: { posts: true } } } }), prisma.forumTopic.count({ where })]);
  return NextResponse.json({ topics, total, page, pageSize });
}
