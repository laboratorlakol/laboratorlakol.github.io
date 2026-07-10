import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth/admin-guard";
import { logAudit } from "@/lib/auth/audit";
import { revalidatePath } from "next/cache";
const bodySchema = z.object({ pinned: z.boolean().optional(), locked: z.boolean().optional(), categoryId: z.string().optional(), title: z.string().min(3).max(150).optional() });
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "validation_error" }, { status: 400 });
  const topic = await prisma.forumTopic.update({ where: { id }, data: parsed.data });
  await logAudit({ userId: session.sub, action: "admin_forum_topic_update", metadata: { topicId: id, ...parsed.data }, req });
  revalidatePath("/forum", "layout");
  return NextResponse.json({ topic });
}
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const { id } = await params;
  await prisma.forumTopic.delete({ where: { id } });
  await logAudit({ userId: session.sub, action: "admin_forum_topic_delete", metadata: { topicId: id }, req });
  revalidatePath("/forum", "layout");
  return NextResponse.json({ ok: true });
}
