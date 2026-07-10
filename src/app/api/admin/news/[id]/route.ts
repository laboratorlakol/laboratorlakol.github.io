import { NextResponse } from "next/server";
import { z } from "zod";
import { NewsCategory } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth/admin-guard";
import { logAudit } from "@/lib/auth/audit";
import { revalidatePath } from "next/cache";
const bodySchema = z.object({ title: z.string().min(1).max(150).optional(), excerpt: z.string().min(1).max(300).optional(), content: z.string().min(1).optional(), category: z.nativeEnum(NewsCategory).optional(), published: z.boolean().optional() });
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "validation_error" }, { status: 400 });
  const post = await prisma.newsPost.update({ where: { id }, data: parsed.data });
  await logAudit({ userId: session.sub, action: "admin_news_update", metadata: { postId: id }, req });
  revalidatePath("/"); revalidatePath("/noutati"); revalidatePath(`/noutati/${id}`);
  return NextResponse.json({ post });
}
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const { id } = await params;
  await prisma.newsPost.delete({ where: { id } });
  await logAudit({ userId: session.sub, action: "admin_news_delete", metadata: { postId: id }, req });
  revalidatePath("/"); revalidatePath("/noutati");
  return NextResponse.json({ ok: true });
}
