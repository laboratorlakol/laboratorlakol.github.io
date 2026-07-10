import Link from "next/link";
import Image from "next/image";
const DEFAULT_DISCORD = "https://discord.gg/dCAZbNzvaN";
function buildColumns(discordUrl: string) {
  return [
    { title:"Server", links:[{label:"Conectează-te",href:"/login"},{label:"Creează Cont",href:"/register"},{label:"Magazin",href:"/magazin"},{label:"Regulament",href:"/regulament"}] },
    { title:"Comunitate", links:[{label:"Forum",href:"/forum"},{label:"Discord",href:discordUrl},{label:"Echipă",href:"#echipa"},{label:"Noutăți",href:"/noutati"}] },
    { title:"Aplicații", links:[{label:"Staff Application",href:"/forum"},{label:"Facțiuni",href:"/forum"},{label:"Suport / Tickets",href:"/suport"}] },
  ];
}
export function Footer({ discordUrl = DEFAULT_DISCORD }: { discordUrl?: string }) {
  const columns = buildColumns(discordUrl);
  return (
    <footer className="relative bg-void border-t border-line px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr] gap-10">
          <div>
            <div className="flex items-center gap-2.5">
              <Image src="/logo/faded-logo.png" alt="FADED Romania Roleplay" width={36} height={36} className="rounded-full" />
              <span className="font-display uppercase text-base tracking-wide text-ink">FADED</span>
            </div>
            <p className="mt-4 text-sm text-ink-faint max-w-xs">Experiența roleplay premium din România. Server FiveM construit pentru roleplay serios.</p>
            <a href="mailto:contact@faded.ro" className="inline-block mt-3 text-sm text-signal hover:underline">contact@faded.ro</a>
          </div>
          {columns.map(col=>(
            <div key={col.title}>
              <h4 className="font-mono text-xs uppercase tracking-wider text-signal">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">{col.links.map(link=><li key={link.label}><Link href={link.href} className="text-sm text-ink-muted hover:text-signal transition-colors">{link.label}</Link></li>)}</ul>
            </div>
          ))}
        </div>
        <div className="mt-14 pt-6 border-t border-line space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-faint font-mono">
            <span>© {new Date().getFullYear()} FADED ROMANIA ROLEPLAY. Toate drepturile rezervate.</span>
            <span>Acest server nu este afiliat cu Rockstar Games sau Take-Two Interactive.</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-ink-faint">
            <Link href="/privacy" className="hover:text-signal transition-colors">Politică de Confidențialitate</Link>
            <span>·</span>
            <Link href="/regulament" className="hover:text-signal transition-colors">Regulament</Link>
            <span>·</span>
            <a href="mailto:contact@faded.ro" className="hover:text-signal transition-colors">contact@faded.ro</a>
            <span>·</span>
            <span className="text-ink-faint/60">Protecția datelor în conformitate cu GDPR (UE) 2016/679</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
