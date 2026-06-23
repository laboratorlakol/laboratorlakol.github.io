import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { generateLinkCode, hashLinkCode } from "@/lib/fivem/code";
import { isValidFivemSecret } from "@/lib/fivem/auth";
import { rateLimit } from "@/lib/auth/rate-limit";
import { getClientIp } from "@/lib/auth/audit";

const bodySchema = z.object({
  citizenId: z.string().min(1).max(64),
  characterName: z.string().max(100).optional(),
});

const CODE_TTL_MS = 10 * 60 * 1000; // 10 minutes — enough to alt-tab, not enough to be useful if leaked

export async function POST(req: Request) {
  if (!isValidFivemSecret(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // Keyed by IP (the game server's), not by player — this endpoint is only
  // ever called server-side by your own FiveM box, so a tight limit here
  // just guards against a misbehaving script looping, not real abuse.
  const ip = getClientIp(req) ?? "unknown";
  const { allowed } = rateLimit(`fivem-gen:${ip}`, 30, 60 * 1000);
  if (!allowed) {
    return NextResponse.json({ error: "too_many_requests" }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "validation_error" }, { status: 400 });
  }

  const { citizenId, characterName } = parsed.data;

  // Only one active code per character at a time — generating a new one
  // invalidates whatever the player didn't use yet.
  await prisma.fiveMLinkCode.updateMany({
    where: { citizenId, usedAt: null },
    data: { usedAt: new Date() },
  });

  const code = generateLinkCode();
  await prisma.fiveMLinkCode.create({
    data: {
      codeHash: hashLinkCode(code),
      citizenId,
      characterName,
      expiresAt: new Date(Date.now() + CODE_TTL_MS),
    },
  });

  return NextResponse.json({ code, expiresInSeconds: CODE_TTL_MS / 1000 });
}
