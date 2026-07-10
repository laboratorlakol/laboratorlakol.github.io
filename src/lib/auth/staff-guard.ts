import { getSession } from "@/lib/auth/session";
import { hasAtLeastRole } from "@/lib/auth/rbac";
import { Role } from "@prisma/client";
import type { AccessTokenPayload } from "@/lib/auth/jwt";
export async function requireStaffSession(): Promise<AccessTokenPayload | null> {
  const s = await getSession(); if (!s) return null;
  if (!hasAtLeastRole(s.role, Role.HELPER)) return null;
  return s;
}
