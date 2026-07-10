import { Role, TicketCategory } from "@prisma/client";
import { hasAtLeastRole } from "@/lib/auth/rbac";

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

export function canStaffAccessCategory(role: Role, category: TicketCategory): boolean {
  return hasAtLeastRole(role, CATEGORY_MIN_ROLE[category]);
}
export function isStaffRole(role: Role): boolean { return hasAtLeastRole(role, Role.HELPER); }
export function visibleCategoriesFor(role: Role): TicketCategory[] {
  return (Object.keys(CATEGORY_MIN_ROLE) as TicketCategory[]).filter((c) => canStaffAccessCategory(role, c));
}
