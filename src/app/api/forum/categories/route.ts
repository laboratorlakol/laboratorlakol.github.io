import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const categories = await prisma.forumCategory.findMany({
    orderBy: { position: "asc" },
    include: {
      _count: { select: { topics: true } },
      topics: {
        orderBy: { updatedAt: "desc" },
        take: 1,
        select: { updatedAt: true, title: true, id: true },
      },
    },
  });

  return NextResponse.json({ categories });
}
