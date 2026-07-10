import { NextResponse } from "next/server";
import { TicketStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth/admin-guard";
export async function GET(req: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const statusParam = new URL(req.url).searchParams.get("status");
  const status = statusParam && statusParam in TicketStatus ? statusParam as TicketStatus : undefined;
  const tickets = await prisma.ticket.findMany({ where: status ? { status } : {}, orderBy: { updatedAt: "desc" }, include: { user: { select: { username: true } }, _count: { select: { messages: true } } } });
  return NextResponse.json({ tickets });
}
