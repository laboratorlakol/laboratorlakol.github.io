"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Loader2,
  Trash2,
  Plus,
  Pin,
  PinOff,
  Lock,
  Unlock,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Category {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  staffOnlyReplies: boolean;
  pinned: boolean;
  _count: { topics: number };
}

interface Topic {
  id: string;
  title: string;
  pinned: boolean;
  locked: boolean;
  category: { name: string; slug: string };
  author: { username: string } | null;
  _count: { posts: number };
}

function CategoriesPanel() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", description: "", staffOnlyReplies: false });
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/forum/categories");
      if (!res.ok) return;
      const data = await res.json();
      setCategories(data.categories ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const t = setTimeout(load, 0);
    return () => clearTimeout(t);
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch("/api/admin/forum/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setForm({ name: "", description: "", staffOnlyReplies: false });
      await load();
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Ștergi categoria? Toate topicurile din ea se șterg odată cu ea.")) return;
    await fetch(`/api/admin/forum/categories/${id}`, { method: "DELETE" });
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }

  async function toggleStaffOnly(cat: Category) {
    await fetch(`/api/admin/forum/categories/${cat.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ staffOnlyReplies: !cat.staffOnlyReplies }),
    });
    setCategories((prev) =>
      prev.map((c) => (c.id === cat.id ? { ...c, staffOnlyReplies: !c.staffOnlyReplies } : c))
    );
  }

  async function togglePin(cat: Category) {
    await fetch(`/api/admin/forum/categories/${cat.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pinned: !cat.pinned }),
    });
    setCategories((prev) =>
      prev.map((c) => (c.id === cat.id ? { ...c, pinned: !c.pinned } : c))
    );
  }

  return (
    <div>
      <h2 className="font-mono text-xs uppercase tracking-wider text-ink-faint">Categorii</h2>

      <form onSubmit={handleAdd} className="mt-3 panel rounded-md p-5 flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Nume categorie"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <Input
          placeholder="Descriere (opțional)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <label className="flex items-center gap-2 text-xs text-ink-faint whitespace-nowrap shrink-0">
          <input
            type="checkbox"
            checked={form.staffOnlyReplies}
            onChange={(e) => setForm({ ...form, staffOnlyReplies: e.target.checked })}
          />
          Doar staff răspunde
        </label>
        <Button type="submit" variant="primary" disabled={saving} className="shrink-0">
          <Plus size={16} /> Adaugă
        </Button>
      </form>

      {loading ? (
        <div className="mt-6 flex justify-center">
          <Loader2 className="animate-spin text-signal" size={24} />
        </div>
      ) : (
        <div className="mt-4 panel rounded-md divide-y divide-line">
          {categories.length === 0 && (
            <p className="px-4 py-6 text-center text-ink-faint">Nicio categorie încă.</p>
          )}
          {categories.map((cat) => (
            <div key={cat.id} className="px-4 py-3 flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">{cat.name}</p>
                <p className="text-xs text-ink-faint">
                  /forum/{cat.slug} · {cat._count.topics} topicuri
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={() => togglePin(cat)}>
                  {cat.pinned ? (
                    <PinOff size={14} className="text-signal" />
                  ) : (
                    <Pin size={14} />
                  )}
                </Button>
                <label className="flex items-center gap-1.5 text-xs text-ink-faint">
                  <input
                    type="checkbox"
                    checked={cat.staffOnlyReplies}
                    onChange={() => toggleStaffOnly(cat)}
                  />
                  Doar staff
                </label>
                <Button variant="ghost" size="sm" onClick={() => remove(cat.id)}>
                  <Trash2 size={14} className="text-red-400" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TopicsPanel() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load(q = "") {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/forum/topics?q=${encodeURIComponent(q)}`);
      if (!res.ok) return;
      const data = await res.json();
      setTopics(data.topics ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const t = setTimeout(load, 0);
    return () => clearTimeout(t);
  }, []);

  async function patch(id: string, body: Record<string, unknown>) {
    setBusyId(id);
    try {
      await fetch(`/api/admin/forum/topics/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setTopics((prev) => prev.map((t) => (t.id === id ? { ...t, ...body } : t)));
    } finally {
      setBusyId(null);
    }
  }

  async function remove(id: string) {
    if (!confirm("Ștergi topicul și toate răspunsurile? Nu se poate anula.")) return;
    setBusyId(id);
    try {
      await fetch(`/api/admin/forum/topics/${id}`, { method: "DELETE" });
      setTopics((prev) => prev.filter((t) => t.id !== id));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="mt-10">
      <h2 className="font-mono text-xs uppercase tracking-wider text-ink-faint">
        Toate topicurile
      </h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          load(query);
        }}
        className="mt-3 flex gap-2 max-w-sm"
      >
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Caută după titlu..."
        />
        <Button type="submit" variant="outline">
          <Search size={16} />
        </Button>
      </form>

      {loading ? (
        <div className="mt-6 flex justify-center">
          <Loader2 className="animate-spin text-signal" size={24} />
        </div>
      ) : (
        <div className="mt-4 panel rounded-md divide-y divide-line">
          {topics.length === 0 && (
            <p className="px-4 py-6 text-center text-ink-faint">Niciun topic găsit.</p>
          )}
          {topics.map((t) => (
            <div key={t.id} className="px-4 py-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <Link
                  href={`/forum/${t.category.slug}/${t.id}`}
                  className="font-medium text-sm hover:text-signal truncate block"
                >
                  {t.title}
                </Link>
                <p className="text-xs text-ink-faint">
                  {t.category.name} · {t.author?.username ?? "—"} · {t._count.posts} răspunsuri
                </p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={busyId === t.id}
                  onClick={() => patch(t.id, { pinned: !t.pinned })}
                >
                  {t.pinned ? <PinOff size={14} /> : <Pin size={14} />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={busyId === t.id}
                  onClick={() => patch(t.id, { locked: !t.locked })}
                >
                  {t.locked ? <Unlock size={14} /> : <Lock size={14} />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={busyId === t.id}
                  onClick={() => remove(t.id)}
                >
                  <Trash2 size={14} className="text-red-400" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminForumPage() {
  return (
    <div>
      <h1 className="font-display uppercase text-2xl">Forum</h1>
      <p className="mt-1 text-sm text-ink-faint">
        Gestionează categorii și moderează topicuri — pin, blocare, ștergere.
      </p>

      <div className="mt-6">
        <CategoriesPanel />
      </div>
      <TopicsPanel />
    </div>
  );
}
