"use client";
import { motion } from "framer-motion";
import Image from "next/image";
const ITEMS = [
  { label:"Apus peste Los Santos", photo:"/gallery/sunset-city.jpg" },
  { label:"Los Santos Del Perro Pier", photo:"/gallery/del-perro-pier.jpg" },
  { label:"Roxwood — noapte", photo:"/gallery/roxwood.jpg" },
];
export function Gallery() {
  return (
    <section id="galerie" className="relative bg-panel px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-signal">Galerie</span>
            <h2 className="font-display uppercase text-3xl sm:text-4xl mt-4">Momente din Los Santos</h2>
          </div>
        </div>
        <div className="mt-12 grid sm:grid-cols-3 gap-5">
          {ITEMS.map((item,i)=>(
            <motion.div key={item.label} initial={{opacity:0,scale:0.97}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} transition={{duration:0.4,delay:i*0.08}} className="group relative aspect-[4/3] rounded-md overflow-hidden border border-line">
              {item.photo && <Image src={item.photo} alt={item.label} fill className="object-cover group-hover:scale-105 transition-transform duration-700"/>}
              <div className="absolute inset-0 bg-void/30 group-hover:bg-void/10 transition-colors"/>
              <span className="absolute bottom-0 inset-x-0 bg-void/80 backdrop-blur-sm px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-ink-muted">{item.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
