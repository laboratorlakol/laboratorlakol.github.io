import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signAccessToken } from "@/lib/auth/jwt";
import { generateOpaqueToken, hashToken } from "@/lib/auth/tokens";
import { getRefreshCookie, setAccessCookie, setRefreshCookie, clearAuthCookies } from "@/lib/auth/cookies";
import { logAudit, getClientIp } from "@/lib/auth/audit";
export async function POST(req: Request) {
  const refreshToken = await getRefreshCookie();
  if (!refreshToken) return NextResponse.json({ error: "no_session" }, { status: 401 });
  const tokenHash = hashToken(refreshToken);
  const stored = await prisma.refreshToken.findUnique({ where: { tokenHash }, include: { user: true } });
  if (!stored || stored.revokedAt || stored.expiresAt < new Date()) { await clearAuthCookies(); return NextResponse.json({ error: "invalid_session" }, { status: 401 }); }
  await prisma.refreshToken.update({ where: { id: stored.id }, data: { revokedAt: new Date() } });
  const { token: newRefreshToken, hash: newHash } = generateOpaqueToken();
  await prisma.refreshToken.create({ data: { tokenHash: newHash, userId: stored.userId, userAgent: req.headers.get("user-agent"), ip: getClientIp(req), expiresAt: new Date(Date.now() + 30*24*60*60*1000) } });
  const accessToken = await signAccessToken({ sub: stored.user.id, username: stored.user.username, role: stored.user.role });
  await setAccessCookie(accessToken);
  await setRefreshCookie(newRefreshToken);
  await logAudit({ userId: stored.user.id, action: "token_refresh", req });
  return NextResponse.json({ ok: true });
}
