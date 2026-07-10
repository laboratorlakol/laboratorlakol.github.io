"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { Button } from "@/components/ui/button";
import { Pin, PinOff, Lock, Unlock, Trash2, Loader2 } from "lucide-react";
const PANEL_ROLES = ["COMMUNITY_MANAGER","CO_FOUNDER","FOUNDER"];
export function TopicModerationBar({ topicId, pinned, locked }: { topicId: string; pinned: boolean; locked: boolean }) {
  const { user } = useAuth();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  if (!user || !PANEL_ROLES.includes(user.role)) return null;
  async function patch(body: Record<string,unknown>) {
    setBusy(true);
    try { await fetch(`/api/admin/forum/topics/${topicId}`, { method: "PATCH", headers: {"Content-Type":"application/json"}, body: JSON.stringify(body) }); router.refresh(); }
    finally { setBusy(false); }
  }
  async function handleDelete() {
    if (!confirm("Ștergi acest topic și toate răspunsurile?")) return;
    setBusy(true);
    try { await fetch(`/api/admin/forum/topics/${topicId}`, { method: "DELETE" }); router.push("/forum"); }
    finally { setBusy(false); }
  }
  return (
    <div className="flex items-center gap-2 panel rounded-md px-3 py-2 mb-4">
      <span className="font-mono text-[10px] uppercase tracking-wider text-ink-faint mr-1">Moderare</span>
      <Button variant="ghost" size="sm" disabled={busy} onClick={()=>patch({pinned:!pinned})}>{pinned?<PinOff size={14}/>:<Pin size={14}/>}{pinned?"Unpin":"Pin"}</Button>
      <Button variant="ghost" size="sm" disabled={busy} onClick={()=>patch({locked:!locked})}>{locked?<Unlock size={14}/>:<Lock size={14}/>}{locked?"Deblochează":"Blochează"}</Button>
      <Button variant="ghost" size="sm" disabled={busy} onClick={handleDelete}>{busy?<Loader2 className="animate-spin" size={14}/>:<Trash2 size={14} className="text-red-400"/>}Șterge</Button>
    </div>
  );
}
