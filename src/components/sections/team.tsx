"use client";

import { motion } from "framer-motion";

const TEAM = [
  { name: "—", role: "Fondator" },
  { name: "—", role: "Co-Fondator" },
  { name: "—", role: "Manager" },
  { name: "—", role: "Head Staff" },
  { name: "—", role: "Staff" },
  { name: "—", role: "Staff" },
];

function initials(name: string) {
  if (name === "—") return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Team() {
  return (
    <section id="echipa" className="relative bg-void px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="text-center max-w-2xl mx-auto">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-signal">
            Echipa
          </span>
          <h2 className="font-display uppercase text-3xl sm:text-4xl mt-4">
            Oamenii din spatele serverului
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
          {TEAM.map((member, i) => (
            <motion.div
              key={`${member.role}-${i}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (i % 6) * 0.06 }}
              className="panel rounded-md p-5 text-center"
            >
              <div className="mx-auto h-14 w-14 rounded-full border border-line flex items-center justify-center font-mono text-signal">
                {initials(member.name)}
              </div>
              <p className="mt-3 text-sm font-medium">{member.name}</p>
              <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-signal">
                {member.role}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
