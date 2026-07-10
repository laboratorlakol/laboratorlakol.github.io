import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth/admin-guard";
import { logAudit } from "@/lib/auth/audit";
import { revalidatePath } from "next/cache";
const bodySchema = z.object({ title: z.string().min(1).max(150).optional(), content: z.string().min(1).optional(), position: z.number().int().optional() });
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "validation_error" }, { status: 400 });
  const article = await prisma.regulationArticle.update({ where: { id }, data: parsed.data });
  await logAudit({ userId: session.sub, action: "admin_regulation_article_update", metadata: { articleId: id }, req });
  revalidatePath("/regulament");
  return NextResponse.json({ article });
}
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const { id } = await params;
  await prisma.regulationArticle.delete({ where: { id } });
  await logAudit({ userId: session.sub, action: "admin_regulation_article_delete", metadata: { articleId: id }, req });
  revalidatePath("/regulament");
  return NextResponse.json({ ok: true });
}
