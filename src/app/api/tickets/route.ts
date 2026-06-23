import { NextResponse } from "next/server";
import { z } from "zod";
import { TicketCategory } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { logAudit } from "@/lib/auth/audit";
import { rateLimit } from "@/lib/auth/rate-limit";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const tickets = await prisma.ticket.findMany({
    where: { userId: session.sub },
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { messages: true } } },
  });

  return NextResponse.json({ tickets });
}

const bodySchema = z.object({
  subject: z.string().min(3).max(150),
  category: z.nativeEnum(TicketCategory).default(TicketCategory.REPORT_PLAYER),
  content: z.string().min(1).max(5000),
});

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { error: "unauthorized", message: "Trebuie să fii conectat." },
      { status: 401 }
    );
  }

  const { allowed } = rateLimit(`ticket-create:${session.sub}`, 8, 60 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { error: "too_many_requests", message: "Prea multe tickete create. Mai încearcă mai târziu." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "validation_error" }, { status: 400 });
  }

  const ticket = await prisma.ticket.create({
    data: {
      subject: parsed.data.subject,
      category: parsed.data.category,
      userId: session.sub,
      messages: {
        create: { content: parsed.data.content, authorId: session.sub, isStaffReply: false },
      },
    },
  });

  await logAudit({ userId: session.sub, action: "ticket_create", metadata: { ticketId: ticket.id }, req });

  return NextResponse.json({ ticket });
}
