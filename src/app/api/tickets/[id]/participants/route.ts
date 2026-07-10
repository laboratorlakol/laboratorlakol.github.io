import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { getTicketAccess } from "@/lib/tickets/access";
import { logAudit } from "@/lib/auth/audit";
const bodySchema = z.object({ username: z.string().min(1).max(40) });
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;
  const ticket = await prisma.ticket.findUnique({ where: { id } });
  if (!ticket) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const access = await getTicketAccess(session, id, ticket);
  if (!access.canActAsStaff) return NextResponse.json({ error: "forbidden", message: "Doar staff-ul calificat poate adăuga o persoană." }, { status: 403 });
  const body = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "validation_error" }, { status: 400 });
  const target = await prisma.user.findUnique({ where: { username: parsed.data.username } });
  if (!target) return NextResponse.json({ error: "not_found", message: "Nu există niciun utilizator cu acest username." }, { status: 404 });
  if (target.id === ticket.userId) return NextResponse.json({ error: "already_owner", message: "Acest utilizator este deja autorul ticketului." }, { status: 400 });
  const participant = await prisma.ticketParticipant.upsert({ where: { ticketId_userId: { ticketId: id, userId: target.id } }, update: {}, create: { ticketId: id, userId: target.id }, include: { user: { select: { id: true, username: true } } } });
  await logAudit({ userId: session.sub, action: "ticket_participant_add", metadata: { ticketId: id, addedUserId: target.id }, req });
  return NextResponse.json({ participant });
}
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;
  const userId = new URL(req.url).searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "missing_user_id" }, { status: 400 });
  const ticket = await prisma.ticket.findUnique({ where: { id } });
  if (!ticket) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const access = await getTicketAccess(session, id, ticket);
  if (!access.canActAsStaff) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  await prisma.ticketParticipant.deleteMany({ where: { ticketId: id, userId } });
  await logAudit({ userId: session.sub, action: "ticket_participant_remove", metadata: { ticketId: id, removedUserId: userId }, req });
  return NextResponse.json({ ok: true });
}
