"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export interface NewsPostData {
  id: string;
  title: string;
  excerpt: string;
  category: string;
}

const CATEGORY_LABEL: Record<string, string> = {
  UPDATES: "Updates",
  EVENTS: "Events",
  ANNOUNCEMENTS: "Announcements",
  DEVELOPMENT_LOGS: "Development Logs",
};

const CATEGORY_COLOR: Record<string, string> = {
  UPDATES: "text-signal",
  EVENTS: "text-signal-bright",
  ANNOUNCEMENTS: "text-signal-dim",
  DEVELOPMENT_LOGS: "text-ink-muted",
};

export function News({ posts }: { posts: NewsPostData[] }) {
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

        {posts.length > 0 ? (
          <div className="mt-12 grid sm:grid-cols-3 gap-5">
            {posts.map((item, i) => (
              <motion.a
                key={item.id}
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
                    {CATEGORY_LABEL[item.category] ?? item.category}
                  </span>
                  <h3 className="mt-3 font-medium leading-snug">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-ink-muted line-clamp-2">
                    {item.excerpt}
                  </p>
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
        ) : (
          <p className="mt-10 text-center text-sm text-ink-faint">
            Nu sunt încă noutăți publicate.
          </p>
        )}
      </div>
    </section>
  );
}
