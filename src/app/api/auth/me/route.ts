import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ user: null });
  const user = await prisma.user.findUnique({ where: { id: session.sub }, select: { id:true, username:true, email:true, role:true, emailVerified:true, citizenId:true, characterName:true, createdAt:true } });
  return NextResponse.json({ user: user ?? null });
}
