import { randomInt, createHash } from "crypto";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I — avoids
// in-game chat ambiguity when a player reads the code out loud or retypes it.

function randomSegment(length: number): string {
  let out = "";
  for (let i = 0; i < length; i++) {
    out += ALPHABET[randomInt(ALPHABET.length)];
  }
  return out;
}

export function generateLinkCode(): string {
  return `FADED-${randomSegment(4)}-${randomSegment(4)}`;
}

export function hashLinkCode(code: string): string {
  // Normalize so "faded-ab12-cd34" and "FADED-AB12-CD34" hash the same way —
  // players will inevitably mistype case when retyping from in-game chat.
  return createHash("sha256").update(code.trim().toUpperCase()).digest("hex");
}
