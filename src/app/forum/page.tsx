import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { MessageSquare, Lock, Pin } from "lucide-react";
import { getSiteSettings } from "@/lib/cms";

export const dynamic = "force-dynamic";

export default async function ForumHomePage() {
  const [categories, settings] = await Promise.all([
    prisma.forumCategory.findMany({
      orderBy: [{ pinned: "desc" }, { position: "asc" }],
      include: {
        _count: { select: { topics: true } },
        topics: {
          orderBy: { updatedAt: "desc" },
          take: 1,
          select: { title: true, updatedAt: true },
        },
      },
    }),
    getSiteSettings(),
  ]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-void px-6 pt-32 pb-24">
        <div className="mx-auto max-w-4xl">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-signal">
            Comunitate
          </span>
          <h1 className="font-display uppercase text-3xl mt-3">Forum</h1>

          <div className="mt-8 panel rounded-md divide-y divide-line">
            {categories.length === 0 && (
              <p className="px-5 py-8 text-center text-sm text-ink-faint">
                Nu există încă nicio categorie pe forum.
              </p>
            )}
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/forum/${cat.slug}`}
                className="flex items-center justify-between px-5 py-4 hover:bg-panel-raised transition-colors"
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className="text-signal shrink-0" size={20} />
                  <div>
                    <div className="flex items-center gap-2">
                      {cat.pinned && <Pin size={13} className="text-signal" />}
                      <h2 className="font-medium">{cat.name}</h2>
                      {cat.staffOnlyReplies && (
                        <Lock size={12} className="text-ink-faint" />
                      )}
                    </div>
                    {cat.description && (
                      <p className="text-sm text-ink-faint mt-0.5">{cat.description}</p>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className="font-mono text-sm text-signal">{cat._count.topics}</p>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-ink-faint">
                    topicuri
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer discordUrl={settings.discordInviteUrl} />
    </>
  );
}
