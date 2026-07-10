import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth/admin-guard";
import { logAudit } from "@/lib/auth/audit";
import { revalidatePath } from "next/cache";
const bodySchema = z.object({ name: z.string().min(1).max(60).optional(), role: z.string().min(1).max(40).optional(), avatarUrl: z.string().url().optional().or(z.literal("")), position: z.number().int().optional(), visible: z.boolean().optional() });
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "validation_error" }, { status: 400 });
  const member = await prisma.teamMember.update({ where: { id }, data: { ...parsed.data, avatarUrl: parsed.data.avatarUrl === "" ? null : parsed.data.avatarUrl } });
  await logAudit({ userId: session.sub, action: "admin_team_update", metadata: { memberId: id }, req });
  revalidatePath("/");
  return NextResponse.json({ member });
}
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const { id } = await params;
  await prisma.teamMember.delete({ where: { id } });
  await logAudit({ userId: session.sub, action: "admin_team_delete", metadata: { memberId: id }, req });
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
