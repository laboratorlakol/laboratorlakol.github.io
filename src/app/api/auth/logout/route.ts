import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashToken } from "@/lib/auth/tokens";
import { getRefreshCookie, clearAuthCookies } from "@/lib/auth/cookies";
import { getSession } from "@/lib/auth/session";
import { logAudit } from "@/lib/auth/audit";
export async function POST(req: Request) {
  const refreshToken = await getRefreshCookie();
  const session = await getSession();
  if (refreshToken) { const tokenHash = hashToken(refreshToken); await prisma.refreshToken.updateMany({ where: { tokenHash, revokedAt: null }, data: { revokedAt: new Date() } }).catch(() => null); }
  await clearAuthCookies();
  await logAudit({ userId: session?.sub ?? null, action: "logout", req });
  return NextResponse.json({ ok: true });
}
