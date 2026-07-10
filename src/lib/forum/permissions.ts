import { Role } from "@prisma/client";
import { hasAdminPanelAccess, canModerateStaffApplications } from "@/lib/auth/rbac";

export function canReplyToTopic(p: { userId: string; role: Role; topicAuthorId: string | null; topicLocked: boolean; categoryStaffOnlyReplies: boolean; }): { allowed: boolean; reason?: string } {
  if (hasAdminPanelAccess(p.role)) return { allowed: true };
  if (p.topicLocked) return { allowed: false, reason: "Acest topic este blocat." };
  if (p.categoryStaffOnlyReplies) {
    if (p.topicAuthorId !== p.userId && !canModerateStaffApplications(p.role))
      return { allowed: false, reason: "Doar staff-ul poate răspunde în acest topic." };
  }
  return { allowed: true };
}
export function canModerateForum(role: Role): boolean { return hasAdminPanelAccess(role); }
