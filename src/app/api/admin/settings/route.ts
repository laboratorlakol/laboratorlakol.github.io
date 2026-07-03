import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth/admin-guard";
import { getSiteSettings, setSiteSetting } from "@/lib/cms";
import { logAudit } from "@/lib/auth/audit";

export async function GET() {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const settings = await getSiteSettings();
  return NextResponse.json({ settings });
}

const bodySchema = z.object({
  tebexUrl: z.string().url().or(z.literal("")).optional(),
  discordInviteUrl: z.string().url().optional(),
});

export async function PUT(req: Request) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_error", message: "URL invalid." },
      { status: 400 }
    );
  }

  if (parsed.data.tebexUrl !== undefined) {
    await setSiteSetting("tebexUrl", parsed.data.tebexUrl);
  }
  if (parsed.data.discordInviteUrl !== undefined) {
    await setSiteSetting("discordInviteUrl", parsed.data.discordInviteUrl);
  }

  await logAudit({
    userId: session.sub,
    action: "admin_settings_update",
    metadata: parsed.data,
    req,
  });

  revalidatePath("/");
  revalidatePath("/magazin");

  const settings = await getSiteSettings();
  return NextResponse.json({ settings });
}
