import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requestPasswordResetSchema } from "@/lib/auth/validation";
import { generateOpaqueToken } from "@/lib/auth/tokens";
import { sendPasswordResetEmail } from "@/lib/email/send";
import { logAudit, getClientIp } from "@/lib/auth/audit";
import { rateLimit } from "@/lib/auth/rate-limit";

export async function POST(req: Request) {
  const ip = getClientIp(req) ?? "unknown";
  const { allowed } = rateLimit(`pwreset:${ip}`, 5, 15 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { error: "too_many_requests" },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = requestPasswordResetSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "validation_error" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
  });

  // Always return the same response, whether or not the email exists —
  // otherwise this endpoint becomes an email-enumeration oracle.
  const response = NextResponse.json({
    message:
      "Dacă există un cont cu acest email, vei primi un link de resetare.",
  });

  if (!user) return response;

  const { token, hash } = generateOpaqueToken();
  await prisma.passwordResetToken.create({
    data: {
      tokenHash: hash,
      userId: user.id,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    },
  });

  await sendPasswordResetEmail(user.email, token);
  await logAudit({ userId: user.id, action: "password_reset_requested", req });

  return response;
}
