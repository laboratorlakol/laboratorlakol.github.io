"use client";

import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({ tebexUrl: "", discordInviteUrl: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => setSettings(data.settings))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center mt-10">
        <Loader2 className="animate-spin text-signal" size={28} />
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display uppercase text-2xl">Setări</h1>
      <p className="mt-1 text-sm text-ink-faint">
        Linkuri folosite în tot site-ul (butoane, footer).
      </p>

      <form onSubmit={handleSubmit} className="mt-6 panel rounded-md p-6 space-y-5 max-w-xl">
        <div>
          <label className="font-mono text-xs uppercase tracking-wider text-ink-faint">
            Link Tebex (Magazin)
          </label>
          <Input
            className="mt-1.5"
            value={settings.tebexUrl}
            onChange={(e) => setSettings({ ...settings, tebexUrl: e.target.value })}
            placeholder="https://faded.tebex.io"
          />
          <p className="mt-1.5 text-xs text-ink-faint">
            Dacă lași gol, /magazin arată „Magazinul este în curs de configurare&rdquo;.
          </p>
        </div>

        <div>
          <label className="font-mono text-xs uppercase tracking-wider text-ink-faint">
            Link invite Discord
          </label>
          <Input
            className="mt-1.5"
            value={settings.discordInviteUrl}
            onChange={(e) => setSettings({ ...settings, discordInviteUrl: e.target.value })}
            placeholder="https://discord.gg/..."
          />
        </div>

        {saved && (
          <p className="text-sm text-signal bg-signal/10 border border-line rounded-md px-3 py-2">
            Salvat.
          </p>
        )}

        <Button type="submit" variant="primary" disabled={saving}>
          {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          Salvează
        </Button>
      </form>
    </div>
  );
}
