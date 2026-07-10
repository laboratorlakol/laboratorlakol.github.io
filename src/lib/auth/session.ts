import { verifyAccessToken, type AccessTokenPayload } from "@/lib/auth/jwt";
import { getAccessCookie } from "@/lib/auth/cookies";
export async function getSession(): Promise<AccessTokenPayload | null> {
  const token = await getAccessCookie();
  if (!token) return null;
  return verifyAccessToken(token);
}
