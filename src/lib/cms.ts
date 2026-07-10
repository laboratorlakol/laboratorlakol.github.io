import { prisma } from "@/lib/prisma";

export interface SiteSettings {
  tebexUrl: string;
  discordInviteUrl: string;
}

const DEFAULTS: SiteSettings = {
  tebexUrl: "",
  discordInviteUrl: "https://discord.gg/dCAZbNzvaN",
};

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const rows = await prisma.siteSetting.findMany();
    const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    return { ...DEFAULTS, ...map } as SiteSettings;
  } catch { return DEFAULTS; }
}

export async function setSiteSetting(key: string, value: string): Promise<void> {
  await prisma.siteSetting.upsert({ where: { key }, update: { value }, create: { key, value } });
}

export async function getTeamMembers() {
  try { return await prisma.teamMember.findMany({ where: { visible: true }, orderBy: { position: "asc" } }); }
  catch { return []; }
}

export async function getPublishedNews() {
  try { return await prisma.newsPost.findMany({ where: { published: true }, orderBy: { createdAt: "desc" }, take: 3 }); }
  catch { return []; }
}
