import { NextResponse } from "next/server";
import { z } from "zod";
import { TicketStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { getTicketAccess } from "@/lib/tickets/access";
import { logAudit } from "@/lib/auth/audit";
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;
  const ticket = await prisma.ticket.findUnique({ where: { id }, include: { user: { select: { username: true } }, participants: { include: { user: { select: { id: true, username: true } } } }, messages: { orderBy: { createdAt: "asc" }, include: { author: { select: { username: true, role: true } } } } } });
  if (!ticket) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const access = await getTicketAccess(session, id, ticket);
  if (!access.canView) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  return NextResponse.json({ ticket, isStaffView: access.canActAsStaff || (access.isParticipant && !access.isOwner), canManageStatus: access.canActAsStaff });
}
const bodySchema = z.object({ status: z.nativeEnum(TicketStatus) });
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;
  const ticket = await prisma.ticket.findUnique({ where: { id } });
  if (!ticket) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const access = await getTicketAccess(session, id, ticket);
  if (!access.canView) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const body = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "validation_error" }, { status: 400 });
  if (!access.canActAsStaff && parsed.data.status === TicketStatus.IN_PROGRESS) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const updated = await prisma.ticket.update({ where: { id }, data: { status: parsed.data.status } });
  await logAudit({ userId: session.sub, action: access.canActAsStaff ? "ticket_status_update_staff" : "ticket_status_update_owner", metadata: { ticketId: id, status: parsed.data.status }, req });
  return NextResponse.json({ ticket: updated });
}
