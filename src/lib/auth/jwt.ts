import { SignJWT, jwtVerify } from "jose";
import type { Role } from "@prisma/client";
export interface AccessTokenPayload { sub: string; username: string; role: Role; }
function getSecret() {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error("JWT_SECRET not set");
  return new TextEncoder().encode(s);
}
export async function signAccessToken(p: AccessTokenPayload) {
  return new SignJWT({ username: p.username, role: p.role }).setProtectedHeader({ alg: "HS256" }).setSubject(p.sub).setIssuedAt().setExpirationTime("15m").sign(getSecret());
}
export async function verifyAccessToken(token: string): Promise<AccessTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (!payload.sub || !payload.username || !payload.role) return null;
    return { sub: payload.sub, username: payload.username as string, role: payload.role as Role };
  } catch { return null; }
}
