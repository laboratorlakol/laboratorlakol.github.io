import { randomInt, createHash } from "crypto";
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function randomSegment(l: number): string { let o=""; for(let i=0;i<l;i++) o+=ALPHABET[randomInt(ALPHABET.length)]; return o; }
export function generateLinkCode(): string { return `FADED-${randomSegment(4)}-${randomSegment(4)}`; }
export function hashLinkCode(code: string): string { return createHash("sha256").update(code.trim().toUpperCase()).digest("hex"); }
