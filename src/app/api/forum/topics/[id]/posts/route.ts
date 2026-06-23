import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { canReplyToTopic } from "@/lib/forum/permissions";
import { logAudit } from "@/lib/auth/audit";
import { rateLimit } from "@/lib/auth/rate-limit";

const bodySchema = z.object({
  content: z.string().min(1).max(10000),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { error: "unauthorized", message: "Trebuie să fii conectat pentru a răspunde." },
      { status: 401 }
    );
  }

  const { id } = await params;

  const { allowed } = rateLimit(`forum-reply:${session.sub}`, 30, 15 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { error: "too_many_requests", message: "Prea multe răspunsuri. Mai încearcă în câteva minute." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "validation_error" }, { status: 400 });
  }

  const topic = await prisma.forumTopic.findUnique({
    where: { id },
    include: { category: true },
  });
  if (!topic) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const permission = canReplyToTopic({
    userId: session.sub,
    role: session.role,
    topicAuthorId: topic.authorId,
    topicLocked: topic.locked,
    categoryStaffOnlyReplies: topic.category.staffOnlyReplies,
  });

  if (!permission.allowed) {
    return NextResponse.json(
      { error: "forbidden", message: permission.reason },
      { status: 403 }
    );
  }

  const post = await prisma.forumPost.create({
    data: { topicId: id, authorId: session.sub, content: parsed.data.content },
  });

  await prisma.forumTopic.update({ where: { id }, data: { updatedAt: new Date() } });
  await logAudit({ userId: session.sub, action: "forum_post_create", metadata: { topicId: id }, req });

  return NextResponse.json({ post });
}
