"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { Loader2, Calendar, Clock, MessageSquare, Wifi } from "lucide-react";

interface Profile {
  id: string;
  username: string;
  role: string;
  roleLabel: string;
  createdAt: string;
  lastOnline: string | null;
  avatarUrl: string | null;
  bannerUrl: string | null;
  playtimeHours: number;
  postCount: number;
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

function initials(name: string) {
  return name.split(" ").filter(Boolean).map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("ro-RO", {
    day: "numeric", month: "long", year: "numeric",
  });
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

export default function ProfilePage() {
  const params = useParams<{ username: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [mountTime] = useState(() => Date.now());

  useEffect(() => {
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/profile/${encodeURIComponent(params.username)}`);
        if (res.status === 404) { setNotFound(true); return; }
        const data = await res.json();
        setProfile(data.profile);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }, 0);
    return () => clearTimeout(t);
  }, [params.username]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-void">
        <Loader2 className="animate-spin text-signal" size={32} />
      </main>
    );
  }

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

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-void pb-24">
        {/* Banner */}
        <div className="relative w-full h-48 sm:h-64 bg-panel overflow-hidden">
          {profile.bannerUrl ? (
            <Image src={profile.bannerUrl} alt="Banner" fill className="object-cover" />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(78,255,58,0.18),transparent_60%)]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-void/90" />
        </div>

        <div className="mx-auto max-w-3xl px-6">
          {/* Avatar + name row */}
          <div className="relative -mt-16 flex items-end gap-5">
            <div className="relative shrink-0">
              {profile.avatarUrl ? (
                <Image
                  src={profile.avatarUrl}
                  alt={profile.username}
                  width={96}
                  height={96}
                  className="w-24 h-24 rounded-full object-cover border-4 border-void shadow-[0_0_0_2px_var(--line)]"
                />
              ) : (
                <div className="w-24 h-24 rounded-full border-4 border-void shadow-[0_0_0_2px_var(--line)] bg-panel flex items-center justify-center font-display text-3xl text-signal">
                  {initials(profile.username)}
                </div>
              )}
              {/* Online indicator */}
              {profile.lastOnline && mountTime - new Date(profile.lastOnline).getTime() < 5 * 60 * 1000 && (
                <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-signal border-2 border-void" />
              )}
            </div>

            <div className="pb-2 min-w-0">
              <h1 className="font-display uppercase text-2xl sm:text-3xl leading-none truncate">
                {profile.username}
              </h1>
              <span className={`inline-block mt-2 font-mono text-[11px] uppercase tracking-wider border rounded-full px-3 py-0.5 ${roleColor}`}>
                {profile.roleLabel}
              </span>
            </div>
          </div>

          {/* Stats bar */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="panel rounded-md px-4 py-3 flex flex-col items-center text-center">
              <MessageSquare size={16} className="text-signal mb-1.5" />
              <span className="font-mono text-xl text-signal font-semibold">{profile.postCount}</span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-ink-faint mt-0.5">Postări</span>
            </div>
            <div className="panel rounded-md px-4 py-3 flex flex-col items-center text-center">
              <Calendar size={16} className="text-signal mb-1.5" />
              <span className="font-mono text-xs text-ink-muted">{formatDate(profile.createdAt)}</span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-ink-faint mt-0.5">Înregistrat</span>
            </div>
            <div className="panel rounded-md px-4 py-3 flex flex-col items-center text-center">
              <Wifi size={16} className="text-signal mb-1.5" />
              <span className="font-mono text-xs text-ink-muted">
                {profile.lastOnline ? timeAgo(profile.lastOnline) : "Necunoscut"}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-ink-faint mt-0.5">Ultima vizită</span>
            </div>
            <div className="panel rounded-md px-4 py-3 flex flex-col items-center text-center">
              <Clock size={16} className="text-signal mb-1.5" />
              <span className="font-mono text-xl text-signal font-semibold">{profile.playtimeHours}h</span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-ink-faint mt-0.5">Ore jucate</span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
