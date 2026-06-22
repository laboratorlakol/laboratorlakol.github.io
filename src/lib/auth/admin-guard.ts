import { getSession } from "@/lib/auth/session";
import { hasAdminPanelAccess } from "@/lib/auth/rbac";
import type { AccessTokenPayload } from "@/lib/auth/jwt";

/** Returns the session if it has admin panel access, otherwise null. */
export async function requireAdminSession(): Promise<AccessTokenPayload | null> {
  const session = await getSession();
  if (!session) return null;
  if (!hasAdminPanelAccess(session.role)) return null;
  return session;
}
