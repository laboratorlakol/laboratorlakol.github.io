import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET() {
  const chapters = await prisma.regulationChapter.findMany({ orderBy: { position: "asc" }, include: { articles: { orderBy: { position: "asc" } } } });
  return NextResponse.json({ chapters });
}
