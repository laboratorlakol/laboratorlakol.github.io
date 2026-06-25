"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";

const REACTIONS: { type: "LIKE" | "LOVE" | "LAUGH" | "DISLIKE"; emoji: string; label: string }[] = [
  { type: "LIKE", emoji: "👍", label: "Apreciază" },
  { type: "LOVE", emoji: "❤️", label: "Iubesc" },
  { type: "LAUGH", emoji: "😂", label: "Haios" },
  { type: "DISLIKE", emoji: "👎", label: "Nu apreciază" },
];

export function PostReactions({
  postId,
  counts,
  myReaction,
}: {
  postId: string;
  counts: Partial<Record<string, number>>;
  myReaction: string | null;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function react(type: string) {
    if (!user || busy) return;
    setBusy(true);
    try {
      await fetch(`/api/forum/posts/${postId}/reactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: myReaction === type ? null : type }),
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-1.5 mt-3">
      {REACTIONS.map((r) => {
        const count = counts[r.type] ?? 0;
        const active = myReaction === r.type;
        return (
          <button
            key={r.type}
            onClick={() => react(r.type)}
            disabled={!user || busy}
            title={r.label}
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs border transition-colors ${
              active
                ? "border-signal bg-signal/10 text-signal"
                : "border-line text-ink-faint hover:text-ink hover:border-line-strong"
            } ${!user ? "cursor-not-allowed opacity-60" : ""}`}
          >
            <span>{r.emoji}</span>
            {count > 0 && <span className="font-mono">{count}</span>}
          </button>
        );
      })}
    </div>
  );
}
