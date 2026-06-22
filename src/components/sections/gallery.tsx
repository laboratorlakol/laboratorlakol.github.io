"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Play, ImageIcon } from "lucide-react";

interface GalleryItem {
  type: "image" | "video";
  label: string;
  photo?: string;
}

const ITEMS: GalleryItem[] = [
  {
    type: "image",
    label: "Apus peste Los Santos",
    photo: "/gallery/sunset-city.jpg",
  },
  {
    type: "image",
    label: "Los Santos Del Perro Pier",
    photo: "/gallery/del-perro-pier.jpg",
  },
  {
    type: "image",
    label: "Benny's Garage",
    photo: "/gallery/bennys-garage.jpg",
  },
  {
    type: "image",
    label: "Roxwood — noapte",
    photo: "/gallery/roxwood.jpg",
  },
  {
    type: "image",
    label: "Facțiune — rooftop",
    photo: "/gallery/thunder.jpg",
  },
  { type: "video", label: "Highlights Roleplay" },
];

export function Gallery() {
  return (
    <section id="galerie" className="relative bg-panel px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-signal">
            Galerie
          </span>
          <h2 className="font-display uppercase text-3xl sm:text-4xl mt-4">
            Momente din Los Santos
          </h2>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ITEMS.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (i % 3) * 0.08 }}
              className="group relative aspect-[4/3] rounded-md overflow-hidden border border-line flex items-center justify-center"
            >
              {item.photo ? (
                <Image
                  src={item.photo}
                  alt={item.label}
                  fill
                  className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                />
              ) : (
                <div className="absolute inset-0 bg-[linear-gradient(135deg,#101010,#151515_50%,#0a0a0a)]" />
              )}
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(10,10,10,0.85)_100%)]" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_center,rgba(78,255,58,0.18),transparent_70%)]" />
              {!item.photo &&
                (item.type === "video" ? (
                  <Play className="relative text-signal/60 group-hover:text-signal transition-colors" size={32} />
                ) : (
                  <ImageIcon className="relative text-signal/40 group-hover:text-signal/70 transition-colors" size={32} />
                ))}
              {item.photo && item.type === "video" && (
                <Play className="relative text-signal" size={32} />
              )}
              <span className="absolute bottom-0 inset-x-0 px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-ink-muted">
                {item.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
