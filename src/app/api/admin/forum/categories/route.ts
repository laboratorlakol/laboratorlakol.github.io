import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth/admin-guard";
import { logAudit } from "@/lib/auth/audit";

function slugify(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics (ă, â, î, ș, ț -> a, a, i, s, t)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function GET() {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const categories = await prisma.forumCategory.findMany({
    orderBy: { position: "asc" },
    include: { _count: { select: { topics: true } } },
  });
  return NextResponse.json({ categories });
}

const bodySchema = z.object({
  name: z.string().min(1).max(60),
  description: z.string().max(300).optional(),
  staffOnlyReplies: z.boolean().optional(),
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

  const baseSlug = slugify(parsed.data.name) || "categorie";
  let slug = baseSlug;
  let suffix = 1;
  while (await prisma.forumCategory.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${++suffix}`;
  }

  const category = await prisma.forumCategory.create({
    data: { ...parsed.data, slug },
  });

  await logAudit({ userId: session.sub, action: "admin_forum_category_create", metadata: { categoryId: category.id }, req });

  return NextResponse.json({ category });
}
