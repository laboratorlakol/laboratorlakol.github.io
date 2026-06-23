import { getSession } from "@/lib/auth/session";
import { isStaffRole } from "@/lib/tickets/permissions";
import type { AccessTokenPayload } from "@/lib/auth/jwt";

export async function requireStaffSession(): Promise<AccessTokenPayload | null> {
  const session = await getSession();
  if (!session) return null;
  if (!isStaffRole(session.role)) return null;
  return session;
}
