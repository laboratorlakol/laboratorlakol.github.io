"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TurnstileWidget } from "@/components/auth/turnstile-widget";
import { useAuth } from "@/lib/auth/auth-context";
import { Loader2, CheckCircle2 } from "lucide-react";
export default function RegisterPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [form, setForm] = useState({ username:"", email:"", password:"" });
  const [turnstileToken, setTurnstileToken] = useState<string|null>(null);
  const [tosAccepted, setTosAccepted] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  useEffect(()=>{ if (!authLoading&&user) router.replace("/dashboard"); },[authLoading,user,router]);
  if (authLoading||user) return <main className="min-h-screen flex items-center justify-center bg-void"><Loader2 className="animate-spin text-signal" size={32}/></main>;
  if (done) return (
    <AuthLayout title="Cont creat">
      <div className="text-center">
        <CheckCircle2 className="mx-auto text-signal" size={40}/>
        <p className="mt-4 text-sm text-ink-muted">Ți-am trimis un email de confirmare la <strong className="text-ink">{form.email}</strong>.</p>
        <Button variant="primary" className="mt-6 w-full" asChild><Link href="/login">Mergi la conectare</Link></Button>
      </div>
    </AuthLayout>
  );
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError(null); setLoading(true);
    try {
      const res=await fetch("/api/auth/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...form,turnstileToken,tosAccepted:true})});
      const data=await res.json();
      if (!res.ok) { setError(data.message??data.issues?.[0]?.message??"A apărut o eroare."); return; }
      setDone(true);
    } catch { setError("Nu am putut contacta serverul."); }
    finally { setLoading(false); }
  }
  return (
    <AuthLayout title="Creează Cont" subtitle="Înregistrare gratuită.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div><label className="font-mono text-xs uppercase tracking-wider text-ink-faint">Username</label><Input className="mt-1.5" value={form.username} onChange={e=>setForm({...form,username:e.target.value})} placeholder="numele_tau" autoComplete="username" required/></div>
        <div><label className="font-mono text-xs uppercase tracking-wider text-ink-faint">Email</label><Input className="mt-1.5" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="tu@exemplu.com" autoComplete="email" required/></div>
        <div>
          <label className="font-mono text-xs uppercase tracking-wider text-ink-faint">Parolă</label>
          <Input className="mt-1.5" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Minimum 8 caractere" autoComplete="new-password" required/>
          <p className="mt-1.5 text-xs text-ink-faint">Minimum 8 caractere, o literă mare și o cifră.</p>
        </div>
        {error && <p className="text-sm text-red-400 bg-red-950/30 border border-red-900/40 rounded-md px-3 py-2">{error}</p>}
        <label className="flex items-start gap-3 cursor-pointer group">
          <input type="checkbox" checked={tosAccepted} onChange={e=>setTosAccepted(e.target.checked)} className="mt-0.5 accent-[var(--signal)]"/>
          <span className="text-xs text-ink-faint leading-relaxed">Am citit și accept <a href="/tos" target="_blank" className="text-signal hover:underline">Termenii și Condițiile</a> și <a href="/privacy" target="_blank" className="text-signal hover:underline">Politica de Confidențialitate</a> ale FADED Romania Roleplay.</span>
        </label>
        <TurnstileWidget onVerify={setTurnstileToken} onExpire={()=>setTurnstileToken(null)}/>
        <Button type="submit" variant="primary" className="w-full" disabled={loading||!tosAccepted}>{loading&&<Loader2 className="animate-spin" size={16}/>}Creează cont</Button>
      </form>
      <p className="mt-6 text-center text-sm text-ink-faint">Ai deja cont? <Link href="/login" className="text-signal hover:underline">Conectează-te</Link></p>
    </AuthLayout>
  );
}
