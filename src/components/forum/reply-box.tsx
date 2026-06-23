"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-context";
import { MarkdownEditor } from "@/components/forum/markdown-editor";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function ReplyBox({ topicId }: { topicId: string }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (loading) return null;

  if (!user) {
    return (
      <div className="panel rounded-md p-5 text-center">
        <p className="text-sm text-ink-muted">
          <Link href="/login" className="text-signal hover:underline">
            Conectează-te
          </Link>{" "}
          pentru a răspunde în acest topic.
        </p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) {
      setError("Scrie un mesaj înainte de a trimite.");
      return;
    }
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch(`/api/forum/topics/${topicId}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "Nu am putut posta răspunsul.");
        return;
      }
      setContent("");
      router.refresh();
    } catch {
      setError("Nu am putut contacta serverul.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="panel rounded-md p-5 space-y-3">
      <MarkdownEditor
        value={content}
        onChange={setContent}
        placeholder="Scrie un răspuns..."
        minRows={4}
      />
      {error && (
        <p className="text-sm text-red-400 bg-red-950/30 border border-red-900/40 rounded-md px-3 py-2">
          {error}
        </p>
      )}
      <Button type="submit" variant="primary" size="sm" disabled={submitting}>
        {submitting && <Loader2 className="animate-spin" size={14} />}
        Răspunde
      </Button>
    </form>
  );
}
