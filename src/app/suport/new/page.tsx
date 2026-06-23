"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-context";
import { Navbar } from "@/components/sections/navbar";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { MarkdownEditor } from "@/components/forum/markdown-editor";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const CATEGORIES = [
  { value: "REPORT_PLAYER", label: "Raportare Jucător" },
  { value: "REPORT_STAFF", label: "Raportare Membru Staff" },
  { value: "SANCTION_APPEAL", label: "Contestare Sancțiune" },
  { value: "CONTACT_FOUNDER", label: "Contact Fondator" },
];

export default function NewTicketPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("REPORT_PLAYER");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
  }, [authLoading, user, router]);

  if (authLoading || !user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-void">
        <Loader2 className="animate-spin text-signal" size={32} />
      </main>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) {
      setError("Descrie problema înainte de a trimite.");
      return;
    }
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, category, content }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "Nu am putut crea ticketul.");
        return;
      }
      router.push(`/suport/${data.ticket.id}`);
    } catch {
      setError("Nu am putut contacta serverul.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-void px-6 pt-32 pb-24">
        <div className="mx-auto max-w-2xl">
          <Link href="/suport" className="text-xs text-ink-faint hover:text-signal font-mono">
            ← Ticketele mele
          </Link>

          <h1 className="font-display uppercase text-2xl mt-3">Ticket nou</h1>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid sm:grid-cols-[1fr_200px] gap-3">
              <Input
                placeholder="Subiect"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
              <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </Select>
            </div>

            <MarkdownEditor
              value={content}
              onChange={setContent}
              placeholder="Descrie cât mai detaliat problema sau cererea ta..."
              minRows={8}
            />

            {error && (
              <p className="text-sm text-red-400 bg-red-950/30 border border-red-900/40 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting && <Loader2 className="animate-spin" size={16} />}
              Trimite ticket
            </Button>
          </form>
        </div>
      </main>
    </>
  );
}
