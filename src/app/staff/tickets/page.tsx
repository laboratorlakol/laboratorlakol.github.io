"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-context";
import { Navbar } from "@/components/sections/navbar";
import { Select } from "@/components/ui/select";
import { Loader2, MessageCircle, ShieldAlert } from "lucide-react";
interface Ticket { id:string; subject:string; category:string; status:string; updatedAt:string; user:{username:string}; _count:{messages:number} }
const STATUS_LABEL: Record<string,string> = { OPEN:"Deschis", IN_PROGRESS:"În lucru", CLOSED:"Închis" };
const STATUS_COLOR: Record<string,string> = { OPEN:"text-signal", IN_PROGRESS:"text-signal-bright", CLOSED:"text-ink-faint" };
const CAT_LABEL: Record<string,string> = { REPORT_PLAYER:"Raportare Jucător", REPORT_STAFF:"Raportare Membru Staff", SANCTION_APPEAL:"Contestare Sancțiune", CONTACT_FOUNDER:"Contact Fondator" };
const STAFF_ROLES = ["HELPER","MODERATOR","ADMINISTRATOR","SUPERVISOR","COMMUNITY_MANAGER","CO_FOUNDER","FOUNDER"];
export default function StaffTicketsPage() {
  const { user, loading: authLoading } = useAuth(); const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]); const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false); const [filter, setFilter] = useState("");
  useEffect(()=>{ if (authLoading) return; if (!user||!STAFF_ROLES.includes(user.role)) router.replace("/"); },[authLoading,user,router]);
  async function load(status="") {
    setLoading(true);
    try { const res=await fetch(`/api/staff/tickets${status?`?status=${status}`:""}`); if (!res.ok){setForbidden(true);return;} const d=await res.json(); setTickets(d.tickets??[]); }
    finally { setLoading(false); }
  }
  useEffect(()=>{ if (!user||!STAFF_ROLES.includes(user.role)) return; const t=setTimeout(()=>load(),0); return()=>clearTimeout(t); },[user]);
  if (authLoading||!user||!STAFF_ROLES.includes(user.role)) return <main className="min-h-screen flex items-center justify-center bg-void"><Loader2 className="animate-spin text-signal" size={32}/></main>;
  return (
    <>
      <Navbar/>
      <main className="min-h-screen bg-void px-6 pt-32 pb-24">
        <div className="mx-auto max-w-3xl">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-signal">Staff</span>
          <h1 className="font-display uppercase text-3xl mt-3">Tickete</h1>
          <p className="mt-1 text-sm text-ink-faint">Categoriile vizibile depind de rangul tău.</p>
          <div className="mt-6 max-w-xs">
            <Select value={filter} onChange={e=>{setFilter(e.target.value);load(e.target.value);}}>
              <option value="">Toate</option>
              <option value="OPEN">Deschise</option>
              <option value="IN_PROGRESS">În lucru</option>
              <option value="CLOSED">Închise</option>
            </Select>
          </div>
          {forbidden&&<div className="mt-8 flex items-start gap-3 panel border-glow rounded-md p-4"><ShieldAlert className="text-signal shrink-0 mt-0.5" size={18}/><p className="text-sm text-ink-muted">Rangul tău nu are acces la nicio categorie.</p></div>}
          {loading ? <div className="mt-10 flex justify-center"><Loader2 className="animate-spin text-signal" size={28}/></div> : (
            <div className="mt-6 panel rounded-md divide-y divide-line">
              {tickets.length===0&&!forbidden&&<p className="px-4 py-8 text-center text-ink-faint">Niciun ticket.</p>}
              {tickets.map(t=>(
                <Link key={t.id} href={`/suport/${t.id}`} className="flex items-center justify-between px-4 py-3 hover:bg-panel-raised transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <MessageCircle className="text-signal shrink-0" size={16}/>
                    <div className="min-w-0"><p className="text-sm font-medium truncate">{t.subject}</p><p className="text-xs text-ink-faint mt-0.5">{t.user.username} · {CAT_LABEL[t.category]} · {t._count.messages} mesaje</p></div>
                  </div>
                  <span className={`font-mono text-[10px] uppercase tracking-wider shrink-0 ml-4 ${STATUS_COLOR[t.status]}`}>{STATUS_LABEL[t.status]}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
