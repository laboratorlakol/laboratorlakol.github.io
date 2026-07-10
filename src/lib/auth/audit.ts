import { prisma } from "@/lib/prisma";
export function getClientIp(req: Request): string | null {
  const f = req.headers.get("x-forwarded-for");
  if (f) return f.split(",")[0].trim();
  return req.headers.get("x-real-ip");
}
export async function logAudit(p: { userId?: string | null; action: string; metadata?: Record<string,unknown>; req?: Request; }) {
  try { await prisma.auditLog.create({ data: { userId: p.userId ?? null, action: p.action, metadata: p.metadata ? JSON.parse(JSON.stringify(p.metadata)) : undefined, ip: p.req ? getClientIp(p.req) : null, userAgent: p.req ? p.req.headers.get("user-agent") : null } }); } catch {}
}
