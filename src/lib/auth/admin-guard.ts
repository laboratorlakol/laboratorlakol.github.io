import { getSession } from "@/lib/auth/session";
import { hasAdminPanelAccess } from "@/lib/auth/rbac";
import type { AccessTokenPayload } from "@/lib/auth/jwt";
export async function requireAdminSession(): Promise<AccessTokenPayload | null> {
  const s = await getSession(); if (!s) return null;
  if (!hasAdminPanelAccess(s.role)) return null;
  return s;
}
