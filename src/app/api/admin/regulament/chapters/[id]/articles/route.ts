import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth/admin-guard";
import { logAudit } from "@/lib/auth/audit";

const bodySchema = z.object({
  title: z.string().min(1).max(150),
  content: z.string().min(1),
  position: z.number().int().optional(),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "validation_error" }, { status: 400 });
  }

  const article = await prisma.regulationArticle.create({
    data: { ...parsed.data, chapterId: id },
  });

  await logAudit({ userId: session.sub, action: "admin_regulation_article_create", metadata: { articleId: article.id }, req });
  revalidatePath("/regulament");
  return NextResponse.json({ article });
}
