"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, User, Gamepad2, ShieldCheck } from "lucide-react";
import { ROLE_LABELS } from "@/lib/auth/rbac";
import { Role } from "@prisma/client";
export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [linkCode, setLinkCode] = useState("");
  const [linkError, setLinkError] = useState<string|null>(null);
  const [linkSuccess, setLinkSuccess] = useState<string|null>(null);
  const [linking, setLinking] = useState(false);
  useEffect(()=>{ if (!loading&&!user) router.replace("/login"); },[loading,user,router]);
  if (loading||!user) return <main className="min-h-screen flex items-center justify-center bg-void"><Loader2 className="animate-spin text-signal" size={32}/></main>;
  async function handleLink(e: React.FormEvent) {
    e.preventDefault(); setLinkError(null); setLinkSuccess(null); setLinking(true);
    try {
      const res=await fetch("/api/fivem/link",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({code:linkCode.trim()})});
      const data=await res.json();
      if (!res.ok) { setLinkError(data.message??"Cod invalid."); return; }
      setLinkSuccess(`Personaj conectat: ${data.characterName??data.citizenId}`);
      setLinkCode("");
    } catch { setLinkError("Nu am putut contacta serverul."); }
    finally { setLinking(false); }
  }
  return (
    <>
      <Navbar/>
      <main className="min-h-screen bg-void px-6 pt-32 pb-24">
        <div className="mx-auto max-w-2xl">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-signal">Dashboard</span>
          <h1 className="font-display uppercase text-3xl mt-3">Bun venit, {user.username}</h1>
          <div className="mt-8 space-y-5">
            <div className="panel rounded-md p-5 flex items-center gap-4">
              <User className="text-signal" size={24}/>
              <div>
                <p className="text-sm font-medium">{user.username}</p>
                <p className="text-xs text-ink-faint">{user.email}</p>
              </div>
              <div className="ml-auto">
                <span className="font-mono text-[10px] uppercase tracking-wider text-signal border border-line rounded-full px-2.5 py-1">{ROLE_LABELS[user.role as Role]??user.role}</span>
              </div>
            </div>
            {user.emailVerified ? null : (
              <div className="panel rounded-md p-5 flex items-start gap-3 border-glow">
                <ShieldCheck className="text-signal shrink-0 mt-0.5" size={18}/>
                <p className="text-sm text-ink-muted">Emailul tău nu este confirmat. Verifică inbox-ul.</p>
              </div>
            )}
            <div className="panel rounded-md p-5">
              <div className="flex items-center gap-3 mb-4">
                <Gamepad2 className="text-signal" size={22}/>
                <h2 className="font-mono text-sm uppercase tracking-wider">Personaj FiveM</h2>
              </div>
              {user.citizenId ? (
                <p className="text-sm text-ink-muted">Conectat: <span className="text-signal">{user.characterName??user.citizenId}</span></p>
              ) : (
                <>
                  <p className="text-sm text-ink-muted mb-4">Scrie <code className="text-signal">/codsite</code> în joc, copiază codul și introdu-l mai jos.</p>
                  <form onSubmit={handleLink} className="flex gap-2">
                    <Input value={linkCode} onChange={e=>setLinkCode(e.target.value)} placeholder="FADED-XXXX-XXXX" className="font-mono" required/>
                    <Button type="submit" variant="primary" size="sm" disabled={linking}>{linking&&<Loader2 className="animate-spin" size={14}/>}Conectează</Button>
                  </form>
                  {linkError&&<p className="mt-2 text-sm text-red-400">{linkError}</p>}
                  {linkSuccess&&<p className="mt-2 text-sm text-signal">{linkSuccess}</p>}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer/>
    </>
  );
}
