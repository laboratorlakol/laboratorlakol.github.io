"use client";

import { useEffect, useState } from "react";
import { Loader2, Search, KeyRound } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const ROLES = [
  "MEMBER",
  "HELPER",
  "MODERATOR",
  "ADMINISTRATOR",
  "SUPERVISOR",
  "COMMUNITY_MANAGER",
  "CO_FOUNDER",
  "FOUNDER",
];

const ROLE_LABELS: Record<string, string> = {
  MEMBER: "Member",
  HELPER: "Helper",
  MODERATOR: "Moderator",
  ADMINISTRATOR: "Administrator",
  SUPERVISOR: "Supervizor",
  COMMUNITY_MANAGER: "Community Manager",
  CO_FOUNDER: "Co-Fondator",
  FOUNDER: "Fondator",
};

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Activ",
  SUSPENDED: "Suspendat",
  BANNED: "Banat",
};

interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
  status: string;
  emailVerified: boolean;
  citizenId: string | null;
  characterName: string | null;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function load(q = "") {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setUsers(data.users ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const t = setTimeout(load, 0);
    return () => clearTimeout(t);
  }, []);

  async function updateUser(id: string, body: Record<string, unknown>) {
    setBusyId(id);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message ?? "Eroare la actualizare.");
        return;
      }
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, ...data.user } : u))
      );
    } finally {
      setBusyId(null);
    }
  }

  async function triggerReset(id: string, username: string) {
    setBusyId(id);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/users/${id}/reset-password`, { method: "POST" });
      if (res.ok) setMessage(`Email de resetare trimis pentru ${username}.`);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <h1 className="font-display uppercase text-2xl">Utilizatori</h1>
      <p className="mt-1 text-sm text-ink-faint">
        Gestionează roluri, statusul conturilor și resetări de parolă.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          load(query);
        }}
        className="mt-6 flex gap-2 max-w-sm"
      >
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Caută username sau email..."
        />
        <Button type="submit" variant="outline" size="default">
          <Search size={16} />
        </Button>
      </form>

      {message && (
        <p className="mt-4 text-sm text-signal bg-signal/10 border border-line rounded-md px-3 py-2">
          {message}
        </p>
      )}

      {loading ? (
        <div className="mt-10 flex justify-center">
          <Loader2 className="animate-spin text-signal" size={28} />
        </div>
      ) : (
        <div className="mt-6 panel rounded-md overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left font-mono text-[10px] uppercase tracking-wider text-ink-faint">
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Rol</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Personaj</th>
                <th className="px-4 py-3 text-right">Acțiuni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-3">
                    <p className="font-medium">{u.username}</p>
                    <p className="text-xs text-ink-faint">{u.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Select
                      value={u.role}
                      disabled={busyId === u.id}
                      onChange={(e) => updateUser(u.id, { role: e.target.value })}
                      className="h-9 text-xs"
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>
                          {ROLE_LABELS[r]}
                        </option>
                      ))}
                    </Select>
                  </td>
                  <td className="px-4 py-3">
                    <Select
                      value={u.status}
                      disabled={busyId === u.id}
                      onChange={(e) => updateUser(u.id, { status: e.target.value })}
                      className="h-9 text-xs"
                    >
                      {Object.entries(STATUS_LABELS).map(([val, label]) => (
                        <option key={val} value={val}>
                          {label}
                        </option>
                      ))}
                    </Select>
                  </td>
                  <td className="px-4 py-3 text-xs text-ink-faint">
                    {u.characterName ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={busyId === u.id}
                      onClick={() => triggerReset(u.id, u.username)}
                    >
                      <KeyRound size={14} /> Reset parolă
                    </Button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-ink-faint">
                    Niciun utilizator găsit.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
