"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon, MessageSquare, Newspaper, ScrollText, Loader2 } from "lucide-react";
interface Results { topics:{id:string;title:string;category:{slug:string;name:string}}[]; posts:{id:string;title:string;excerpt:string}[]; articles:{id:string;title:string;chapter:{id:string;title:string}}[]; }
function SearchContent() {
  const router = useRouter();
  const params = useSearchParams();
  const initialQ = params.get("q")??"";
  const [query, setQuery] = useState(initialQ);
  const [results, setResults] = useState<Results|null>(null);
  const [loading, setLoading] = useState(false);
  async function runSearch(q: string) {
    if (q.trim().length<2) { setResults(null); return; }
    setLoading(true);
    try { const res=await fetch(`/api/search?q=${encodeURIComponent(q)}`); const data=await res.json(); setResults(data); }
    finally { setLoading(false); }
  }
  useEffect(()=>{ if (initialQ) { const t=setTimeout(()=>runSearch(initialQ),0); return ()=>clearTimeout(t); } },[initialQ]);
  function handleSubmit(e: React.FormEvent) { e.preventDefault(); router.replace(`/search?q=${encodeURIComponent(query)}`); runSearch(query); }
  const hasResults = results&&(results.topics.length>0||results.posts.length>0||results.articles.length>0);
  return (
    <>
      <Navbar/>
      <main className="min-h-screen bg-void px-6 pt-32 pb-24">
        <div className="mx-auto max-w-2xl">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-signal">Căutare</span>
          <h1 className="font-display uppercase text-3xl mt-3">Caută pe site</h1>
          <form onSubmit={handleSubmit} className="mt-6 flex gap-2">
            <Input autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder="Scrie cel puțin 2 caractere..."/>
            <Button type="submit" variant="primary"><SearchIcon size={16}/></Button>
          </form>
          {loading&&<div className="mt-10 flex justify-center"><Loader2 className="animate-spin text-signal" size={28}/></div>}
          {!loading&&results&&!hasResults&&<p className="mt-10 text-center text-sm text-ink-faint">Niciun rezultat.</p>}
          {!loading&&results&&hasResults&&(
            <div className="mt-8 space-y-8">
              {results.topics.length>0&&<div><h2 className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-signal"><MessageSquare size={14}/>Forum</h2><div className="mt-3 panel rounded-md divide-y divide-line">{results.topics.map(t=><Link key={t.id} href={`/forum/${t.category.slug}/${t.id}`} className="block px-4 py-3 hover:bg-panel-raised transition-colors"><p className="text-sm font-medium">{t.title}</p><p className="text-xs text-ink-faint mt-0.5">{t.category.name}</p></Link>)}</div></div>}
              {results.posts.length>0&&<div><h2 className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-signal"><Newspaper size={14}/>Noutăți</h2><div className="mt-3 panel rounded-md divide-y divide-line">{results.posts.map(p=><Link key={p.id} href={`/noutati/${p.id}`} className="block px-4 py-3 hover:bg-panel-raised transition-colors"><p className="text-sm font-medium">{p.title}</p><p className="text-xs text-ink-faint mt-0.5 line-clamp-1">{p.excerpt}</p></Link>)}</div></div>}
              {results.articles.length>0&&<div><h2 className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-signal"><ScrollText size={14}/>Regulament</h2><div className="mt-3 panel rounded-md divide-y divide-line">{results.articles.map(a=><Link key={a.id} href={`/regulament#${a.chapter.id}`} className="block px-4 py-3 hover:bg-panel-raised transition-colors"><p className="text-sm font-medium">{a.title}</p><p className="text-xs text-ink-faint mt-0.5">{a.chapter.title}</p></Link>)}</div></div>}
            </div>
          )}
        </div>
      </main>
      <Footer/>
    </>
  );
}
export default function SearchPage() { return <Suspense fallback={null}><SearchContent/></Suspense>; }
