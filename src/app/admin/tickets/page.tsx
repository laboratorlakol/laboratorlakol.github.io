"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, MessageCircle } from "lucide-react";
import { Select } from "@/components/ui/select";
interface Ticket { id:string; subject:string; status:string; updatedAt:string; user:{username:string}; _count:{messages:number} }
const STATUS_LABEL: Record<string,string> = { OPEN:"Deschis",IN_PROGRESS:"În lucru",CLOSED:"Închis" };
const STATUS_COLOR: Record<string,string> = { OPEN:"text-signal",IN_PROGRESS:"text-signal-bright",CLOSED:"text-ink-faint" };
export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]); const [loading, setLoading] = useState(true); const [filter, setFilter] = useState("");
  async function load(status="") { setLoading(true); try { const res=await fetch(`/api/admin/tickets${status?`?status=${status}`:""}`); if (!res.ok) return; const d=await res.json(); setTickets(d.tickets??[]); } finally { setLoading(false); } }
  useEffect(()=>{ const t=setTimeout(()=>load(),0); return()=>clearTimeout(t); },[]);
  return (
    <div>
      <h1 className="font-display uppercase text-2xl">Tickete</h1>
      <p className="mt-1 text-sm text-ink-faint">Toate cererile de suport.</p>
      <div className="mt-6 max-w-xs"><Select value={filter} onChange={e=>{setFilter(e.target.value);load(e.target.value);}}><option value="">Toate</option><option value="OPEN">Deschise</option><option value="IN_PROGRESS">În lucru</option><option value="CLOSED">Închise</option></Select></div>
      {loading ? <div className="mt-10 flex justify-center"><Loader2 className="animate-spin text-signal" size={28}/></div> : (
        <div className="mt-6 panel rounded-md divide-y divide-line">
          {tickets.length===0&&<p className="px-4 py-8 text-center text-ink-faint">Niciun ticket.</p>}
          {tickets.map(t=>(
            <Link key={t.id} href={`/suport/${t.id}`} className="flex items-center justify-between px-4 py-3 hover:bg-panel-raised transition-colors">
              <div className="flex items-center gap-3 min-w-0"><MessageCircle className="text-signal shrink-0" size={16}/><div className="min-w-0"><p className="text-sm font-medium truncate">{t.subject}</p><p className="text-xs text-ink-faint mt-0.5">{t.user.username} · {t._count.messages} mesaje</p></div></div>
              <span className={`font-mono text-[10px] uppercase tracking-wider shrink-0 ml-4 ${STATUS_COLOR[t.status]}`}>{STATUS_LABEL[t.status]}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
