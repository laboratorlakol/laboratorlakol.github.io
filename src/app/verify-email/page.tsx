"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

function VerifyEmailContent() {
  const params = useSearchParams();
  const token = params.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  useEffect(() => {
    async function run() {
      if (!token) {
        setStatus("error");
        return;
      }
      try {
        const res = await fetch(
          `/api/auth/verify-email?token=${encodeURIComponent(token)}`
        );
        setStatus(res.ok ? "success" : "error");
      } catch {
        setStatus("error");
      }
    }
    run();
  }, [token]);

  return (
    <AuthLayout title="Confirmare email">
      <div className="text-center">
        {status === "loading" && (
          <>
            <Loader2 className="mx-auto animate-spin text-signal" size={32} />
            <p className="mt-4 text-sm text-ink-muted">Se confirmă emailul...</p>
          </>
        )}
        {status === "success" && (
          <>
            <CheckCircle2 className="mx-auto text-signal" size={40} />
            <p className="mt-4 text-sm text-ink-muted">
              Emailul a fost confirmat. Contul tău este activ complet.
            </p>
            <Button variant="primary" className="mt-6 w-full" asChild>
              <Link href="/login">Conectează-te</Link>
            </Button>
          </>
        )}
        {status === "error" && (
          <>
            <XCircle className="mx-auto text-red-400" size={40} />
            <p className="mt-4 text-sm text-ink-muted">
              Linkul de confirmare este invalid sau a expirat.
            </p>
            <Button variant="outline" className="mt-6 w-full" asChild>
              <Link href="/login">Înapoi la conectare</Link>
            </Button>
          </>
        )}
      </div>
    </AuthLayout>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailContent />
    </Suspense>
  );
}
