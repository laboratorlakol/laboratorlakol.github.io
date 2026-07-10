import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { generateLinkCode, hashLinkCode } from "@/lib/fivem/code";
import { isValidFivemSecret } from "@/lib/fivem/auth";
import { rateLimit } from "@/lib/auth/rate-limit";
import { getClientIp } from "@/lib/auth/audit";
const bodySchema = z.object({ citizenId: z.string().min(1).max(64), characterName: z.string().max(100).optional() });
export async function POST(req: Request) {
  if (!isValidFivemSecret(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const ip = getClientIp(req) ?? "unknown";
  const { allowed } = rateLimit(`fivem-gen:${ip}`, 30, 60*1000);
  if (!allowed) return NextResponse.json({ error: "too_many_requests" }, { status: 429 });
  const body = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "validation_error" }, { status: 400 });
  const { citizenId, characterName } = parsed.data;
  await prisma.fiveMLinkCode.updateMany({ where: { citizenId, usedAt: null }, data: { usedAt: new Date() } });
  const code = generateLinkCode();
  await prisma.fiveMLinkCode.create({ data: { codeHash: hashLinkCode(code), citizenId, characterName, expiresAt: new Date(Date.now() + 10*60*1000) } });
  return NextResponse.json({ code, expiresInSeconds: 600 });
}
