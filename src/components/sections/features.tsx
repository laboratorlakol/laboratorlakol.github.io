"use client";
import { motion } from "framer-motion";
import { Drama, TrendingUp, Briefcase, Skull, Landmark, PartyPopper, Code2, ShieldCheck } from "lucide-react";
const FEATURES = [
  { icon:Drama, title:"Advanced Roleplay", text:"Sisteme de interacțiune profunde, scenarii și progresie reală." },
  { icon:TrendingUp, title:"Dynamic Economy", text:"Piață vie, influențată direct de activitatea jucătorilor." },
  { icon:Briefcase, title:"Player Businesses", text:"Deschide și administrează propriul business." },
  { icon:Skull, title:"Criminal Organizations", text:"Mafii și organizații cu teritorii, hierarhie și conflicte." },
  { icon:Landmark, title:"Government Systems", text:"Instituții funcționale: poliție, justiție, administrație." },
  { icon:PartyPopper, title:"Premium Events", text:"Evenimente organizate constant de echipa FADED." },
  { icon:Code2, title:"Unique Scripts", text:"Sisteme custom, dezvoltate intern, nicăieri altundeva." },
  { icon:ShieldCheck, title:"Active Staff Team", text:"Echipă prezentă, responsivă și implicată." },
];
export function Features() {
  return (
    <section id="features" className="relative bg-void px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="text-center max-w-2xl mx-auto">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-signal">Ce găsești pe server</span>
          <h2 className="font-display uppercase text-3xl sm:text-4xl mt-4">Sisteme construite pentru roleplay serios</h2>
        </div>
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f,i)=>{const I=f.icon;return(
            <motion.div key={f.title} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.4,delay:(i%4)*0.07}} whileHover={{y:-4}} className="panel rounded-md p-6 hover:border-line-strong hover:shadow-[0_0_30px_-10px_var(--glow)] transition-all">
              <I className="text-signal" size={26} strokeWidth={1.6}/>
              <h3 className="mt-4 font-mono text-sm uppercase tracking-wider">{f.title}</h3>
              <p className="mt-2 text-sm text-ink-muted leading-relaxed">{f.text}</p>
            </motion.div>
          );})}
        </div>
      </div>
    </section>
  );
}
