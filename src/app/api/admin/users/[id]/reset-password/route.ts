import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth/admin-guard";
import { generateOpaqueToken } from "@/lib/auth/tokens";
import { sendPasswordResetEmail } from "@/lib/email/send";
import { logAudit } from "@/lib/auth/audit";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const { token, hash } = generateOpaqueToken();
  await prisma.passwordResetToken.create({
    data: {
      tokenHash: hash,
      userId: target.id,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    },
  });

  await sendPasswordResetEmail(target.email, token);
  await logAudit({
    userId: session.sub,
    action: "admin_password_reset_triggered",
    metadata: { targetUserId: id, targetUsername: target.username },
    req,
  });

  return NextResponse.json({ ok: true });
}
