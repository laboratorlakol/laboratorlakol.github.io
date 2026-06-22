"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { Trash2, Loader2 } from "lucide-react";

const PANEL_ROLES = ["COMMUNITY_MANAGER", "CO_FOUNDER", "FOUNDER"];

export function PostActions({
  postId,
  authorId,
}: {
  postId: string;
  authorId: string | null;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  if (!user) return null;
  const canDelete = user.id === authorId || PANEL_ROLES.includes(user.role);
  if (!canDelete) return null;

  async function handleDelete() {
    if (!confirm("Ștergi acest răspuns?")) return;
    setBusy(true);
    try {
      await fetch(`/api/forum/posts/${postId}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={busy}
      className="text-ink-faint hover:text-red-400 transition-colors disabled:opacity-50"
      aria-label="Șterge"
    >
      {busy ? <Loader2 className="animate-spin" size={14} /> : <Trash2 size={14} />}
    </button>
  );
}
