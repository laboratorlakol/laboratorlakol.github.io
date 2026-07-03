import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth/admin-guard";
import { logAudit } from "@/lib/auth/audit";

const bodySchema = z.object({
  title: z.string().min(1).max(120).optional(),
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

  const chapter = await prisma.regulationChapter.update({ where: { id }, data: parsed.data });
  await logAudit({ userId: session.sub, action: "admin_regulation_chapter_update", metadata: { chapterId: id }, req });
  revalidatePath("/regulament");
  return NextResponse.json({ chapter });
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
  await prisma.regulationChapter.delete({ where: { id } }); // cascades to articles
  await logAudit({ userId: session.sub, action: "admin_regulation_chapter_delete", metadata: { chapterId: id }, req });
  revalidatePath("/regulament");
  return NextResponse.json({ ok: true });
}
