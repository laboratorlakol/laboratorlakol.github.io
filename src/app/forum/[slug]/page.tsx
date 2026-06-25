import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { getSiteSettings } from "@/lib/cms";
import { Pin, Lock, MessageCircle, Tag as TagIcon, X } from "lucide-react";
import { NewTopicButton } from "@/components/forum/new-topic-button";

export const dynamic = "force-dynamic";

export default async function ForumCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ tag?: string }>;
}) {
  const { slug } = await params;
  const { tag: activeTagSlug } = await searchParams;

  const [category, settings] = await Promise.all([
    prisma.forumCategory.findUnique({ where: { slug } }),
    getSiteSettings(),
  ]);

  if (!category) notFound();

  const [topics, categoryTags] = await Promise.all([
    prisma.forumTopic.findMany({
      where: {
        categoryId: category.id,
        ...(activeTagSlug ? { tags: { some: { slug: activeTagSlug } } } : {}),
      },
      orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }],
      include: {
        author: { select: { username: true } },
        tags: true,
        _count: { select: { posts: true } },
      },
    }),
    prisma.tag.findMany({
      where: { topics: { some: { categoryId: category.id } } },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-void px-6 pt-32 pb-24">
        <div className="mx-auto max-w-4xl">
          <Link href="/forum" className="text-xs text-ink-faint hover:text-signal font-mono">
            ← Forum
          </Link>

          <div className="mt-3 flex items-end justify-between flex-wrap gap-4">
            <div>
              <h1 className="font-display uppercase text-3xl">{category.name}</h1>
              {category.description && (
                <p className="mt-1 text-sm text-ink-faint">{category.description}</p>
              )}
            </div>
            <NewTopicButton categoryId={category.id} categorySlug={category.slug} />
          </div>

          {categoryTags.length > 0 && (
            <div className="mt-5 flex items-center gap-2 flex-wrap">
              {categoryTags.map((tag) => {
                const active = tag.slug === activeTagSlug;
                return (
                  <Link
                    key={tag.id}
                    href={active ? `/forum/${slug}` : `/forum/${slug}?tag=${tag.slug}`}
                    className={`inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider rounded-full px-2.5 py-1 border transition-colors ${
                      active
                        ? "border-signal bg-signal/10 text-signal"
                        : "border-line text-ink-faint hover:border-line-strong hover:text-ink"
                    }`}
                  >
                    {active ? <X size={10} /> : <TagIcon size={10} />}
                    {tag.name}
                  </Link>
                );
              })}
            </div>
          )}

          <div className="mt-6 panel rounded-md divide-y divide-line">
            {topics.length === 0 && (
              <p className="px-5 py-8 text-center text-sm text-ink-faint">
                {activeTagSlug ? "Niciun topic cu acest tag." : "Niciun topic încă. Fii primul care postează."}
              </p>
            )}
            {topics.map((topic) => (
              <Link
                key={topic.id}
                href={`/forum/${category.slug}/${topic.id}`}
                className="flex items-center justify-between px-5 py-4 hover:bg-panel-raised transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {topic.pinned && <Pin size={14} className="text-signal shrink-0" />}
                  {topic.locked && <Lock size={14} className="text-ink-faint shrink-0" />}
                  <div className="min-w-0">
                    <h2 className="font-medium truncate">{topic.title}</h2>
                    <p className="text-xs text-ink-faint mt-0.5">
                      {topic.author?.username ?? "utilizator șters"}
                      {topic.tags.length > 0 && (
                        <span className="ml-2 text-signal">
                          {topic.tags.map((t) => `#${t.name}`).join(" ")}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 ml-4 text-ink-faint">
                  <MessageCircle size={14} />
                  <span className="font-mono text-sm">{topic._count.posts}</span>
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
