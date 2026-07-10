import { Role } from "@prisma/client";

export const ROLE_HIERARCHY: Role[] = [
  Role.MEMBER, Role.HELPER, Role.MODERATOR, Role.ADMINISTRATOR,
  Role.SUPERVISOR, Role.COMMUNITY_MANAGER, Role.CO_FOUNDER, Role.FOUNDER,
];

export const ROLE_LABELS: Record<Role, string> = {
  MEMBER: "Member", HELPER: "Helper", MODERATOR: "Moderator",
  ADMINISTRATOR: "Administrator", SUPERVISOR: "Supervizor",
  COMMUNITY_MANAGER: "Community Manager", CO_FOUNDER: "Co-Fondator", FOUNDER: "Fondator",
};

export function roleRank(role: Role): number { return ROLE_HIERARCHY.indexOf(role); }
export function hasAtLeastRole(role: Role, minimum: Role): boolean { return roleRank(role) >= roleRank(minimum); }
export function hasAdminPanelAccess(role: Role): boolean { return hasAtLeastRole(role, Role.COMMUNITY_MANAGER); }
export function canModerateStaffApplications(role: Role): boolean { return hasAtLeastRole(role, Role.SUPERVISOR); }
