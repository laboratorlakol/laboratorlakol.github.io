import { Role } from "@prisma/client";

// Order matters: index = rank. Higher index = more privilege.
export const ROLE_HIERARCHY: Role[] = [
  Role.MEMBER,
  Role.HELPER,
  Role.MODERATOR,
  Role.ADMINISTRATOR,
  Role.SUPERVISOR,
  Role.COMMUNITY_MANAGER,
  Role.CO_FOUNDER,
  Role.FOUNDER,
];

// Romanian display labels — used anywhere a role is shown to a person.
export const ROLE_LABELS: Record<Role, string> = {
  MEMBER: "Member",
  HELPER: "Helper",
  MODERATOR: "Moderator",
  ADMINISTRATOR: "Administrator",
  SUPERVISOR: "Supervizor",
  COMMUNITY_MANAGER: "Community Manager",
  CO_FOUNDER: "Co-Fondator",
  FOUNDER: "Fondator",
};

export function roleRank(role: Role): number {
  return ROLE_HIERARCHY.indexOf(role);
}

/** True if `role` is at least as senior as `minimum`. */
export function hasAtLeastRole(role: Role, minimum: Role): boolean {
  return roleRank(role) >= roleRank(minimum);
}

// --- Specific access rules for this server -----------------------------
// Per the brief: ONLY Community Manager, Co-Fondator and Fondator get into
// the admin panel. Helper / Moderator / Administrator are cosmetic ranks
// for now — no panel access, no special permissions, just a badge.
export const PANEL_ACCESS_MIN_ROLE: Role = Role.COMMUNITY_MANAGER;

export function hasAdminPanelAccess(role: Role): boolean {
  return hasAtLeastRole(role, PANEL_ACCESS_MIN_ROLE);
}

// Only Community Manager+ can create/promote other admins (same tier as
// general panel access on this server — there's no separate "manager" rank
// above it anymore).
export function canManageAdmins(role: Role): boolean {
  return hasAtLeastRole(role, PANEL_ACCESS_MIN_ROLE);
}

// The one deliberate exception: Supervisor doesn't get the admin panel, but
// does get to moderate/comment on Staff Application threads in the forum.
// Anyone Community Manager+ can obviously do this too (they can do
// everything), so this is just "Supervisor or above".
export function canModerateStaffApplications(role: Role): boolean {
  return hasAtLeastRole(role, Role.SUPERVISOR);
}
