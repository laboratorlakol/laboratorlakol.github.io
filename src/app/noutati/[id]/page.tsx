import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { getSiteSettings } from "@/lib/cms";
import { PostContent } from "@/components/forum/post-content";

export const revalidate = 60;

const CATEGORY_LABEL: Record<string, string> = {
  UPDATES: "Updates",
  EVENTS: "Events",
  ANNOUNCEMENTS: "Announcements",
  DEVELOPMENT_LOGS: "Development Logs",
};

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [post, settings] = await Promise.all([
    prisma.newsPost.findUnique({ where: { id } }),
    getSiteSettings(),
  ]);

  if (!post || !post.published) notFound();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-void px-6 pt-32 pb-24">
        <div className="mx-auto max-w-2xl">
          <Link href="/noutati" className="text-xs text-ink-faint hover:text-signal font-mono">
            ← Noutăți
          </Link>

          <span className="block mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-signal">
            {CATEGORY_LABEL[post.category] ?? post.category}
          </span>
          <h1 className="font-display uppercase text-3xl mt-2">{post.title}</h1>
          <p className="mt-2 text-xs text-ink-faint font-mono">
            {new Date(post.createdAt).toLocaleDateString("ro-RO")}
          </p>

          <div className="mt-8">
            <PostContent content={post.content} />
          </div>
        </div>
      </main>
      <Footer discordUrl={settings.discordInviteUrl} />
    </>
  );
}
