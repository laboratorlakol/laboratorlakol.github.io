import { NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { hashLinkCode } from "@/lib/fivem/code";
import { logAudit } from "@/lib/auth/audit";
import { rateLimit } from "@/lib/auth/rate-limit";
const bodySchema = z.object({ code: z.string().min(1).max(32) });
export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { allowed } = rateLimit(`fivem-link:${session.sub}`, 10, 15*60*1000);
  if (!allowed) return NextResponse.json({ error: "too_many_requests", message: "Prea multe încercări." }, { status: 429 });
  const body = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "validation_error", message: "Cod invalid." }, { status: 400 });
  const existingUser = await prisma.user.findUnique({ where: { id: session.sub }, select: { citizenId: true } });
  if (existingUser?.citizenId) return NextResponse.json({ error: "already_linked", message: "Contul tău are deja un personaj conectat." }, { status: 409 });
  const record = await prisma.fiveMLinkCode.findUnique({ where: { codeHash: hashLinkCode(parsed.data.code) } });
  if (!record || record.usedAt || record.expiresAt < new Date()) { await logAudit({ userId: session.sub, action: "fivem_link_failed", req }); return NextResponse.json({ error: "invalid_or_expired_code", message: "Codul este invalid sau a expirat. Generează unul nou cu /codsite." }, { status: 400 }); }
  try {
    await prisma.$transaction([prisma.user.update({ where: { id: session.sub }, data: { citizenId: record.citizenId, characterName: record.characterName } }), prisma.fiveMLinkCode.update({ where: { id: record.id }, data: { usedAt: new Date() } })]);
  } catch(err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") return NextResponse.json({ error: "character_already_linked", message: "Acest personaj este deja conectat la un alt cont." }, { status: 409 });
    throw err;
  }
  await logAudit({ userId: session.sub, action: "fivem_link_success", metadata: { citizenId: record.citizenId }, req });
  return NextResponse.json({ ok: true, citizenId: record.citizenId, characterName: record.characterName });
}
