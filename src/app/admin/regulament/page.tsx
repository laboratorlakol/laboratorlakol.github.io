"use client";

import { useEffect, useState } from "react";
import { Loader2, Trash2, Plus, ChevronDown, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface Article {
  id: string;
  title: string;
  content: string;
  position: number;
}

interface Chapter {
  id: string;
  title: string;
  position: number;
  articles: Article[];
}

function ChapterCard({
  chapter,
  onChanged,
}: {
  chapter: Chapter;
  onChanged: () => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const [form, setForm] = useState({ title: "", content: "" });
  const [saving, setSaving] = useState(false);

  async function addArticle(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch(`/api/admin/regulament/chapters/${chapter.id}/articles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, position: chapter.articles.length }),
      });
      setForm({ title: "", content: "" });
      onChanged();
    } finally {
      setSaving(false);
    }
  }

  async function removeArticle(id: string) {
    await fetch(`/api/admin/regulament/articles/${id}`, { method: "DELETE" });
    onChanged();
  }

  async function removeChapter() {
    if (!confirm("Ștergi capitolul și toate articolele din el?")) return;
    await fetch(`/api/admin/regulament/chapters/${chapter.id}`, { method: "DELETE" });
    onChanged();
  }

  return (
    <div className="panel rounded-md">
      <div className="flex items-center justify-between px-4 py-3 border-b border-line">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-2 text-sm font-medium"
        >
          {expanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
          {chapter.title}
          <span className="text-xs text-ink-faint font-mono">
            ({chapter.articles.length} articole)
          </span>
        </button>
        <Button variant="ghost" size="sm" onClick={removeChapter}>
          <Trash2 size={14} className="text-red-400" />
        </Button>
      </div>

      {expanded && (
        <div className="px-4 py-4 space-y-3">
          {chapter.articles.map((article, i) => (
            <div key={article.id} className="flex items-start justify-between gap-3 border-b border-line pb-3 last:border-0 last:pb-0">
              <div>
                <p className="text-sm font-medium">
                  Art. {i + 1} — {article.title}
                </p>
                <p className="text-xs text-ink-faint mt-1 line-clamp-2">{article.content}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => removeArticle(article.id)}>
                <Trash2 size={13} className="text-red-400" />
              </Button>
            </div>
          ))}

          <form onSubmit={addArticle} className="space-y-2 pt-2">
            <Input
              placeholder="Titlu articol"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <Textarea
              placeholder="Conținut articol"
              rows={3}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              required
            />
            <Button type="submit" variant="outline" size="sm" disabled={saving}>
              <Plus size={14} /> Adaugă articol
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}

export default function AdminRegulamentPage() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/regulament/chapters");
      if (!res.ok) return;
      const data = await res.json();
      setChapters(data.chapters ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const t = setTimeout(load, 0);
    return () => clearTimeout(t);
  }, []);

  async function addChapter(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch("/api/admin/regulament/chapters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newChapterTitle, position: chapters.length }),
      });
      setNewChapterTitle("");
      await load();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="font-display uppercase text-2xl">Regulament</h1>
      <p className="mt-1 text-sm text-ink-faint">
        Capitole și articole afișate pe pagina publică /regulament, în ordinea de mai jos.
      </p>

      <form onSubmit={addChapter} className="mt-6 flex gap-2 max-w-md">
        <Input
          placeholder="Titlu capitol nou"
          value={newChapterTitle}
          onChange={(e) => setNewChapterTitle(e.target.value)}
          required
        />
        <Button type="submit" variant="primary" disabled={saving} className="shrink-0">
          <Plus size={16} /> Adaugă
        </Button>
      </form>

      {loading ? (
        <div className="mt-10 flex justify-center">
          <Loader2 className="animate-spin text-signal" size={28} />
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {chapters.length === 0 && (
            <p className="text-center text-ink-faint py-8">Niciun capitol încă.</p>
          )}
          {chapters.map((chapter) => (
            <ChapterCard key={chapter.id} chapter={chapter} onChanged={load} />
          ))}
        </div>
      )}
    </div>
  );
}
