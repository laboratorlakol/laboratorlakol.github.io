import { NextResponse } from "next/server";
import { TicketStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireStaffSession } from "@/lib/auth/staff-guard";
import { visibleCategoriesFor } from "@/lib/tickets/permissions";
export async function GET(req: Request) {
  const session = await requireStaffSession();
  if (!session) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const statusParam = new URL(req.url).searchParams.get("status");
  const status = statusParam && statusParam in TicketStatus ? statusParam as TicketStatus : undefined;
  const categories = visibleCategoriesFor(session.role);
  const tickets = await prisma.ticket.findMany({ where: { ...(status ? { status } : {}), OR: [{ category: { in: categories } }, { participants: { some: { userId: session.sub } } }] }, orderBy: { updatedAt: "desc" }, include: { user: { select: { username: true } }, _count: { select: { messages: true } } } });
  return NextResponse.json({ tickets, visibleCategories: categories });
}
