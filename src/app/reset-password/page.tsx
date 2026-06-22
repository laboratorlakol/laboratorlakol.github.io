"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2 } from "lucide-react";

function ResetPasswordContent() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? "Linkul este invalid sau a expirat.");
        return;
      }
      setDone(true);
    } catch {
      setError("Nu am putut contacta serverul.");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <AuthLayout title="Link invalid">
        <p className="text-center text-sm text-ink-muted">
          Acest link de resetare este invalid. Cere unul nou din pagina de
          conectare.
        </p>
        <Button variant="outline" className="mt-6 w-full" asChild>
          <Link href="/forgot-password">Cere link nou</Link>
        </Button>
      </AuthLayout>
    );
  }

  if (done) {
    return (
      <AuthLayout title="Parolă schimbată">
        <div className="text-center">
          <CheckCircle2 className="mx-auto text-signal" size={40} />
          <p className="mt-4 text-sm text-ink-muted">
            Parola a fost schimbată. Te poți conecta cu noua parolă.
          </p>
          <Button
            variant="primary"
            className="mt-6 w-full"
            onClick={() => router.push("/login")}
          >
            Conectează-te
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Setează o parolă nouă">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Minimum 8 caractere"
          autoComplete="new-password"
          required
        />
        {error && (
          <p className="text-sm text-red-400 bg-red-950/30 border border-red-900/40 rounded-md px-3 py-2">
            {error}
          </p>
        )}
        <Button type="submit" variant="primary" className="w-full" disabled={loading}>
          {loading && <Loader2 className="animate-spin" size={16} />}
          Salvează parola nouă
        </Button>
      </form>
    </AuthLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordContent />
    </Suspense>
  );
}
