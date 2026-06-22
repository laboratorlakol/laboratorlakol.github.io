"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-context";
import { Navbar } from "@/components/sections/navbar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function NewTopicPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
  }, [authLoading, user, router]);

  useEffect(() => {
    fetch(`/api/forum/categories/${params.slug}`)
      .then((r) => r.json())
      .then((data) => setCategoryId(data.category?.id ?? null))
      .catch(() => null);
  }, [params.slug]);

  if (authLoading || !user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-void">
        <Loader2 className="animate-spin text-signal" size={32} />
      </main>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!categoryId) return;
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/forum/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryId, title, content }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "Nu am putut crea topicul.");
        return;
      }
      router.push(`/forum/${params.slug}/${data.topic.id}`);
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
          <Link
            href={`/forum/${params.slug}`}
            className="text-xs text-ink-faint hover:text-signal font-mono"
          >
            ← Înapoi
          </Link>

          <h1 className="font-display uppercase text-2xl mt-3">Topic nou</h1>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Input
              placeholder="Titlu"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <Textarea
              placeholder="Scrie mesajul tău..."
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
            {error && (
              <p className="text-sm text-red-400 bg-red-950/30 border border-red-900/40 rounded-md px-3 py-2">
                {error}
              </p>
            )}
            <Button type="submit" variant="primary" disabled={submitting || !categoryId}>
              {submitting && <Loader2 className="animate-spin" size={16} />}
              Postează topic
            </Button>
          </form>
        </div>
      </main>
    </>
  );
}
