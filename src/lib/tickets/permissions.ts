import { Role, TicketCategory } from "@prisma/client";
import { hasAtLeastRole } from "@/lib/auth/rbac";

/** Minimum rank required to see/handle tickets in each category. */
export const CATEGORY_MIN_ROLE: Record<TicketCategory, Role> = {
  REPORT_PLAYER: Role.HELPER,
  REPORT_STAFF: Role.SUPERVISOR,
  SANCTION_APPEAL: Role.ADMINISTRATOR,
  CONTACT_FOUNDER: Role.FOUNDER,
};

export const CATEGORY_LABELS: Record<TicketCategory, string> = {
  REPORT_PLAYER: "Raportare Jucător",
  REPORT_STAFF: "Raportare Membru Staff",
  SANCTION_APPEAL: "Contestare Sancțiune",
  CONTACT_FOUNDER: "Contact Fondator",
};

/** Does this rank clear the bar for this category on its own (regardless
 * of whether they're an owner/participant on any specific ticket)? */
export function canStaffAccessCategory(role: Role, category: TicketCategory): boolean {
  return hasAtLeastRole(role, CATEGORY_MIN_ROLE[category]);
}

/** Gate for the /staff area generally — lowest bar of any category. */
export function isStaffRole(role: Role): boolean {
  return hasAtLeastRole(role, Role.HELPER);
}

/** Which categories can this rank see in their staff inbox? */
export function visibleCategoriesFor(role: Role): TicketCategory[] {
  return (Object.keys(CATEGORY_MIN_ROLE) as TicketCategory[]).filter((cat) =>
    canStaffAccessCategory(role, cat)
  );
}
