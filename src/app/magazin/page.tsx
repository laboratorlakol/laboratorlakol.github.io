import { redirect } from "next/navigation";
import { getSiteSettings } from "@/lib/cms";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";

export default async function MagazinPage() {
  const settings = await getSiteSettings();

  if (settings.tebexUrl) {
    redirect(settings.tebexUrl);
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center bg-void px-6 text-center">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-signal">
            Magazin
          </span>
          <h1 className="font-display uppercase text-3xl mt-4">
            Magazinul este în curs de configurare
          </h1>
          <p className="mt-3 text-sm text-ink-muted">Revino mai târziu.</p>
        </div>
      </main>
      <Footer discordUrl={settings.discordInviteUrl} />
    </>
  );
}
