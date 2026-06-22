"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-context";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Gamepad2, AlertTriangle, CheckCircle2 } from "lucide-react";

function FivemLinkCard() {
  const { user, refresh } = useAuth();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  if (user.citizenId) {
    return (
      <div className="panel rounded-md p-6">
        <h3 className="font-mono text-xs uppercase tracking-wider text-ink-faint">
          Personaj FiveM
        </h3>
        <div className="mt-4 flex flex-col items-center justify-center text-center gap-3 py-4">
          <CheckCircle2 className="text-signal" size={28} />
          <div>
            <p className="text-sm text-ink">
              {user.characterName ?? "Personaj conectat"}
            </p>
            <p className="mt-1 font-mono text-xs text-ink-faint">
              {user.citizenId}
            </p>
          </div>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/fivem/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? "Cod invalid.");
        return;
      }

      await refresh();
    } catch {
      setError("Nu am putut contacta serverul.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="panel rounded-md p-6 flex flex-col">
      <h3 className="font-mono text-xs uppercase tracking-wider text-ink-faint">
        Personaj FiveM
      </h3>
      <div className="mt-4 flex flex-col items-center text-center gap-2 py-2">
        <Gamepad2 className="text-ink-faint" size={26} />
        <p className="text-sm text-ink-muted">
          Scrie <code className="text-signal">/codsite</code> în joc pentru a
          primi un cod, apoi introdu-l aici.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="mt-2 space-y-2.5">
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="FADED-XXXX-XXXX"
          className="text-center font-mono uppercase"
          maxLength={15}
          required
        />
        {error && (
          <p className="text-xs text-red-400 bg-red-950/30 border border-red-900/40 rounded-md px-3 py-2">
            {error}
          </p>
        )}
        <Button type="submit" variant="primary" size="sm" className="w-full" disabled={loading}>
          {loading && <Loader2 className="animate-spin" size={14} />}
          Conectează personajul
        </Button>
      </form>
    </div>
  );
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

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

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-void px-6 pt-32 pb-24">
        <div className="mx-auto max-w-3xl">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-signal">
            Contul meu
          </span>
          <h1 className="font-display uppercase text-3xl mt-3">
            Salut, {user.username}
          </h1>

          {!user.emailVerified && (
            <div className="mt-6 flex items-start gap-3 panel border-glow rounded-md p-4">
              <AlertTriangle className="text-signal shrink-0 mt-0.5" size={18} />
              <p className="text-sm text-ink-muted">
                Emailul tău nu este confirmat încă. Verifică-ți inboxul sau{" "}
                <Link href="/forgot-password" className="text-signal hover:underline">
                  cere un link nou
                </Link>
                .
              </p>
            </div>
          )}

          <div className="mt-8 grid sm:grid-cols-2 gap-5">
            <div className="panel rounded-md p-6">
              <h3 className="font-mono text-xs uppercase tracking-wider text-ink-faint">
                Cont
              </h3>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-ink-faint">Username</dt>
                  <dd>{user.username}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-faint">Email</dt>
                  <dd className="truncate ml-4">{user.email}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-faint">Rol</dt>
                  <dd className="text-signal">{user.role}</dd>
                </div>
              </dl>
            </div>

            <FivemLinkCard />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
