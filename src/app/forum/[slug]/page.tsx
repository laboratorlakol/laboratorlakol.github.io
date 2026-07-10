import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { getSiteSettings } from "@/lib/cms";
import { Pin, Lock, MessageCircle } from "lucide-react";
import { NewTopicButton } from "@/components/forum/new-topic-button";
export const revalidate = 30;
export default async function ForumCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [category, settings] = await Promise.all([prisma.forumCategory.findUnique({ where:{ slug } }), getSiteSettings()]);
  if (!category) notFound();
  const topics = await prisma.forumTopic.findMany({ where:{ categoryId:category.id }, orderBy:[{pinned:"desc"},{updatedAt:"desc"}], include:{ author:{select:{username:true}}, _count:{select:{posts:true}} } });
  return (
    <>
      <Navbar/>
      <main className="min-h-screen bg-void px-6 pt-32 pb-24">
        <div className="mx-auto max-w-4xl">
          <Link href="/forum" className="text-xs text-ink-faint hover:text-signal font-mono">← Forum</Link>
          <div className="mt-3 flex items-end justify-between flex-wrap gap-4">
            <div>
              <h1 className="font-display uppercase text-3xl">{category.name}</h1>
              {category.description&&<p className="mt-1 text-sm text-ink-faint">{category.description}</p>}
            </div>
            <NewTopicButton categoryId={category.id} categorySlug={category.slug}/>
          </div>
          <div className="mt-8 panel rounded-md divide-y divide-line">
            {topics.length===0&&<p className="px-5 py-8 text-center text-sm text-ink-faint">Niciun topic încă. Fii primul care postează.</p>}
            {topics.map(topic=>(
              <Link key={topic.id} href={`/forum/${category.slug}/${topic.id}`} className="flex items-center justify-between px-5 py-4 hover:bg-panel-raised transition-colors">
                <div className="flex items-center gap-2.5 min-w-0">
                  {topic.pinned&&<Pin size={14} className="text-signal shrink-0"/>}
                  {topic.locked&&<Lock size={14} className="text-ink-faint shrink-0"/>}
                  <div className="min-w-0">
                    <h2 className="font-medium truncate">{topic.title}</h2>
                    <p className="text-xs text-ink-faint mt-0.5">{topic.author?.username??"utilizator șters"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 ml-4 text-ink-faint"><MessageCircle size={14}/><span className="font-mono text-sm">{topic._count.posts}</span></div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer discordUrl={settings.discordInviteUrl}/>
    </>
  );
}
