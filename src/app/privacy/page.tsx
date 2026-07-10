import type { Metadata } from "next";
export const metadata: Metadata = { title: "Politică de Confidențialitate", robots: { index: false } };
const CONTACT = "contact@faded.ro";
const LAST_UPDATED = "10 iulie 2026";
export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-void px-6 py-24">
      <div className="mx-auto max-w-2xl">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-signal">Legal</span>
        <h1 className="font-display uppercase text-3xl mt-3">Politică de Confidențialitate</h1>
        <p className="mt-2 text-sm text-ink-faint font-mono">Ultima actualizare: {LAST_UPDATED}</p>
        <div className="mt-10 space-y-8 text-sm text-ink-muted leading-relaxed">
          <section><h2 className="text-base font-semibold text-ink mb-2">1. Cine suntem</h2><p>FADED Romania Roleplay este un server de joc FiveM, accesibil la <span className="text-signal">faded.ro</span>. Contact: <a href={`mailto:${CONTACT}`} className="text-signal hover:underline">{CONTACT}</a>.</p></section>
          <section><h2 className="text-base font-semibold text-ink mb-2">2. Ce date colectăm</h2><ul className="list-disc ml-5 mt-2 space-y-1"><li><strong className="text-ink">Adresă de email</strong> — autentificare și notificări.</li><li><strong className="text-ink">Nume de utilizator</strong> — ales la înregistrare, vizibil public.</li><li><strong className="text-ink">Parolă (hash)</strong> — stocată exclusiv criptat (bcrypt).</li><li><strong className="text-ink">Adresă IP</strong> — în audit log, cu scop de securitate.</li><li><strong className="text-ink">ID personaj FiveM</strong> — dacă legi contul cu /codsite.</li><li><strong className="text-ink">Conținut postat</strong> — mesaje forum, tickete.</li></ul></section>
          <section><h2 className="text-base font-semibold text-ink mb-2">3. Cum folosim datele</h2><ul className="list-disc ml-5 space-y-1"><li>Autentificare și gestionarea contului.</li><li>Comunicare (emailuri de confirmare/resetare).</li><li>Funcționarea forumului și sistemului de suport.</li><li>Securitate: detectarea activității suspecte.</li></ul><p className="mt-2">Nu folosim datele pentru publicitate, nu le vindem și nu le transmitem terților, cu excepția furnizorilor tehnici de mai jos.</p></section>
          <section><h2 className="text-base font-semibold text-ink mb-2">4. Furnizori tehnici</h2><ul className="list-disc ml-5 space-y-1"><li><strong className="text-ink">Vercel</strong> — găzduire website.</li><li><strong className="text-ink">Neon</strong> — baza de date (eu-central-1).</li><li><strong className="text-ink">Resend</strong> — emailuri tranzacționale.</li><li><strong className="text-ink">Cloudflare Turnstile</strong> — verificare anti-bot.</li></ul></section>
          <section><h2 className="text-base font-semibold text-ink mb-2">5. Cookie-uri</h2><p>Site-ul folosește exclusiv cookie-uri funcționale: <code className="text-signal">faded_access</code> (15 min) și <code className="text-signal">faded_refresh</code> (30 zile). Nu folosim cookie-uri de tracking.</p></section>
          <section><h2 className="text-base font-semibold text-ink mb-2">6. Drepturile tale (GDPR)</h2><p>Ai dreptul de acces, rectificare, ștergere, portabilitate și opoziție. Scrie-ne la <a href={`mailto:${CONTACT}`} className="text-signal hover:underline">{CONTACT}</a>. Răspundem în termen de 30 de zile.</p></section>
          <section><h2 className="text-base font-semibold text-ink mb-2">7. Contact</h2><p><a href={`mailto:${CONTACT}`} className="text-signal hover:underline">{CONTACT}</a></p></section>
        </div>
      </div>
    </main>
  );
}
