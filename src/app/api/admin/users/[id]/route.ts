import { NextResponse } from "next/server";
import { z } from "zod";
import { Role, AccountStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth/admin-guard";
import { roleRank } from "@/lib/auth/rbac";
import { logAudit } from "@/lib/auth/audit";
const bodySchema = z.object({ role: z.nativeEnum(Role).optional(), status: z.nativeEnum(AccountStatus).optional(), reason: z.string().max(500).optional() });
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const { id } = await params;
  if (id === session.sub) return NextResponse.json({ error: "cannot_modify_self" }, { status: 400 });
  const body = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "validation_error" }, { status: 400 });
  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (roleRank(target.role) >= roleRank(session.role)) return NextResponse.json({ error: "insufficient_rank", message: "Nu poți modifica un utilizator cu rang egal sau mai mare." }, { status: 403 });
  if (parsed.data.role && roleRank(parsed.data.role) >= roleRank(session.role)) return NextResponse.json({ error: "insufficient_rank", message: "Nu poți acorda un rang egal sau mai mare decât al tău." }, { status: 403 });
  const updated = await prisma.user.update({ where: { id }, data: { ...(parsed.data.role ? { role: parsed.data.role } : {}), ...(parsed.data.status ? { status: parsed.data.status } : {}) }, select: { id:true, username:true, role:true, status:true } });
  await logAudit({ userId: session.sub, action: "admin_user_update", metadata: { targetUserId: id, targetUsername: target.username, newRole: parsed.data.role, newStatus: parsed.data.status }, req });
  return NextResponse.json({ user: updated });
}
