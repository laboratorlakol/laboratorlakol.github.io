"use client";
import { motion } from "framer-motion";
const PILLARS = [
  { title:"Economie realistă", text:"Prețuri, salarii și piețe care reacționează la deciziile jucătorilor." },
  { title:"Roleplay serios", text:"Reguli clare, staff activ și o comunitate care construiește povești." },
  { title:"Facțiuni & mafii", text:"Teritorii, alianțe și conflicte care evoluează organic." },
  { title:"Business-uri proprii", text:"De la firme mici la imperii economice, administrate de jucători." },
];
export function About() {
  return (
    <section id="despre" className="relative bg-panel px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-14 items-start">
          <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.5}}>
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-signal">Despre FADED</span>
            <h2 className="font-display uppercase text-3xl sm:text-4xl mt-4 leading-tight">Un oraș care nu se oprește când tu te deconectezi</h2>
            <p className="mt-5 text-ink-muted leading-relaxed">FADED Romania Roleplay este construit pentru jucători care vor mai mult decât un server FiveM obișnuit — sisteme custom, evenimente organizate constant și o echipă de staff prezentă activ.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-5">
            {PILLARS.map((p,i)=>(
              <motion.div key={p.title} initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.45,delay:i*0.08}} className="panel rounded-md p-6 hover:border-line-strong transition-colors">
                <h3 className="font-mono text-sm uppercase tracking-wider text-signal">{p.title}</h3>
                <p className="mt-3 text-sm text-ink-muted leading-relaxed">{p.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
