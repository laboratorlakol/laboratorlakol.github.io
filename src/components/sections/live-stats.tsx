"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Stats {
  playersOnline: number | null;
  discordMembers: number | null;
}

function useLiveStats() {
  const [stats, setStats] = useState<Stats>({
    playersOnline: null,
    discordMembers: null,
  });
  const [lastSync, setLastSync] = useState<string>("--:--:--");

  useEffect(() => {
    let cancelled = false;

    async function fetchStats() {
      const [playersRes, discordRes] = await Promise.allSettled([
        fetch("/api/stats", { cache: "no-store" }),
        fetch("/api/discord-stats", { cache: "no-store" }),
      ]);

      if (cancelled) return;

      if (playersRes.status === "fulfilled" && playersRes.value.ok) {
        const data = await playersRes.value.json();
        if (!cancelled && typeof data.playersOnline === "number") {
          setStats((prev) => ({ ...prev, playersOnline: data.playersOnline }));
        }
      }

      if (discordRes.status === "fulfilled" && discordRes.value.ok) {
        const data = await discordRes.value.json();
        if (!cancelled && typeof data.discordMembers === "number") {
          setStats((prev) => ({ ...prev, discordMembers: data.discordMembers }));
        }
      }

      if (!cancelled) setLastSync(new Date().toLocaleTimeString("ro-RO"));
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

  return (
    <section className="relative bg-void px-6 py-20">
      <div className="mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="scanline panel border-glow rounded-md overflow-hidden"
        >
          <div className="flex items-center justify-between border-b border-line px-5 py-3 font-mono text-xs uppercase tracking-wider text-ink-faint">
            <span className="inline-flex items-center gap-2 text-signal">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-signal opacity-75 animate-ping" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal" />
              </span>
              STATUS SERVER
            </span>
            <span>SYNC {lastSync}</span>
          </div>

          <div className="grid grid-cols-2 divide-x divide-line">
            <div className="px-5 py-6 text-center">
              <div className="font-mono text-3xl sm:text-4xl font-semibold text-signal text-glow tabular-nums">
                {stats.playersOnline !== null
                  ? stats.playersOnline.toLocaleString("ro-RO")
                  : "—"}
              </div>
              <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
                Playeri Online
              </div>
            </div>
            <div className="px-5 py-6 text-center">
              <div className="font-mono text-3xl sm:text-4xl font-semibold text-signal text-glow tabular-nums">
                {stats.discordMembers !== null
                  ? stats.discordMembers.toLocaleString("ro-RO")
                  : "—"}
              </div>
              <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
                Membri Discord
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
