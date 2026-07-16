import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import { registerSchema } from "@/lib/auth/validation";
import { generateOpaqueToken } from "@/lib/auth/tokens";
import { sendVerificationEmail } from "@/lib/email/send";
import { logAudit, getClientIp } from "@/lib/auth/audit";
import { rateLimit } from "@/lib/auth/rate-limit";
import { verifyTurnstileToken } from "@/lib/turnstile";

export async function POST(req: Request) {
  const ip = getClientIp(req) ?? "unknown";
  const { allowed } = rateLimit(`register:${ip}`, 5, 15 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json({ error: "too_many_requests", message: "Prea multe încercări. Reîncearcă în câteva minute." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);

  // 1. Validate TOS acceptance
  if (!body?.tosAccepted) {
    return NextResponse.json({ error: "tos_not_accepted", message: "Trebuie să accepți Termenii și Condițiile." }, { status: 400 });
  }

  // 2. Validate form fields FIRST — so Turnstile token isn't wasted on bad input
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json({ error: "validation_error", message: first?.message ?? "Date invalide." }, { status: 400 });
  }

  // 3. Check for existing user BEFORE Turnstile — again, save the token
  const { username, email, password } = parsed.data;
  const normalizedEmail = email.toLowerCase();
  const existing = await prisma.user.findFirst({
    where: { OR: [{ email: normalizedEmail }, { username }] },
    select: { email: true, username: true },
  });
  if (existing) {
    const field = existing.email === normalizedEmail ? "email" : "username";
    return NextResponse.json({
      error: "already_exists",
      message: field === "email" ? "Există deja un cont cu acest email." : "Acest username este deja folosit.",
    }, { status: 409 });
  }

  // 4. Only now verify Turnstile (valid form + new user)
  const isHuman = await verifyTurnstileToken(body?.turnstileToken, ip);
  if (!isHuman) {
    return NextResponse.json({ error: "bot_check_failed", message: "Verificarea anti-bot a picat. Bifează din nou verificarea." }, { status: 403 });
  }

  // 5. Create account
  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { username, email: normalizedEmail, passwordHash, tosAcceptedAt: new Date() },
    select: { id: true, username: true, email: true },
  });

  const { token, hash } = generateOpaqueToken();
  await prisma.emailVerificationToken.create({
    data: { tokenHash: hash, userId: user.id, expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) },
  });
  await sendVerificationEmail(user.email, token);
  await logAudit({ userId: user.id, action: "register", req });

  return NextResponse.json({ message: "Cont creat. Verifică-ți emailul." });
}
