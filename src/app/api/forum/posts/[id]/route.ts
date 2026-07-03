import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { canModerateForum } from "@/lib/forum/permissions";
import { logAudit } from "@/lib/auth/audit";

const bodySchema = z.object({ content: z.string().min(1).max(10000) });

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const post = await prisma.forumPost.findUnique({ where: { id } });
  if (!post) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const isOwner = post.authorId === session.sub;
  const isModerator = canModerateForum(session.role);
  if (!isOwner && !isModerator) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "validation_error" }, { status: 400 });
  }

  const updated = await prisma.forumPost.update({
    where: { id },
    data: { content: parsed.data.content },
  });

  await logAudit({
    userId: session.sub,
    action: isOwner ? "forum_post_edit" : "forum_post_edit_moderator",
    metadata: { postId: id },
    req,
  });
  revalidatePath("/forum", "layout");
  return NextResponse.json({ post: updated });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const post = await prisma.forumPost.findUnique({ where: { id } });
  if (!post) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const isOwner = post.authorId === session.sub;
  const isModerator = canModerateForum(session.role);
  if (!isOwner && !isModerator) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  // Deleting the first post of a topic deletes the whole topic (cascades
  // to all replies) — only moderators can do that; an author trying to
  // delete just their own OP gets pointed at the real action instead.
  if (post.isFirstPost && !isModerator) {
    return NextResponse.json(
      {
        error: "cannot_delete_op",
        message: "Nu poți șterge primul mesaj al unui topic. Cere unui admin să șteargă topicul.",
      },
      { status: 400 }
    );
  }

  if (post.isFirstPost) {
    await prisma.forumTopic.delete({ where: { id: post.topicId } });
  } else {
    await prisma.forumPost.delete({ where: { id } });
  }

  await logAudit({
    userId: session.sub,
    action: isOwner ? "forum_post_delete" : "forum_post_delete_moderator",
    metadata: { postId: id },
    req,
  });
  revalidatePath("/forum", "layout");
  return NextResponse.json({ ok: true });
}
