"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TurnstileWidget } from "@/components/auth/turnstile-widget";
import { Loader2, MailCheck } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/auth/request-password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, turnstileToken }),
      });
      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <AuthLayout title="Verifică emailul">
        <div className="text-center">
          <MailCheck className="mx-auto text-signal" size={40} />
          <p className="mt-4 text-sm text-ink-muted">
            Dacă există un cont cu adresa <strong className="text-ink">{email}</strong>,
            vei primi un link de resetare a parolei.
          </p>
          <Button variant="outline" className="mt-6 w-full" asChild>
            <Link href="/login">Înapoi la conectare</Link>
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Ai uitat parola?"
      subtitle="Introdu emailul contului și îți trimitem un link de resetare."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@exemplu.com"
          autoComplete="email"
          required
        />
        <TurnstileWidget onVerify={setTurnstileToken} onExpire={() => setTurnstileToken(null)} />
        <Button type="submit" variant="primary" className="w-full" disabled={loading}>
          {loading && <Loader2 className="animate-spin" size={16} />}
          Trimite link de resetare
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-ink-faint">
        <Link href="/login" className="text-signal hover:underline">
          Înapoi la conectare
        </Link>
      </p>
    </AuthLayout>
  );
}
