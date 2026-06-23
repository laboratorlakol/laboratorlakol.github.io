import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth/admin-guard";
import { logAudit } from "@/lib/auth/audit";

const bodySchema = z.object({
  name: z.string().min(1).max(60).optional(),
  description: z.string().max(300).optional(),
  staffOnlyReplies: z.boolean().optional(),
  pinned: z.boolean().optional(),
  position: z.number().int().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "validation_error" }, { status: 400 });
  }

  const category = await prisma.forumCategory.update({ where: { id }, data: parsed.data });
  await logAudit({ userId: session.sub, action: "admin_forum_category_update", metadata: { categoryId: id }, req });

  return NextResponse.json({ category });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const { id } = await params;
  await prisma.forumCategory.delete({ where: { id } }); // cascades to topics + posts
  await logAudit({ userId: session.sub, action: "admin_forum_category_delete", metadata: { categoryId: id }, req });

  return NextResponse.json({ ok: true });
}
