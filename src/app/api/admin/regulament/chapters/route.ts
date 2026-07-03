import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth/admin-guard";
import { logAudit } from "@/lib/auth/audit";

export async function GET() {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const chapters = await prisma.regulationChapter.findMany({
    orderBy: { position: "asc" },
    include: { articles: { orderBy: { position: "asc" } } },
  });
  return NextResponse.json({ chapters });
}

const bodySchema = z.object({
  title: z.string().min(1).max(120),
  position: z.number().int().optional(),
});

export async function POST(req: Request) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "validation_error" }, { status: 400 });
  }

  const chapter = await prisma.regulationChapter.create({ data: parsed.data });
  await logAudit({ userId: session.sub, action: "admin_regulation_chapter_create", metadata: { chapterId: chapter.id }, req });
  revalidatePath("/regulament");
  return NextResponse.json({ chapter });
}
