import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { getSiteSettings } from "@/lib/cms";
import { ArrowUpRight } from "lucide-react";

export const revalidate = 30;

const CATEGORY_LABEL: Record<string, string> = {
  UPDATES: "Updates",
  EVENTS: "Events",
  ANNOUNCEMENTS: "Announcements",
  DEVELOPMENT_LOGS: "Development Logs",
};

export default async function NoutatiPage() {
  const [posts, settings] = await Promise.all([
    prisma.newsPost.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
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
          <h1 className="font-display uppercase text-3xl mt-3">Noutăți</h1>

          <div className="mt-10 grid sm:grid-cols-2 gap-5">
            {posts.length === 0 && (
              <p className="text-sm text-ink-faint col-span-2 text-center py-10">
                Nu sunt încă noutăți publicate.
              </p>
            )}
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/noutati/${post.id}`}
                className="panel rounded-md p-6 flex flex-col justify-between hover:border-line-strong transition-colors group"
              >
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-signal">
                    {CATEGORY_LABEL[post.category] ?? post.category}
                  </span>
                  <h2 className="mt-3 font-medium leading-snug">{post.title}</h2>
                  <p className="mt-2 text-sm text-ink-muted line-clamp-3">{post.excerpt}</p>
                </div>
                <div className="mt-5 flex items-center justify-between text-xs text-ink-faint font-mono">
                  <span>{new Date(post.createdAt).toLocaleDateString("ro-RO")}</span>
                  <ArrowUpRight
                    size={16}
                    className="text-signal opacity-0 group-hover:opacity-100 transition-opacity"
                  />
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
