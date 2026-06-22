import { prisma } from "@/lib/prisma";

export const DEFAULT_SETTINGS = {
  tebexUrl: "",
  discordInviteUrl: "https://discord.gg/dCAZbNzvaN",
};

export type SiteSettings = typeof DEFAULT_SETTINGS;

export async function getSiteSettings(): Promise<SiteSettings> {
  const rows = await prisma.siteSetting.findMany();
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  return {
    tebexUrl: map.tebexUrl ?? DEFAULT_SETTINGS.tebexUrl,
    discordInviteUrl: map.discordInviteUrl ?? DEFAULT_SETTINGS.discordInviteUrl,
  };
}

export async function setSiteSetting(key: string, value: string) {
  return prisma.siteSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}

export async function getTeamMembers() {
  return prisma.teamMember.findMany({
    where: { visible: true },
    orderBy: { position: "asc" },
  });
}

export async function getPublishedNews(limit = 3) {
  return prisma.newsPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
