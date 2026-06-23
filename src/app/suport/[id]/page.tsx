"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-context";
import { Navbar } from "@/components/sections/navbar";
import { MarkdownEditor } from "@/components/forum/markdown-editor";
import { PostContent } from "@/components/forum/post-content";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck, Lock, Unlock, UserPlus, X } from "lucide-react";

interface TicketMessage {
  id: string;
  content: string;
  isStaffReply: boolean;
  createdAt: string;
  author: { username: string; role: string } | null;
}

interface Participant {
  id: string;
  user: { id: string; username: string };
}

interface TicketData {
  id: string;
  subject: string;
  category: string;
  status: string;
  user: { username: string };
  messages: TicketMessage[];
  participants: Participant[];
}

const STATUS_LABEL: Record<string, string> = {
  OPEN: "Deschis",
  IN_PROGRESS: "În lucru",
  CLOSED: "Închis",
};

const CATEGORY_LABEL: Record<string, string> = {
  REPORT_PLAYER: "Raportare Jucător",
  REPORT_STAFF: "Raportare Membru Staff",
  SANCTION_APPEAL: "Contestare Sancțiune",
  CONTACT_FOUNDER: "Contact Fondator",
};

export default function TicketThreadPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [isStaffView, setIsStaffView] = useState(false);
  const [canManageStatus, setCanManageStatus] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [newParticipant, setNewParticipant] = useState("");
  const [participantError, setParticipantError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
  }, [authLoading, user, router]);

  async function load() {
    try {
      const res = await fetch(`/api/tickets/${params.id}`);
      if (!res.ok) {
        setError(res.status === 403 ? "Nu ai acces la acest ticket." : "Ticket inexistent.");
        return;
      }
      const data = await res.json();
      setTicket(data.ticket);
      setIsStaffView(data.isStaffView);
      setCanManageStatus(data.canManageStatus);
    } catch {
      setError("Nu am putut contacta serverul.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!user) return;
    const t = setTimeout(load, 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, params.id]);

  async function handleReply(e: React.FormEvent) {
    e.preventDefault();
    if (!reply.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/tickets/${params.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: reply }),
      });
      const data = await res.json();
      if (res.ok) {
        setReply("");
        await load();
      } else {
        setError(data.message ?? "Nu am putut trimite răspunsul.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function setStatus(status: string) {
    await fetch(`/api/tickets/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await load();
  }

  async function addParticipant(e: React.FormEvent) {
    e.preventDefault();
    setParticipantError(null);
    try {
      const res = await fetch(`/api/tickets/${params.id}/participants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: newParticipant }),
      });
      const data = await res.json();
      if (!res.ok) {
        setParticipantError(data.message ?? "Nu am putut adăuga persoana.");
        return;
      }
      setNewParticipant("");
      await load();
    } catch {
      setParticipantError("Nu am putut contacta serverul.");
    }
  }

  async function removeParticipant(userId: string) {
    await fetch(`/api/tickets/${params.id}/participants?userId=${userId}`, { method: "DELETE" });
    await load();
  }

  if (authLoading || !user || loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-void">
        <Loader2 className="animate-spin text-signal" size={32} />
      </main>
    );
  }

  if (error || !ticket) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center bg-void px-6 text-center">
          <p className="text-sm text-ink-muted">{error ?? "Ticket inexistent."}</p>
        </main>
      </>
    );
  }

  const isClosed = ticket.status === "CLOSED";

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-void px-6 pt-32 pb-24">
        <div className="mx-auto max-w-2xl">
          <Link
            href={isStaffView ? "/staff/tickets" : "/suport"}
            className="text-xs text-ink-faint hover:text-signal font-mono"
          >
            ← {isStaffView ? "Tickete staff" : "Ticketele mele"}
          </Link>

          <div className="mt-3 flex items-center justify-between flex-wrap gap-3">
            <h1 className="font-display uppercase text-2xl">{ticket.subject}</h1>
            <span className="font-mono text-[10px] uppercase tracking-wider text-signal border border-line rounded-full px-3 py-1">
              {STATUS_LABEL[ticket.status]}
            </span>
          </div>
          <p className="mt-1 text-xs text-ink-faint">
            {CATEGORY_LABEL[ticket.category]}
            {isStaffView && <> · de la {ticket.user.username}</>}
          </p>

          <div className="mt-6 flex items-center gap-2 flex-wrap">
            {!isClosed ? (
              <Button variant="outline" size="sm" onClick={() => setStatus("CLOSED")}>
                <Lock size={14} /> Închide ticket
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setStatus("OPEN")}>
                <Unlock size={14} /> Reopen
              </Button>
            )}
          </div>

          {canManageStatus && (
            <div className="mt-4 panel rounded-md p-4">
              <p className="font-mono text-[10px] uppercase tracking-wider text-ink-faint mb-2">
                Persoane adăugate în ticket
              </p>
              <div className="flex flex-wrap gap-2">
                {ticket.participants.length === 0 && (
                  <span className="text-xs text-ink-faint">Nimeni adăugat încă.</span>
                )}
                {ticket.participants.map((p) => (
                  <span
                    key={p.id}
                    className="flex items-center gap-1.5 text-xs bg-panel-raised border border-line rounded-full pl-3 pr-1.5 py-1"
                  >
                    {p.user.username}
                    <button onClick={() => removeParticipant(p.user.id)} className="text-ink-faint hover:text-red-400">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <form onSubmit={addParticipant} className="mt-3 flex gap-2">
                <Input
                  value={newParticipant}
                  onChange={(e) => setNewParticipant(e.target.value)}
                  placeholder="username"
                  className="h-8 text-xs"
                />
                <Button type="submit" variant="outline" size="sm">
                  <UserPlus size={13} /> Adaugă
                </Button>
              </form>
              {participantError && (
                <p className="mt-2 text-xs text-red-400">{participantError}</p>
              )}
            </div>
          )}

          <div className="mt-6 space-y-4">
            {ticket.messages.map((m) => (
              <div
                key={m.id}
                className={`panel rounded-md p-5 ${m.isStaffReply ? "border-line-strong" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-sm font-medium">
                    {m.isStaffReply && <ShieldCheck size={14} className="text-signal" />}
                    {m.author?.username ?? "utilizator șters"}
                  </span>
                  <span className="text-xs text-ink-faint font-mono">
                    {new Date(m.createdAt).toLocaleString("ro-RO")}
                  </span>
                </div>
                <div className="mt-3">
                  <PostContent content={m.content} />
                </div>
              </div>
            ))}
          </div>

          {!isClosed && (
            <form onSubmit={handleReply} className="mt-6 space-y-3">
              <MarkdownEditor value={reply} onChange={setReply} placeholder="Scrie un răspuns..." minRows={4} />
              <Button type="submit" variant="primary" size="sm" disabled={submitting}>
                {submitting && <Loader2 className="animate-spin" size={14} />}
                Răspunde
              </Button>
            </form>
          )}
        </div>
      </main>
    </>
  );
}
