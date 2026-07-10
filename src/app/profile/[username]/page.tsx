"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { AvatarFrame } from "@/components/ui/avatar-frame";
import { Loader2, Calendar, Clock, MessageSquare, Wifi, Pin } from "lucide-react";

interface RecentPost {
  id: string;
  content: string;
  createdAt: string;
  topic: { id: string; title: string; category: { slug: string; name: string } };
}

interface RecentTopic {
  id: string;
  title: string;
  createdAt: string;
  category: { slug: string; name: string };
  _count: { posts: number };
}

interface Profile {
  id: string; username: string; role: string; roleLabel: string;
  createdAt: string; lastOnline: string | null;
  avatarUrl: string | null; bannerUrl: string | null; avatarFrame: string;
  playtimeHours: number; postCount: number;
  recentPosts: RecentPost[]; recentTopics: RecentTopic[];
}

const ROLE_COLORS: Record<string, string> = {
  FOUNDER: "text-signal border-signal bg-signal/10",
  CO_FOUNDER: "text-signal border-signal bg-signal/10",
  COMMUNITY_MANAGER: "text-signal-bright border-signal-bright bg-signal-bright/10",
  SUPERVISOR: "text-signal-dim border-signal-dim bg-signal-dim/10",
  ADMINISTRATOR: "text-yellow-400 border-yellow-400/50 bg-yellow-400/10",
  MODERATOR: "text-blue-400 border-blue-400/50 bg-blue-400/10",
  HELPER: "text-purple-400 border-purple-400/50 bg-purple-400/10",
  MEMBER: "text-ink-faint border-line bg-panel",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("ro-RO", { day: "numeric", month: "long", year: "numeric" });
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 2) return "Chiar acum";
  if (mins < 60) return `${mins} min. în urmă`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h în urmă`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} zile în urmă`;
  return formatDate(dateStr);
}

function stripMarkdown(text: string) {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/~~(.+?)~~/g, "$1")
    .replace(/`(.+?)`/g, "$1")
    .replace(/^>+\s*/gm, "")
    .replace(/^#+\s*/gm, "")
    .slice(0, 180);
}

export default function ProfilePage() {
  const params = useParams<{ username: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [mountTime] = useState(() => Date.now());
  const [activeTab, setActiveTab] = useState<"topics" | "posts">("topics");

  useEffect(() => {
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/profile/${encodeURIComponent(params.username)}`);
        if (res.status === 404) { setNotFound(true); return; }
        const data = await res.json();
        setProfile(data.profile);
      } catch { setNotFound(true); }
      finally { setLoading(false); }
    }, 0);
    return () => clearTimeout(t);
  }, [params.username]);

  if (loading) return <main className="min-h-screen flex items-center justify-center bg-void"><Loader2 className="animate-spin text-signal" size={32} /></main>;

  if (notFound || !profile) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center bg-void text-center px-6">
          <div>
            <h1 className="font-display uppercase text-3xl">Profil negăsit</h1>
            <p className="mt-3 text-ink-faint">Nu există niciun utilizator cu username-ul <span className="text-signal">{params.username}</span>.</p>
            <Link href="/" className="mt-6 inline-block text-signal hover:underline font-mono text-sm">← Înapoi acasă</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const roleColor = ROLE_COLORS[profile.role] ?? ROLE_COLORS.MEMBER;
  const isOnline = profile.lastOnline && mountTime - new Date(profile.lastOnline).getTime() < 5 * 60 * 1000;
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-void px-4 sm:px-6 pt-24 pb-16">
        <div className="mx-auto max-w-4xl">

          {/* Profile card */}
          <div className="rounded-xl overflow-hidden border border-line shadow-[0_0_40px_-8px_rgba(0,0,0,0.8)]">

            {/* Banner */}
            <div className="relative h-44 sm:h-56 bg-panel overflow-hidden">
              {profile.bannerUrl ? (
                <Image src={profile.bannerUrl} alt="Banner" fill className="object-cover" />
              ) : (
                <>
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(78,255,58,0.25),transparent_55%)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(78,255,58,0.12),transparent_55%)]" />
                  <div className="absolute inset-0" style={{backgroundImage: "repeating-linear-gradient(45deg, rgba(78,255,58,0.03) 0px, rgba(78,255,58,0.03) 1px, transparent 1px, transparent 12px)"}} />
                </>
              )}
              {/* Gradient fade to card body */}
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-[#0f0f0f]" />
            </div>

            {/* Profile header */}
            <div className="bg-[#0f0f0f] px-6 pb-6">
              <div className="flex items-end justify-between gap-4 -mt-12">
                <div className="relative">
                  <AvatarFrame
                    src={profile.avatarUrl}
                    username={profile.username}
                    size={88}
                    frame={profile.avatarFrame}
                  />
                  {isOnline && (
                    <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-signal border-2 border-[#0f0f0f] z-10" />
                  )}
                </div>
              </div>

              <div className="mt-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="font-display uppercase text-2xl sm:text-3xl leading-none">{profile.username}</h1>
                  <span className={`font-mono text-[11px] uppercase tracking-wider border rounded-full px-3 py-0.5 ${roleColor}`}>
                    {profile.roleLabel}
                  </span>
                  {!isOnline && profile.lastOnline && (
                    <span className="font-mono text-[10px] text-ink-faint">
                      Online {timeAgo(profile.lastOnline)}
                    </span>
                  )}
                </div>
              </div>

              {/* Stats row */}
              <div className="mt-5 flex flex-wrap gap-6 border-t border-line/50 pt-5">
                <div className="text-center">
                  <div className="font-mono text-lg text-signal font-semibold">{profile.postCount}</div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-ink-faint flex items-center gap-1 mt-0.5"><MessageSquare size={10} />Postări</div>
                </div>
                <div>
                  <div className="font-mono text-sm text-ink-muted">{formatDate(profile.createdAt)}</div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-ink-faint flex items-center gap-1 mt-0.5"><Calendar size={10} />Înregistrat</div>
                </div>
                <div>
                  <div className="font-mono text-sm text-ink-muted">{profile.lastOnline ? timeAgo(profile.lastOnline) : "—"}</div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-ink-faint flex items-center gap-1 mt-0.5"><Wifi size={10} />Ultima vizită</div>
                </div>
                <div>
                  <div className="font-mono text-lg text-signal font-semibold">{profile.playtimeHours}h</div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-ink-faint flex items-center gap-1 mt-0.5"><Clock size={10} />Ore jucate</div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity section */}
          <div className="mt-6">
            <div className="flex items-center gap-1 mb-4 border-b border-line">
              <button
                onClick={() => setActiveTab("topics")}
                className={`px-4 py-2.5 font-mono text-xs uppercase tracking-wider transition-colors border-b-2 -mb-px ${activeTab === "topics" ? "border-signal text-signal" : "border-transparent text-ink-faint hover:text-ink"}`}
              >
                Topicuri ({profile.recentTopics.length})
              </button>
              <button
                onClick={() => setActiveTab("posts")}
                className={`px-4 py-2.5 font-mono text-xs uppercase tracking-wider transition-colors border-b-2 -mb-px ${activeTab === "posts" ? "border-signal text-signal" : "border-transparent text-ink-faint hover:text-ink"}`}
              >
                Răspunsuri ({profile.recentPosts.length})
              </button>
            </div>

            {activeTab === "topics" && (
              <div className="space-y-2">
                {profile.recentTopics.length === 0 && (
                  <p className="text-center py-8 text-ink-faint text-sm">Niciun topic creat încă.</p>
                )}
                {profile.recentTopics.map(topic => (
                  <Link
                    key={topic.id}
                    href={`/forum/${topic.category.slug}/${topic.id}`}
                    className="flex items-start justify-between gap-4 panel rounded-md px-4 py-3.5 hover:border-line-strong transition-colors group"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Pin size={12} className="text-signal shrink-0" />
                        <span className="font-medium text-sm group-hover:text-signal transition-colors truncate">{topic.title}</span>
                      </div>
                      <p className="text-xs text-ink-faint mt-1">{topic.category.name} · {topic._count.posts - 1} răspunsuri</p>
                    </div>
                    <span className="font-mono text-[10px] text-ink-faint shrink-0">{timeAgo(topic.createdAt)}</span>
                  </Link>
                ))}
              </div>
            )}

            {activeTab === "posts" && (
              <div className="space-y-2">
                {profile.recentPosts.length === 0 && (
                  <p className="text-center py-8 text-ink-faint text-sm">Niciun răspuns dat încă.</p>
                )}
                {profile.recentPosts.map(post => (
                  <Link
                    key={post.id}
                    href={`/forum/${post.topic.category.slug}/${post.topic.id}`}
                    className="block panel rounded-md px-4 py-3.5 hover:border-line-strong transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span className="font-medium text-sm group-hover:text-signal transition-colors truncate">{post.topic.title}</span>
                      <span className="font-mono text-[10px] text-ink-faint shrink-0">{timeAgo(post.createdAt)}</span>
                    </div>
                    <p className="mt-1 text-xs text-ink-faint line-clamp-2">{stripMarkdown(post.content)}</p>
                    <p className="mt-1 font-mono text-[10px] text-signal">{post.topic.category.name}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
