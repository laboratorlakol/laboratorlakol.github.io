import { Role } from "@prisma/client";

// Order matters: index = rank. Higher index = more privilege.
export const ROLE_HIERARCHY: Role[] = [
  Role.MEMBER,
  Role.VERIFIED_PLAYER,
  Role.SUPPORT,
  Role.MODERATOR,
  Role.ADMINISTRATOR,
  Role.SENIOR_ADMINISTRATOR,
  Role.HEAD_STAFF,
  Role.MANAGER,
  Role.CO_FOUNDER,
  Role.FOUNDER,
];

export function roleRank(role: Role): number {
  return ROLE_HIERARCHY.indexOf(role);
}

/** True if `role` is at least as senior as `minimum`. */
export function hasAtLeastRole(role: Role, minimum: Role): boolean {
  return roleRank(role) >= roleRank(minimum);
}

// Per the brief: only Manager, Co-Founder, Founder can create/promote admins.
export const CAN_MANAGE_ADMINS: Role[] = [
  Role.MANAGER,
  Role.CO_FOUNDER,
  Role.FOUNDER,
];

export function canManageAdmins(role: Role): boolean {
  return CAN_MANAGE_ADMINS.includes(role);
}
