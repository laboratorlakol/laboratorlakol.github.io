"use client";
import { useEffect, useState } from "react";
import { Loader2, Trash2, Plus, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
const CATEGORIES = [{value:"UPDATES",label:"Updates"},{value:"EVENTS",label:"Events"},{value:"ANNOUNCEMENTS",label:"Announcements"},{value:"DEVELOPMENT_LOGS",label:"Development Logs"}];
interface Post { id:string; title:string; excerpt:string; content:string; category:string; published:boolean }
export default function AdminNewsPage() {
  const [posts, setPosts] = useState<Post[]>([]); const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({title:"",excerpt:"",content:"",category:"UPDATES"}); const [saving, setSaving] = useState(false);
  async function load() { setLoading(true); try { const res=await fetch("/api/admin/news"); if (!res.ok) return; const d=await res.json(); setPosts(d.posts??[]); } finally { setLoading(false); } }
  useEffect(()=>{ const t=setTimeout(load,0); return()=>clearTimeout(t); },[]);
  async function handleAdd(e: React.FormEvent) { e.preventDefault(); setSaving(true); try { await fetch("/api/admin/news",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)}); setForm({title:"",excerpt:"",content:"",category:"UPDATES"}); await load(); } finally { setSaving(false); } }
  async function togglePublished(p: Post) { await fetch(`/api/admin/news/${p.id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({published:!p.published})}); setPosts(prev=>prev.map(x=>x.id===p.id?{...x,published:!x.published}:x)); }
  async function remove(id: string) { await fetch(`/api/admin/news/${id}`,{method:"DELETE"}); setPosts(prev=>prev.filter(p=>p.id!==id)); }
  return (
    <div>
      <h1 className="font-display uppercase text-2xl">Noutăți</h1>
      <form onSubmit={handleAdd} className="mt-6 panel rounded-md p-5 space-y-3">
        <div className="grid sm:grid-cols-[1fr_180px] gap-3">
          <Input placeholder="Titlu" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required/>
          <Select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>{CATEGORIES.map(c=><option key={c.value} value={c.value}>{c.label}</option>)}</Select>
        </div>
        <Input placeholder="Rezumat scurt" value={form.excerpt} onChange={e=>setForm({...form,excerpt:e.target.value})} required/>
        <Textarea placeholder="Conținut complet" rows={4} value={form.content} onChange={e=>setForm({...form,content:e.target.value})} required/>
        <Button type="submit" variant="primary" disabled={saving}><Plus size={16}/>Adaugă articol (nepublicat)</Button>
      </form>
      {loading ? <div className="mt-10 flex justify-center"><Loader2 className="animate-spin text-signal" size={28}/></div> : (
        <div className="mt-6 panel rounded-md divide-y divide-line">
          {posts.length===0&&<p className="px-4 py-6 text-center text-ink-faint">Niciun articol încă.</p>}
          {posts.map(p=>(
            <div key={p.id} className="px-4 py-3 flex items-center justify-between">
              <div><p className="font-medium text-sm">{p.title}</p><p className="text-xs text-ink-faint">{p.category} · {p.published?"Publicat":"Draft"}</p></div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={()=>togglePublished(p)}>{p.published?<Eye size={15} className="text-signal"/>:<EyeOff size={15} className="text-ink-faint"/>}</Button>
                <Button variant="ghost" size="sm" onClick={()=>remove(p.id)}><Trash2 size={15} className="text-red-400"/></Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
