import { NextResponse } from "next/server";
import { z } from "zod";
import { NewsCategory } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth/admin-guard";
import { logAudit } from "@/lib/auth/audit";
import { revalidatePath } from "next/cache";
export async function GET() {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const posts = await prisma.newsPost.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ posts });
}
const bodySchema = z.object({ title: z.string().min(1).max(150), excerpt: z.string().min(1).max(300), content: z.string().min(1), category: z.nativeEnum(NewsCategory).default(NewsCategory.UPDATES), published: z.boolean().default(false) });
export async function POST(req: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const body = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "validation_error" }, { status: 400 });
  const post = await prisma.newsPost.create({ data: { ...parsed.data, authorId: session.sub } });
  await logAudit({ userId: session.sub, action: "admin_news_create", metadata: { postId: post.id }, req });
  revalidatePath("/"); revalidatePath("/noutati");
  return NextResponse.json({ post });
}
