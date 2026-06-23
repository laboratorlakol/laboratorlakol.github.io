"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-context";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, MessageCircle } from "lucide-react";

interface Ticket {
  id: string;
  subject: string;
  category: string;
  status: string;
  updatedAt: string;
  _count: { messages: number };
}

const STATUS_LABEL: Record<string, string> = {
  OPEN: "Deschis",
  IN_PROGRESS: "În lucru",
  CLOSED: "Închis",
};

const STATUS_COLOR: Record<string, string> = {
  OPEN: "text-signal",
  IN_PROGRESS: "text-signal-bright",
  CLOSED: "text-ink-faint",
};

export default function SuportPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user) return;
    const t = setTimeout(() => {
      fetch("/api/tickets")
        .then((r) => r.json())
        .then((data) => setTickets(data.tickets ?? []))
        .finally(() => setLoading(false));
    }, 0);
    return () => clearTimeout(t);
  }, [user]);

  if (authLoading || !user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-void">
        <Loader2 className="animate-spin text-signal" size={32} />
      </main>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-void px-6 pt-32 pb-24">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-signal">
                Suport
              </span>
              <h1 className="font-display uppercase text-3xl mt-3">Ticketele mele</h1>
            </div>
            <Button variant="primary" size="sm" asChild>
              <Link href="/suport/new">
                <Plus size={15} /> Ticket nou
              </Link>
            </Button>
          </div>

          {loading ? (
            <div className="mt-10 flex justify-center">
              <Loader2 className="animate-spin text-signal" size={28} />
            </div>
          ) : (
            <div className="mt-8 panel rounded-md divide-y divide-line">
              {tickets.length === 0 && (
                <p className="px-5 py-8 text-center text-sm text-ink-faint">
                  Nu ai niciun ticket încă.
                </p>
              )}
              {tickets.map((t) => (
                <Link
                  key={t.id}
                  href={`/suport/${t.id}`}
                  className="flex items-center justify-between px-5 py-4 hover:bg-panel-raised transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <MessageCircle className="text-signal shrink-0" size={18} />
                    <div className="min-w-0">
                      <p className="font-medium truncate">{t.subject}</p>
                      <p className="text-xs text-ink-faint mt-0.5">
                        {new Date(t.updatedAt).toLocaleString("ro-RO")}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`font-mono text-[10px] uppercase tracking-wider shrink-0 ml-4 ${STATUS_COLOR[t.status]}`}
                  >
                    {STATUS_LABEL[t.status]}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
