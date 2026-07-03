import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { logAudit } from "@/lib/auth/audit";
import { rateLimit } from "@/lib/auth/rate-limit";

const bodySchema = z.object({
  categoryId: z.string().min(1),
  title: z.string().min(3).max(150),
  content: z.string().min(1).max(10000),
});

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { error: "unauthorized", message: "Trebuie să fii conectat pentru a posta." },
      { status: 401 }
    );
  }

  const { allowed } = rateLimit(`forum-topic:${session.sub}`, 10, 15 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { error: "too_many_requests", message: "Prea multe topicuri create. Mai încearcă în câteva minute." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "validation_error" }, { status: 400 });
  }

  const category = await prisma.forumCategory.findUnique({
    where: { id: parsed.data.categoryId },
  });
  if (!category) {
    return NextResponse.json({ error: "category_not_found" }, { status: 404 });
  }

  const topic = await prisma.forumTopic.create({
    data: {
      categoryId: category.id,
      title: parsed.data.title,
      authorId: session.sub,
      posts: {
        create: {
          content: parsed.data.content,
          authorId: session.sub,
          isFirstPost: true,
        },
      },
    },
  });

  await logAudit({ userId: session.sub, action: "forum_topic_create", metadata: { topicId: topic.id }, req });
  revalidatePath("/forum", "layout");
  return NextResponse.json({ topic });
}
