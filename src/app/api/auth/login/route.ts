import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { loginSchema } from "@/lib/auth/validation";
import { signAccessToken } from "@/lib/auth/jwt";
import { generateOpaqueToken } from "@/lib/auth/tokens";
import { setAccessCookie, setRefreshCookie } from "@/lib/auth/cookies";
import { logAudit, getClientIp } from "@/lib/auth/audit";
import { rateLimit } from "@/lib/auth/rate-limit";

export async function POST(req: Request) {
  const ip = getClientIp(req) ?? "unknown";
  const { allowed } = rateLimit(`login:${ip}`, 10, 15 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { error: "too_many_requests", message: "Prea multe încercări. Mai încearcă în câteva minute." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_error", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  // Same generic error whether the email doesn't exist or the password is
  // wrong — don't help an attacker enumerate which emails have accounts.
  const genericError = NextResponse.json(
    { error: "invalid_credentials", message: "Email sau parolă incorectă." },
    { status: 401 }
  );

  if (!user) {
    await logAudit({ action: "login_failed", metadata: { email }, req });
    return genericError;
  }

  if (user.status === "BANNED") {
    await logAudit({ userId: user.id, action: "login_blocked_banned", req });
    return NextResponse.json(
      { error: "account_banned", message: "Acest cont este banat." },
      { status: 403 }
    );
  }

  if (user.status === "SUSPENDED") {
    await logAudit({ userId: user.id, action: "login_blocked_suspended", req });
    return NextResponse.json(
      { error: "account_suspended", message: "Acest cont este suspendat." },
      { status: 403 }
    );
  }

  const validPassword = await verifyPassword(password, user.passwordHash);
  if (!validPassword) {
    await logAudit({ userId: user.id, action: "login_failed", req });
    return genericError;
  }

  const accessToken = await signAccessToken({
    sub: user.id,
    username: user.username,
    role: user.role,
  });

  const { token: refreshToken, hash } = generateOpaqueToken();
  await prisma.refreshToken.create({
    data: {
      tokenHash: hash,
      userId: user.id,
      userAgent: req.headers.get("user-agent"),
      ip,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  await setAccessCookie(accessToken);
  await setRefreshCookie(refreshToken);
  await logAudit({ userId: user.id, action: "login_success", req });

  return NextResponse.json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
    },
  });
}
