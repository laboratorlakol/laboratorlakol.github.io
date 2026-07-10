import Link from "next/link";
import Image from "next/image";
export function AuthLayout({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen flex items-center justify-center bg-void px-6 py-16 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(78,255,58,0.14),transparent_60%)]" />
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <Image src="/logo/faded-logo.png" alt="FADED" width={40} height={40} className="rounded-full" />
          <span className="font-display uppercase text-lg tracking-wide text-ink">FADED</span>
        </Link>
        <div className="panel border-glow rounded-md p-7 sm:p-8">
          <h1 className="font-display uppercase text-2xl text-center text-glow">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-ink-muted text-center">{subtitle}</p>}
          <div className="mt-7">{children}</div>
        </div>
      </div>
    </main>
  );
}
