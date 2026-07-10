import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { getSiteSettings } from "@/lib/cms";
import { ROLE_LABELS } from "@/lib/auth/rbac";
import { Role } from "@prisma/client";
import { Pin, Lock } from "lucide-react";
import { TopicModerationBar } from "@/components/forum/topic-moderation-bar";
import { ReplyBox } from "@/components/forum/reply-box";
import { PostActions } from "@/components/forum/post-actions";
import { PostContent } from "@/components/forum/post-content";
export const revalidate = 15;
export default async function TopicPage({ params }: { params: Promise<{ slug: string; topicId: string }> }) {
  const { slug, topicId } = await params;
  const [topic, settings] = await Promise.all([
    prisma.forumTopic.findUnique({ where:{id:topicId}, include:{ category:true, posts:{ orderBy:{createdAt:"asc"}, include:{author:{select:{id:true,username:true,role:true}}} } } }),
    getSiteSettings(),
  ]);
  if (!topic||topic.category.slug!==slug) notFound();
  return (
    <>
      <Navbar/>
      <main className="min-h-screen bg-void px-6 pt-32 pb-24">
        <div className="mx-auto max-w-3xl">
          <Link href={`/forum/${slug}`} className="text-xs text-ink-faint hover:text-signal font-mono">← {topic.category.name}</Link>
          <div className="mt-3 flex items-center gap-2.5">
            {topic.pinned&&<Pin size={16} className="text-signal"/>}
            {topic.locked&&<Lock size={16} className="text-ink-faint"/>}
            <h1 className="font-display uppercase text-2xl">{topic.title}</h1>
          </div>
          <div className="mt-6"><TopicModerationBar topicId={topic.id} pinned={topic.pinned} locked={topic.locked}/></div>
          <div className="space-y-4">
            {topic.posts.map(post=>(
              <div key={post.id} className="panel rounded-md p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{post.author?.username??"utilizator șters"}</span>
                    {post.author&&<span className="font-mono text-[10px] uppercase tracking-wider text-signal">{ROLE_LABELS[post.author.role as Role]}</span>}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-ink-faint font-mono">{new Date(post.createdAt).toLocaleString("ro-RO")}</span>
                    {!post.isFirstPost&&<PostActions postId={post.id} authorId={post.authorId}/>}
                  </div>
                </div>
                <div className="mt-3"><PostContent content={post.content}/></div>
              </div>
            ))}
          </div>
          <div className="mt-6"><ReplyBox topicId={topic.id}/></div>
        </div>
      </main>
      <Footer discordUrl={settings.discordInviteUrl}/>
    </>
  );
}
