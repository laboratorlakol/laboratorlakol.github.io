import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth/admin-guard";
import { logAudit } from "@/lib/auth/audit";
import { slugify } from "@/lib/slugify";
import { revalidatePath } from "next/cache";
export async function GET() {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const categories = await prisma.forumCategory.findMany({ orderBy: [{ pinned:"desc"},{position:"asc"}], include: { _count: { select: { topics: true } } } });
  return NextResponse.json({ categories });
}
const bodySchema = z.object({ name: z.string().min(1).max(60), description: z.string().max(300).optional(), staffOnlyReplies: z.boolean().optional(), pinned: z.boolean().optional(), position: z.number().int().optional() });
export async function POST(req: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const body = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "validation_error" }, { status: 400 });
  const baseSlug = slugify(parsed.data.name) || "categorie";
  let slug = baseSlug; let suffix = 1;
  while (await prisma.forumCategory.findUnique({ where: { slug } })) slug = `${baseSlug}-${++suffix}`;
  const category = await prisma.forumCategory.create({ data: { ...parsed.data, slug } });
  await logAudit({ userId: session.sub, action: "admin_forum_category_create", metadata: { categoryId: category.id }, req });
  revalidatePath("/forum");
  return NextResponse.json({ category });
}
