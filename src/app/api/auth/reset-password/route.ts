import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resetPasswordSchema } from "@/lib/auth/validation";
import { hashToken } from "@/lib/auth/tokens";
import { hashPassword } from "@/lib/auth/password";
import { logAudit } from "@/lib/auth/audit";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = resetPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_error", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const { token, password } = parsed.data;
  const tokenHash = hashToken(token);

  const record = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
  });

  if (!record || record.usedAt || record.expiresAt < new Date()) {
    return NextResponse.json(
      { error: "invalid_or_expired_token" },
      { status: 400 }
    );
  }

  const passwordHash = await hashPassword(password);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    }),
    // Resetting the password kills every existing session — if someone else
    // had access to the account, this locks them back out.
    prisma.refreshToken.updateMany({
      where: { userId: record.userId, revokedAt: null },
      data: { revokedAt: new Date() },
    }),
  ]);

  await logAudit({ userId: record.userId, action: "password_reset_completed", req });

  return NextResponse.json({ ok: true });
}
