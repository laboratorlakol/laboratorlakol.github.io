import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();
async function main() {
  const email = process.env.SEED_FOUNDER_EMAIL;
  const username = process.env.SEED_FOUNDER_USERNAME;
  const password = process.env.SEED_FOUNDER_PASSWORD;
  if (!email || !username || !password) { console.error("Set SEED_FOUNDER_EMAIL, SEED_FOUNDER_USERNAME and SEED_FOUNDER_PASSWORD"); process.exit(1); }
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.upsert({ where: { email: email.toLowerCase() }, update: { role: "FOUNDER", passwordHash, emailVerified: true }, create: { email: email.toLowerCase(), username, passwordHash, role: "FOUNDER", emailVerified: true } });
  console.log(`Founder account ready: ${user.username} <${user.email}>`);
}
main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
