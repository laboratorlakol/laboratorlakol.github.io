"use client";

import { motion } from "framer-motion";
import { Play, ImageIcon } from "lucide-react";

const ITEMS = [
  { type: "image", label: "Los Santos // Nightlife" },
  { type: "video", label: "Eveniment Premium — Recap" },
  { type: "image", label: "Sediu Facțiune" },
  { type: "image", label: "Business Player-Owned" },
  { type: "video", label: "Highlights Roleplay" },
  { type: "image", label: "Patrulă Poliție" },
];

export function Gallery() {
  return (
    <section id="galerie" className="relative bg-panel px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-signal">
              Galerie
            </span>
            <h2 className="font-display uppercase text-3xl sm:text-4xl mt-4">
              Momente din Los Santos
            </h2>
          </div>
          <p className="text-sm text-ink-faint max-w-xs">
            Conținut administrabil din CMS — imaginile de mai jos sunt
            substitute de prezentare.
          </p>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ITEMS.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (i % 3) * 0.08 }}
              className="group relative aspect-[4/3] rounded-md overflow-hidden border border-line bg-[linear-gradient(135deg,#101010,#151515_50%,#0a0a0a)] flex items-center justify-center"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_center,rgba(78,255,58,0.18),transparent_70%)]" />
              {item.type === "video" ? (
                <Play className="text-signal/60 group-hover:text-signal transition-colors" size={32} />
              ) : (
                <ImageIcon className="text-signal/40 group-hover:text-signal/70 transition-colors" size={32} />
              )}
              <span className="absolute bottom-0 inset-x-0 bg-void/80 backdrop-blur-sm px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-ink-muted">
                {item.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
