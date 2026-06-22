"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-context";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { Button } from "@/components/ui/button";
import { Loader2, Gamepad2, AlertTriangle } from "lucide-react";

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

            <div className="panel rounded-md p-6 flex flex-col">
              <h3 className="font-mono text-xs uppercase tracking-wider text-ink-faint">
                Personaj FiveM
              </h3>
              <div className="mt-4 flex-1 flex flex-col items-center justify-center text-center gap-3 py-4">
                <Gamepad2 className="text-ink-faint" size={28} />
                <p className="text-sm text-ink-muted">
                  Niciun personaj conectat încă.
                </p>
              </div>
              <Button variant="outline" size="sm" disabled className="w-full">
                Conectare personaj (în curând)
              </Button>
              <p className="mt-2 text-xs text-ink-faint text-center">
                Vine cu comanda /codsite din joc — fază următoare.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
