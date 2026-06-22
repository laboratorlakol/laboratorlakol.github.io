"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? data.issues?.[0]?.message ?? "A apărut o eroare.");
        return;
      }

      setDone(true);
    } catch {
      setError("Nu am putut contacta serverul. Încearcă din nou.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <AuthLayout title="Cont creat">
        <div className="text-center">
          <CheckCircle2 className="mx-auto text-signal" size={40} />
          <p className="mt-4 text-sm text-ink-muted">
            Ți-am trimis un email de confirmare la <strong className="text-ink">{form.email}</strong>.
            Confirmă-l ca să-ți activezi complet contul.
          </p>
          <Button variant="primary" className="mt-6 w-full" asChild>
            <Link href="/login">Mergi la conectare</Link>
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Creează Cont"
      subtitle="Înregistrare gratuită — accesezi forumul imediat ce confirmi emailul."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="font-mono text-xs uppercase tracking-wider text-ink-faint">
            Username
          </label>
          <Input
            className="mt-1.5"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            placeholder="numele_tau"
            autoComplete="username"
            required
          />
        </div>

        <div>
          <label className="font-mono text-xs uppercase tracking-wider text-ink-faint">
            Email
          </label>
          <Input
            className="mt-1.5"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="tu@exemplu.com"
            autoComplete="email"
            required
          />
        </div>

        <div>
          <label className="font-mono text-xs uppercase tracking-wider text-ink-faint">
            Parolă
          </label>
          <Input
            className="mt-1.5"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Minimum 8 caractere"
            autoComplete="new-password"
            required
          />
          <p className="mt-1.5 text-xs text-ink-faint">
            Minimum 8 caractere, o literă mare și o cifră.
          </p>
        </div>

        {error && (
          <p className="text-sm text-red-400 bg-red-950/30 border border-red-900/40 rounded-md px-3 py-2">
            {error}
          </p>
        )}

        <Button type="submit" variant="primary" className="w-full" disabled={loading}>
          {loading && <Loader2 className="animate-spin" size={16} />}
          Creează cont
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-faint">
        Ai deja cont?{" "}
        <Link href="/login" className="text-signal hover:underline">
          Conectează-te
        </Link>
      </p>
    </AuthLayout>
  );
}
