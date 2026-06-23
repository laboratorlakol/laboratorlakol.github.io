import { prisma } from "@/lib/prisma";
import type { AccessTokenPayload } from "@/lib/auth/jwt";
import { canStaffAccessCategory } from "@/lib/tickets/permissions";
import type { Ticket } from "@prisma/client";

export interface TicketAccess {
  isOwner: boolean;
  /** Rank alone clears the bar for this ticket's category. */
  isQualifiedStaff: boolean;
  /** Explicitly looped in via TicketParticipant, regardless of rank. */
  isParticipant: boolean;
  canView: boolean;
  /** Treated as "staff" for status changes / the reply badge. */
  canActAsStaff: boolean;
}

export async function getTicketAccess(
  session: AccessTokenPayload,
  ticketId: string,
  ticket: Pick<Ticket, "userId" | "category">
): Promise<TicketAccess> {
  const isOwner = ticket.userId === session.sub;
  const isQualifiedStaff = canStaffAccessCategory(session.role, ticket.category);

  const isParticipant = isOwner
    ? false
    : !!(await prisma.ticketParticipant.findUnique({
        where: { ticketId_userId: { ticketId, userId: session.sub } },
      }));

  return {
    isOwner,
    isQualifiedStaff,
    isParticipant,
    canView: isOwner || isQualifiedStaff || isParticipant,
    canActAsStaff: isQualifiedStaff,
  };
}
