import { NextResponse } from "next/server";
import { z } from "zod";
import { ReactionType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";

const bodySchema = z.object({
  type: z.nativeEnum(ReactionType).nullable(),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "validation_error" }, { status: 400 });
  }

  const post = await prisma.forumPost.findUnique({ where: { id } });
  if (!post) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  if (parsed.data.type === null) {
    await prisma.forumPostReaction.deleteMany({ where: { postId: id, userId: session.sub } });
  } else {
    await prisma.forumPostReaction.upsert({
      where: { postId_userId: { postId: id, userId: session.sub } },
      update: { type: parsed.data.type },
      create: { postId: id, userId: session.sub, type: parsed.data.type },
    });
  }

  const counts = await prisma.forumPostReaction.groupBy({
    by: ["type"],
    where: { postId: id },
    _count: true,
  });

  return NextResponse.json({
    counts: Object.fromEntries(counts.map((c) => [c.type, c._count])),
    myReaction: parsed.data.type,
  });
}
