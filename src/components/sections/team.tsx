"use client";
import { motion } from "framer-motion";
import Image from "next/image";
export interface TeamMemberData { id: string; name: string; role: string; avatarUrl: string|null; }
function initials(name: string) { return name.split(" ").filter(Boolean).map(n=>n[0]).join("").slice(0,2).toUpperCase(); }
export function Team({ members }: { members: TeamMemberData[] }) {
  return (
    <section id="echipa" className="relative bg-void px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="text-center max-w-2xl mx-auto">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-signal">Echipa</span>
          <h2 className="font-display uppercase text-3xl sm:text-4xl mt-4">Oamenii din spatele serverului</h2>
        </div>
        {members.length > 0 ? (
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
            {members.map((m,i)=>(
              <motion.div key={m.id} initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.4,delay:(i%6)*0.06}} className="panel rounded-md p-5 text-center">
                {m.avatarUrl ? <Image src={m.avatarUrl} alt={m.name} width={56} height={56} className="mx-auto h-14 w-14 rounded-full object-cover border border-line"/> : <div className="mx-auto h-14 w-14 rounded-full border border-line flex items-center justify-center font-mono text-signal">{initials(m.name)}</div>}
                <p className="mt-3 text-sm font-medium">{m.name}</p>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-signal">{m.role}</p>
              </motion.div>
            ))}
          </div>
        ) : <p className="mt-10 text-center text-sm text-ink-faint">Echipa va fi afișată aici în curând.</p>}
      </div>
    </section>
  );
}
