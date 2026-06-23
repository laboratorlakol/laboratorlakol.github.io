import { verifyAccessToken, type AccessTokenPayload } from "@/lib/auth/jwt";
import { getAccessCookie } from "@/lib/auth/cookies";

/** Reads and verifies the access-token cookie. Returns null if missing,
 * expired, or invalid — callers should treat that as "not logged in" and,
 * client-side, attempt POST /api/auth/refresh before giving up. */
export async function getSession(): Promise<AccessTokenPayload | null> {
  const token = await getAccessCookie();
  if (!token) return null;
  return verifyAccessToken(token);
}
