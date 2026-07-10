"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
type StatKey = "playersOnline"|"discordMembers";
const FALLBACK: Record<StatKey,number|null> = { playersOnline: null, discordMembers: null };
const LABELS: Record<StatKey,string> = { playersOnline: "PLAYERS ONLINE", discordMembers: "MEMBRI DISCORD" };
function useLiveStats() {
  const [stats, setStats] = useState(FALLBACK);
  const [lastSync, setLastSync] = useState("--:--:--");
  useEffect(() => {
    async function fetchStats() {
      try {
        const [playersRes, discordRes] = await Promise.allSettled([fetch("/api/stats",{cache:"no-store"}), fetch("/api/discord-stats",{cache:"no-store"})]);
        const next = { ...FALLBACK };
        if (playersRes.status==="fulfilled" && playersRes.value.ok) { const d=await playersRes.value.json(); if(typeof d.playersOnline==="number") next.playersOnline=d.playersOnline; }
        if (discordRes.status==="fulfilled" && discordRes.value.ok) { const d=await discordRes.value.json(); if(typeof d.memberCount==="number") next.discordMembers=d.memberCount; }
        setStats(next);
      } catch {}
      finally { setLastSync(new Date().toLocaleTimeString("ro-RO")); }
    }
    const t=setTimeout(fetchStats,0); const i=setInterval(fetchStats,30000);
    return ()=>{clearTimeout(t);clearInterval(i);};
  }, []);
  return { stats, lastSync };
}
export function LiveStats() {
  const { stats, lastSync } = useLiveStats();
  const rows: StatKey[] = ["playersOnline","discordMembers"];
  return (
    <section className="relative bg-void px-6 py-20">
      <div className="mx-auto max-w-4xl">
        <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.5}} className="scanline panel border-glow rounded-md overflow-hidden">
          <div className="flex items-center justify-between border-b border-line px-5 py-3 font-mono text-xs uppercase tracking-wider text-ink-faint">
            <span className="text-signal">SERVER STATUS</span>
            <span>SYNC {lastSync}</span>
          </div>
          <div className="grid grid-cols-2 divide-x divide-line">
            {rows.map(key=>(
              <div key={key} className="px-5 py-8 text-center">
                <div className="font-mono text-4xl sm:text-5xl font-semibold text-signal text-glow tabular-nums">
                  {stats[key] !== null ? stats[key]!.toLocaleString("ro-RO") : "—"}
                </div>
                <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">{LABELS[key]}</div>
              </div>
            ))}
          </div>
          <div className="border-t border-line px-5 py-2.5 font-mono text-[11px] text-ink-faint">
            <span className="text-signal">STATUS:</span> ONLINE<span className="terminal-caret"/>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
