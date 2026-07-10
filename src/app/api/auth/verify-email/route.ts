import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashToken } from "@/lib/auth/tokens";
import { logAudit } from "@/lib/auth/audit";
export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token");
  if (!token) return NextResponse.json({ error: "missing_token" }, { status: 400 });
  const record = await prisma.emailVerificationToken.findUnique({ where: { tokenHash: hashToken(token) } });
  if (!record || record.usedAt || record.expiresAt < new Date()) return NextResponse.json({ error: "invalid_or_expired_token" }, { status: 400 });
  await prisma.$transaction([prisma.user.update({ where: { id: record.userId }, data: { emailVerified: true } }), prisma.emailVerificationToken.update({ where: { id: record.id }, data: { usedAt: new Date() } })]);
  await logAudit({ userId: record.userId, action: "email_verified", req });
  return NextResponse.json({ ok: true });
}
