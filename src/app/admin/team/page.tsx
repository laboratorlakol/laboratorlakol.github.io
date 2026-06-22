"use client";

import { useEffect, useState } from "react";
import { Loader2, Trash2, Plus, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatarUrl: string | null;
  position: number;
  visible: boolean;
}

export default function AdminTeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", role: "", avatarUrl: "" });
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/team");
      const data = await res.json();
      setMembers(data.members ?? []);
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
      await fetch("/api/admin/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, position: members.length }),
      });
      setForm({ name: "", role: "", avatarUrl: "" });
      await load();
    } finally {
      setSaving(false);
    }
  }

  async function toggleVisible(member: TeamMember) {
    await fetch(`/api/admin/team/${member.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visible: !member.visible }),
    });
    setMembers((prev) =>
      prev.map((m) => (m.id === member.id ? { ...m, visible: !m.visible } : m))
    );
  }

  async function remove(id: string) {
    await fetch(`/api/admin/team/${id}`, { method: "DELETE" });
    setMembers((prev) => prev.filter((m) => m.id !== id));
  }

  return (
    <div>
      <h1 className="font-display uppercase text-2xl">Echipă</h1>
      <p className="mt-1 text-sm text-ink-faint">
        Membrii afișați în secțiunea „Echipa&rdquo; de pe homepage.
      </p>

      <form onSubmit={handleAdd} className="mt-6 panel rounded-md p-5 flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Nume"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <Input
          placeholder="Rol (ex: Fondator)"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          required
        />
        <Input
          placeholder="URL poză (opțional)"
          value={form.avatarUrl}
          onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })}
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
        <div className="mt-6 panel rounded-md divide-y divide-line">
          {members.length === 0 && (
            <p className="px-4 py-6 text-center text-ink-faint">Niciun membru adăugat.</p>
          )}
          {members.map((m) => (
            <div key={m.id} className="px-4 py-3 flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">{m.name}</p>
                <p className="text-xs text-signal font-mono uppercase">{m.role}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => toggleVisible(m)}>
                  {m.visible ? <Eye size={15} /> : <EyeOff size={15} className="text-ink-faint" />}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => remove(m.id)}>
                  <Trash2 size={15} className="text-red-400" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
