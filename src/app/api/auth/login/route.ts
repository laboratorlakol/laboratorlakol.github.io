import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { loginSchema } from "@/lib/auth/validation";
import { signAccessToken } from "@/lib/auth/jwt";
import { generateOpaqueToken } from "@/lib/auth/tokens";
import { setAccessCookie, setRefreshCookie } from "@/lib/auth/cookies";
import { logAudit, getClientIp } from "@/lib/auth/audit";
import { rateLimit } from "@/lib/auth/rate-limit";
import { verifyTurnstileToken } from "@/lib/turnstile";

export async function POST(req: Request) {
  const ip = getClientIp(req) ?? "unknown";
  const { allowed } = rateLimit(`login:${ip}`, 10, 15 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json({ error: "too_many_requests", message: "Prea multe încercări." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);

  // 1. Validate form fields first
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "validation_error", message: "Email sau parolă invalidă." }, { status: 400 });
  }

  // 2. Check credentials before consuming Turnstile token
  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  const credErr = NextResponse.json({ error: "invalid_credentials", message: "Email sau parolă incorectă." }, { status: 401 });

  if (!user) {
    await logAudit({ action: "login_failed", metadata: { email }, req });
    return credErr;
  }
  if (user.status === "BANNED") {
    return NextResponse.json({ error: "account_banned", message: "Acest cont este banat." }, { status: 403 });
  }
  if (user.status === "SUSPENDED") {
    return NextResponse.json({ error: "account_suspended", message: "Acest cont este suspendat." }, { status: 403 });
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    await logAudit({ userId: user.id, action: "login_failed", req });
    return credErr;
  }

  // 3. Only verify Turnstile once we know credentials are correct
  const isHuman = await verifyTurnstileToken(body?.turnstileToken, ip);
  if (!isHuman) {
    return NextResponse.json({ error: "bot_check_failed", message: "Verificarea anti-bot a picat. Bifează din nou verificarea." }, { status: 403 });
  }

  // 4. Issue tokens
  const accessToken = await signAccessToken({ sub: user.id, username: user.username, role: user.role });
  const { token: refreshToken, hash } = generateOpaqueToken();
  await prisma.refreshToken.create({
    data: { tokenHash: hash, userId: user.id, userAgent: req.headers.get("user-agent"), ip, expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
  });
  await setAccessCookie(accessToken);
  await setRefreshCookie(refreshToken);
  await logAudit({ userId: user.id, action: "login_success", req });

  return NextResponse.json({ user: { id: user.id, username: user.username, email: user.email, role: user.role, emailVerified: user.emailVerified } });
}
