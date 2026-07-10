import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isValidFivemSecret } from "@/lib/fivem/auth";

const bodySchema = z.object({
  license: z.string().min(1),
  citizenId: z.string().min(1),
  minutesToAdd: z.number().min(0),
});

export async function POST(req: Request) {
  if (!isValidFivemSecret(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "validation_error" }, { status: 400 });
  }

  const { license, citizenId, minutesToAdd } = parsed.data;
  if (minutesToAdd <= 0) return NextResponse.json({ ok: true });

  // Try to find user by license first, then fall back to citizenId
  const user = await prisma.user.findFirst({
    where: { OR: [{ fivemLicense: license }, { citizenId }] },
    select: { id: true },
  });

  if (!user) return NextResponse.json({ ok: true, note: "user_not_linked" });

  await prisma.user.update({
    where: { id: user.id },
    data: {
      playtimeMinutes: { increment: minutesToAdd },
      // Store license for future syncs (so license lookup works)
      fivemLicense: license,
    },
  });

  return NextResponse.json({ ok: true });
}
