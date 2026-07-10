import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth/admin-guard";
export async function GET() {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const [totalUsers, verifiedUsers, suspendedUsers, bannedUsers, linkedCharacters, recentLogs] = await Promise.all([
    prisma.user.count(), prisma.user.count({ where: { emailVerified: true } }), prisma.user.count({ where: { status: "SUSPENDED" } }), prisma.user.count({ where: { status: "BANNED" } }), prisma.user.count({ where: { citizenId: { not: null } } }),
    prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 15, include: { user: { select: { username: true } } } }),
  ]);
  return NextResponse.json({ totalUsers, verifiedUsers, suspendedUsers, bannedUsers, linkedCharacters, recentLogs });
}
