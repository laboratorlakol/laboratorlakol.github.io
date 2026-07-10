import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth/admin-guard";
import { logAudit } from "@/lib/auth/audit";
import { revalidatePath } from "next/cache";
export async function GET() {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const members = await prisma.teamMember.findMany({ orderBy: { position: "asc" } });
  return NextResponse.json({ members });
}
const bodySchema = z.object({ name: z.string().min(1).max(60), role: z.string().min(1).max(40), avatarUrl: z.string().url().optional().or(z.literal("")), position: z.number().int().optional(), visible: z.boolean().optional() });
export async function POST(req: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const body = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "validation_error" }, { status: 400 });
  const member = await prisma.teamMember.create({ data: { name: parsed.data.name, role: parsed.data.role, avatarUrl: parsed.data.avatarUrl || null, position: parsed.data.position ?? 0, visible: parsed.data.visible ?? true } });
  await logAudit({ userId: session.sub, action: "admin_team_create", metadata: { memberId: member.id }, req });
  revalidatePath("/");
  return NextResponse.json({ member });
}
