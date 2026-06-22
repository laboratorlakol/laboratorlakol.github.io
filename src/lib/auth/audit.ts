import { prisma } from "@/lib/prisma";

export function getClientIp(req: Request): string | null {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip");
}

export async function logAudit(params: {
  userId?: string | null;
  action: string;
  metadata?: Record<string, unknown>;
  req?: Request;
}) {
  const { userId, action, metadata, req } = params;
  try {
    await prisma.auditLog.create({
      data: {
        userId: userId ?? null,
        action,
        metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : undefined,
        ip: req ? getClientIp(req) : null,
        userAgent: req ? req.headers.get("user-agent") : null,
      },
    });
  } catch {
    // Audit logging must never break the actual request.
  }
}
