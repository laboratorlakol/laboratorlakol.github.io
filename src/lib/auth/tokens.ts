import { randomBytes, createHash } from "crypto";

/** Returns [plainToken, hash]. Send `plainToken` to the client/cookie/email,
 * store only `hash` in the database. A leaked DB row is then useless. */
export function generateOpaqueToken(): { token: string; hash: string } {
  const token = randomBytes(32).toString("base64url");
  const hash = hashToken(token);
  return { token, hash };
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
