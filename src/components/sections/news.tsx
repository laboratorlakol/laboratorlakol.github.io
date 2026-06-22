"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const NEWS = [
  {
    category: "Updates",
    title: "Sezonul curent: ce s-a schimbat în economie",
  },
  {
    category: "Events",
    title: "Eveniment premium programat în acest weekend",
  },
  {
    category: "Development Logs",
    title: "Note de dezvoltare: sisteme custom în lucru",
  },
];

const CATEGORY_COLOR: Record<string, string> = {
  Updates: "text-signal",
  Events: "text-signal-bright",
  Announcements: "text-signal-dim",
  "Development Logs": "text-ink-muted",
};

export function News() {
  return (
    <section id="noutati" className="relative bg-panel px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-signal">
              Noutăți
            </span>
            <h2 className="font-display uppercase text-3xl sm:text-4xl mt-4">
              Ultimele actualizări
            </h2>
          </div>
        </div>

        <div className="mt-12 grid sm:grid-cols-3 gap-5">
          {NEWS.map((item, i) => (
            <motion.a
              key={item.title}
              href="/noutati"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="panel rounded-md p-6 flex flex-col justify-between hover:border-line-strong transition-colors group"
            >
              <div>
                <span
                  className={`font-mono text-[10px] uppercase tracking-[0.18em] ${
                    CATEGORY_COLOR[item.category] ?? "text-signal"
                  }`}
                >
                  {item.category}
                </span>
                <h3 className="mt-3 font-medium leading-snug">
                  {item.title}
                </h3>
              </div>
              <div className="mt-5 flex items-center justify-end text-xs text-ink-faint font-mono">
                <ArrowUpRight
                  size={16}
                  className="text-signal opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
