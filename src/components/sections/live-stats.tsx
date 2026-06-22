"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type StatKey =
  | "playersOnline"
  | "maxPlayers"
  | "discordMembers"
  | "factionsActive"
  | "businessesActive";

const STAT_LABELS: Record<StatKey, string> = {
  playersOnline: "PLAYERS ONLINE",
  maxPlayers: "CAPACITATE MAX",
  discordMembers: "MEMBRI DISCORD",
  factionsActive: "FACȚIUNI ACTIVE",
  businessesActive: "BUSINESS-URI ACTIVE",
};

// Placeholder values until /api/stats is wired to the FiveM + Discord backend.
const FALLBACK_STATS: Record<StatKey, number> = {
  playersOnline: 187,
  maxPlayers: 256,
  discordMembers: 14320,
  factionsActive: 9,
  businessesActive: 41,
};

function useLiveStats() {
  const [stats, setStats] = useState(FALLBACK_STATS);
  const [lastSync, setLastSync] = useState<string>("--:--:--");

  useEffect(() => {
    let cancelled = false;
    async function fetchStats() {
      try {
        const res = await fetch("/api/stats", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setStats((prev) => ({ ...prev, ...data }));
      } catch {
        // Backend not wired yet — keep showing fallback values.
      } finally {
        if (!cancelled) setLastSync(new Date().toLocaleTimeString("ro-RO"));
      }
    }

    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return { stats, lastSync };
}

export function LiveStats() {
  const { stats, lastSync } = useLiveStats();

  const rows: StatKey[] = [
    "playersOnline",
    "maxPlayers",
    "discordMembers",
    "factionsActive",
    "businessesActive",
  ];

  return (
    <section className="relative bg-void px-6 py-20">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="scanline panel border-glow rounded-md overflow-hidden"
        >
          {/* Terminal header bar */}
          <div className="flex items-center justify-between border-b border-line px-5 py-3 font-mono text-xs uppercase tracking-wider text-ink-faint">
            <span className="text-signal">DISPATCH // SERVER-STATUS.MDT</span>
            <span>SYNC {lastSync}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-line">
            {rows.map((key) => (
              <div key={key} className="px-5 py-6 text-center">
                <div className="font-mono text-3xl sm:text-4xl font-semibold text-signal text-glow tabular-nums">
                  {stats[key].toLocaleString("ro-RO")}
                </div>
                <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
                  {STAT_LABELS[key]}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-line px-5 py-2.5 font-mono text-[11px] text-ink-faint">
            <span className="text-signal">STATUS:</span> ONLINE — toate
            sistemele funcționează normal
            <span className="terminal-caret" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
