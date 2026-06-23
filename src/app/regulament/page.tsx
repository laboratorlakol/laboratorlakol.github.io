import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { getSiteSettings } from "@/lib/cms";

export const dynamic = "force-dynamic";

export default async function RegulamentPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center bg-void px-6 text-center">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-signal">
            Regulament
          </span>
          <h1 className="font-display uppercase text-3xl mt-4">
            Regulamentul este în curs de redactare
          </h1>
          <p className="mt-3 text-sm text-ink-muted">Revino mai târziu.</p>
        </div>
      </main>
      <Footer discordUrl={settings.discordInviteUrl} />
    </>
  );
}
