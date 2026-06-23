import { Role } from "@prisma/client";
import { hasAdminPanelAccess, canModerateStaffApplications } from "@/lib/auth/rbac";

interface ReplyPermissionInput {
  userId: string;
  role: Role;
  topicAuthorId: string | null;
  topicLocked: boolean;
  categoryStaffOnlyReplies: boolean;
}

export function canReplyToTopic({
  userId,
  role,
  topicAuthorId,
  topicLocked,
  categoryStaffOnlyReplies,
}: ReplyPermissionInput): { allowed: boolean; reason?: string } {
  // Admin-access roles can always post, even in a locked topic — they're
  // the ones who'd lock/unlock it to make an announcement anyway.
  if (hasAdminPanelAccess(role)) return { allowed: true };

  if (topicLocked) {
    return { allowed: false, reason: "Acest topic este blocat." };
  }

  if (categoryStaffOnlyReplies) {
    const isOwnTopic = topicAuthorId === userId;
    const isStaff = canModerateStaffApplications(role);
    if (!isOwnTopic && !isStaff) {
      return {
        allowed: false,
        reason: "Doar staff-ul poate răspunde în acest topic.",
      };
    }
  }

  return { allowed: true };
}

/** Pin/lock/move/delete topics, delete any post, manage categories. */
export function canModerateForum(role: Role): boolean {
  return hasAdminPanelAccess(role);
}
