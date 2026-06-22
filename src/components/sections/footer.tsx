import Link from "next/link";
import Image from "next/image";

const COLUMNS = [
  {
    title: "Server",
    links: [
      { label: "Conectează-te", href: "/login" },
      { label: "Creează Cont", href: "/register" },
      { label: "Magazin", href: "/magazin" },
      { label: "Regulament", href: "/regulament" },
    ],
  },
  {
    title: "Comunitate",
    links: [
      { label: "Forum", href: "/forum" },
      { label: "Discord", href: "https://discord.gg/faded" },
      { label: "Echipă", href: "#echipa" },
      { label: "Noutăți", href: "#noutati" },
    ],
  },
  {
    title: "Aplicații",
    links: [
      { label: "Staff Application", href: "/aplicatii/staff" },
      { label: "Facțiuni", href: "/aplicatii/factiuni" },
      { label: "Suport / Tickets", href: "/suport" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative bg-void border-t border-line px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr] gap-10">
          <div>
            <Image
              src="/logo/faded-wordmark.svg"
              alt="FADED Romania Roleplay"
              width={140}
              height={30}
            />
            <p className="mt-4 text-sm text-ink-faint max-w-xs">
              Experiența roleplay premium din România. Server FiveM construit
              pentru roleplay serios.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="font-mono text-xs uppercase tracking-wider text-signal">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink-muted hover:text-signal transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-6 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-faint font-mono">
          <span>
            © {new Date().getFullYear()} FADED ROMANIA ROLEPLAY. Toate
            drepturile rezervate.
          </span>
          <span>Acest server nu este afiliat cu Rockstar Games sau Take-Two Interactive.</span>
        </div>
      </div>
    </footer>
  );
}
