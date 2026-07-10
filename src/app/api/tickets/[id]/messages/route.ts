import { NextResponse } from "next/server";
import { z } from "zod";
import { TicketStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { getTicketAccess } from "@/lib/tickets/access";
import { logAudit } from "@/lib/auth/audit";
import { rateLimit } from "@/lib/auth/rate-limit";
const bodySchema = z.object({ content: z.string().min(1).max(5000) });
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;
  const { allowed } = rateLimit(`ticket-reply:${session.sub}`, 30, 15*60*1000);
  if (!allowed) return NextResponse.json({ error: "too_many_requests" }, { status: 429 });
  const ticket = await prisma.ticket.findUnique({ where: { id } });
  if (!ticket) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const access = await getTicketAccess(session, id, ticket);
  if (!access.canView) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  if (ticket.status === TicketStatus.CLOSED) return NextResponse.json({ error: "ticket_closed", message: "Acest ticket este închis." }, { status: 400 });
  const body = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "validation_error" }, { status: 400 });
  const message = await prisma.ticketMessage.create({ data: { ticketId: id, authorId: session.sub, content: parsed.data.content, isStaffReply: access.canActAsStaff || access.isParticipant } });
  await prisma.ticket.update({ where: { id }, data: { updatedAt: new Date(), ...(access.canActAsStaff && ticket.status === TicketStatus.OPEN ? { status: TicketStatus.IN_PROGRESS } : {}) } });
  await logAudit({ userId: session.sub, action: access.canActAsStaff ? "ticket_reply_staff" : "ticket_reply_owner", metadata: { ticketId: id }, req });
  return NextResponse.json({ message });
}
