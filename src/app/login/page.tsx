"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TurnstileWidget, type TurnstileRef } from "@/components/auth/turnstile-widget";
import { useAuth } from "@/lib/auth/auth-context";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { refresh, user, loading: authLoading } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const turnstileRef = useRef<TurnstileRef>(null);

  useEffect(() => { if (!authLoading && user) router.replace("/dashboard"); }, [authLoading, user, router]);

  if (authLoading || user) return (
    <main className="min-h-screen flex items-center justify-center bg-void">
      <Loader2 className="animate-spin text-signal" size={32} />
    </main>
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, turnstileToken }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "A apărut o eroare.");
        // Reset Turnstile on error — credentials wrong, user needs to try again
        turnstileRef.current?.reset();
        setTurnstileToken(null);
        return;
      }
      await refresh();
      router.push("/dashboard");
    } catch {
      setError("Nu am putut contacta serverul.");
      turnstileRef.current?.reset();
      setTurnstileToken(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Conectează-te">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="font-mono text-xs uppercase tracking-wider text-ink-faint">Email</label>
          <Input className="mt-1.5" type="email" value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            placeholder="tu@exemplu.com" autoComplete="email" required />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label className="font-mono text-xs uppercase tracking-wider text-ink-faint">Parolă</label>
            <Link href="/forgot-password" className="text-xs text-ink-faint hover:text-signal">
              Ai uitat parola?
            </Link>
          </div>
          <Input className="mt-1.5" type="password" value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••" autoComplete="current-password" required />
        </div>

        {error && (
          <p className="text-sm text-red-400 bg-red-950/30 border border-red-900/40 rounded-md px-3 py-2">{error}</p>
        )}

        <TurnstileWidget
          ref={turnstileRef}
          onVerify={setTurnstileToken}
          onExpire={() => setTurnstileToken(null)}
        />

        <Button type="submit" variant="primary" className="w-full" disabled={loading || !turnstileToken}>
          {loading && <Loader2 className="animate-spin" size={16} />}
          Conectează-te
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-ink-faint">
        Nu ai cont? <Link href="/register" className="text-signal hover:underline">Creează unul</Link>
      </p>
    </AuthLayout>
  );
}
