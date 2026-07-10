"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-context";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, User, Gamepad2, ShieldCheck, Eye, EyeOff, AlertTriangle, Clock, ExternalLink } from "lucide-react";
import { ROLE_LABELS } from "@/lib/auth/rbac";
import { Role } from "@prisma/client";

function EmailReveal({ email }: { email: string }) {
  const [revealed, setRevealed] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-ink-faint font-mono">
        {revealed ? email : email.replace(/(?<=.{2}).(?=.*@)/g, "•").replace(/(?<=@.{2}).(?=.*\.)/g, "•")}
      </span>
      <button
        onClick={() => { if (revealed) { setRevealed(false); } else { setShowWarning(true); } }}
        className="text-ink-faint hover:text-signal transition-colors"
        aria-label={revealed ? "Ascunde emailul" : "Arată emailul"}
      >
        {revealed ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>

      {showWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-void/80 backdrop-blur-sm px-6">
          <div className="panel border-glow rounded-md p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="text-signal shrink-0" size={22} />
              <h3 className="font-display uppercase text-lg">Atenție</h3>
            </div>
            <p className="text-sm text-ink-muted leading-relaxed">
              Ești pe cale să îți afișezi adresa de email. Asigură-te că nu există nimeni în jur care să o poată vedea.
            </p>
            <div className="mt-5 flex gap-3">
              <Button variant="primary" size="sm" className="flex-1" onClick={() => { setRevealed(true); setShowWarning(false); }}>
                Arată emailul
              </Button>
              <Button variant="outline" size="sm" className="flex-1" onClick={() => setShowWarning(false)}>
                Anulează
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [linkCode, setLinkCode] = useState("");
  const [linkError, setLinkError] = useState<string | null>(null);
  const [linkSuccess, setLinkSuccess] = useState<string | null>(null);
  const [linking, setLinking] = useState(false);
  const [avatarInput, setAvatarInput] = useState("");
  const [bannerInput, setBannerInput] = useState("");
  const [frameChoice, setFrameChoice] = useState(user?.avatarFrame ?? 'circle');
  const [savingMedia, setSavingMedia] = useState(false);
  const [mediaSaved, setMediaSaved] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-void">
        <Loader2 className="animate-spin text-signal" size={32} />
      </main>
    );
  }

  async function handleLink(e: React.FormEvent) {
    e.preventDefault();
    setLinkError(null); setLinkSuccess(null); setLinking(true);
    try {
      const res = await fetch("/api/fivem/link", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: linkCode.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setLinkError(data.message ?? "Cod invalid."); return; }
      setLinkSuccess(`Personaj conectat: ${data.characterName ?? data.citizenId}`);
      setLinkCode("");
    } catch { setLinkError("Nu am putut contacta serverul."); }
    finally { setLinking(false); }
  }

  async function saveMedia(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSavingMedia(true); setMediaSaved(false);
    try {
      await fetch(`/api/users/${user.id}/media`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarUrl: avatarInput || null, bannerUrl: bannerInput || null, avatarFrame: frameChoice }),
      });
      setMediaSaved(true);
      setTimeout(() => setMediaSaved(false), 3000);
    } finally { setSavingMedia(false); }
  }

  const playtimeHours = user.playtimeHours ?? 0;
  const avatarUrl = user.avatarUrl ?? null;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-void px-6 pt-32 pb-24">
        <div className="mx-auto max-w-2xl space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-signal">Dashboard</span>
              <h1 className="font-display uppercase text-3xl mt-1">Bun venit, {user.username}</h1>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/profile/${user.username}`} className="inline-flex items-center gap-1.5">
                <ExternalLink size={14} /> Profil public
              </Link>
            </Button>
          </div>

          {/* Account card */}
          <div className="panel rounded-md p-5">
            <div className="flex items-center gap-4">
              {avatarUrl ? (
                <Image src={avatarUrl} alt={user.username} width={52} height={52}
                  className="w-14 h-14 rounded-full object-cover border border-line shrink-0" />
              ) : (
                <div className="w-14 h-14 rounded-full border border-line flex items-center justify-center text-signal font-display text-xl shrink-0">
                  {user.username.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium">{user.username}</p>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-signal border border-line rounded-full px-2.5 py-0.5">
                    {ROLE_LABELS[user.role as Role] ?? user.role}
                  </span>
                </div>
                <EmailReveal email={user.email} />
              </div>
              <div className="text-right shrink-0">
                <div className="flex items-center gap-1 text-signal font-mono text-sm">
                  <Clock size={14} />{playtimeHours}h
                </div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-ink-faint">ore jucate</div>
              </div>
            </div>
            {!user.emailVerified && (
              <div className="mt-4 flex items-start gap-3 bg-signal/5 border border-line rounded-md px-3 py-2.5">
                <ShieldCheck className="text-signal shrink-0 mt-0.5" size={16} />
                <p className="text-xs text-ink-muted">Emailul tău nu este confirmat. Verifică inbox-ul.</p>
              </div>
            )}
          </div>

          {/* FiveM link card */}
          <div className="panel rounded-md p-5">
            <div className="flex items-center gap-3 mb-4">
              <Gamepad2 className="text-signal" size={22} />
              <h2 className="font-mono text-sm uppercase tracking-wider">Personaj FiveM</h2>
            </div>
            {user.citizenId ? (
              <p className="text-sm text-ink-muted">
                Conectat: <span className="text-signal">{user.characterName ?? user.citizenId}</span>
              </p>
            ) : (
              <>
                <p className="text-sm text-ink-muted mb-4">
                  Scrie <code className="text-signal font-mono">/codsite</code> în joc, copiază codul și introdu-l mai jos.
                </p>
                <form onSubmit={handleLink} className="flex gap-2">
                  <Input value={linkCode} onChange={e => setLinkCode(e.target.value)}
                    placeholder="FADED-XXXX-XXXX" className="font-mono" required />
                  <Button type="submit" variant="primary" size="sm" disabled={linking}>
                    {linking && <Loader2 className="animate-spin" size={14} />}Conectează
                  </Button>
                </form>
                {linkError && <p className="mt-2 text-sm text-red-400">{linkError}</p>}
                {linkSuccess && <p className="mt-2 text-sm text-signal">{linkSuccess}</p>}
              </>
            )}
          </div>

          {/* Avatar / Banner card */}
          <div className="panel rounded-md p-5">
            <div className="flex items-center gap-3 mb-4">
              <User className="text-signal" size={22} />
              <h2 className="font-mono text-sm uppercase tracking-wider">Personalizare profil</h2>
            </div>
            <form onSubmit={saveMedia} className="space-y-3">
              <div>
                <label className="font-mono text-xs uppercase tracking-wider text-ink-faint">
                  URL Poză de profil
                </label>
                <Input
                  className="mt-1.5"
                  value={avatarInput}
                  onChange={e => setAvatarInput(e.target.value)}
                  placeholder={avatarUrl ?? "https://i.imgur.com/..."}
                />
              </div>
              <div>
                <label className="font-mono text-xs uppercase tracking-wider text-ink-faint">
                  URL Banner profil
                </label>
                <Input
                  className="mt-1.5"
                  value={bannerInput}
                  onChange={e => setBannerInput(e.target.value)}
                  placeholder="https://i.imgur.com/..."
                />
              </div>
              <div>
                <label className="font-mono text-xs uppercase tracking-wider text-ink-faint">Ramă poză de profil</label>
                <div className="mt-2 flex gap-2 flex-wrap">
                  {(["circle", "none", "cannabis", "hexagon"] as const).map((val) => {
                    const labels: Record<string, string> = { circle: "Cerc", none: "Fără", cannabis: "Cannabis 🌿", hexagon: "Hexagon" };
                    const active = frameChoice === val;
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setFrameChoice(val)}
                        className={[
                          "px-3 py-1.5 text-xs font-mono rounded-md border transition-colors",
                          active ? "border-signal bg-signal/10 text-signal" : "border-line text-ink-faint hover:border-line-strong",
                        ].join(" ")}
                      >
                        {labels[val]}
                      </button>
                    );
                  })}
                </div>
              </div>
              {mediaSaved && (
                <p className="text-sm text-signal bg-signal/10 border border-line rounded-md px-3 py-2">
                  Profilul a fost actualizat.
                </p>
              )}
              <Button type="submit" variant="primary" size="sm" disabled={savingMedia}>
                {savingMedia && <Loader2 className="animate-spin" size={14} />}Salvează
              </Button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
