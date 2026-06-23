import { SignJWT, jwtVerify } from "jose";
import type { Role } from "@prisma/client";

const ACCESS_TOKEN_TTL = "15m";

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(
      "JWT_SECRET is not set. Add it to your environment variables."
    );
  }
  return new TextEncoder().encode(secret);
}

export interface AccessTokenPayload {
  sub: string; // user id
  username: string;
  role: Role;
}

export async function signAccessToken(payload: AccessTokenPayload) {
  return new SignJWT({ username: payload.username, role: payload.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_TTL)
    .sign(getSecret());
}

export async function verifyAccessToken(
  token: string
): Promise<AccessTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (!payload.sub || !payload.username || !payload.role) return null;
    return {
      sub: payload.sub,
      username: payload.username as string,
      role: payload.role as Role,
    };
  } catch {
    return null;
  }
}
