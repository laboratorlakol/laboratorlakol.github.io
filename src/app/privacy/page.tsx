import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politică de Confidențialitate",
  robots: { index: false },
};

const CONTACT_EMAIL = "contact@faded.ro";
const LAST_UPDATED = "10 iulie 2026";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-void px-6 py-24">
      <div className="mx-auto max-w-2xl">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-signal">
          Legal
        </span>
        <h1 className="font-display uppercase text-3xl mt-3">
          Politică de Confidențialitate
        </h1>
        <p className="mt-2 text-sm text-ink-faint font-mono">
          Ultima actualizare: {LAST_UPDATED}
        </p>

        <div className="mt-10 space-y-8 text-sm text-ink-muted leading-relaxed">
          <section>
            <h2 className="text-base font-semibold text-ink mb-2">
              1. Cine suntem
            </h2>
            <p>
              FADED Romania Roleplay este un server de joc FiveM operat în scop
              non-comercial, accesibil la{" "}
              <span className="text-signal">faded.ro</span>. Ne puteți contacta
              la{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-signal hover:underline"
              >
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ink mb-2">
              2. Ce date colectăm
            </h2>
            <p>Colectăm exclusiv datele necesare funcționării platformei:</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>
                <strong className="text-ink">Adresă de email</strong> — pentru
                autentificare și notificări de cont (resetare parolă,
                confirmare).
              </li>
              <li>
                <strong className="text-ink">Nume de utilizator</strong> — ales
                de tine la înregistrare, vizibil public pe forum și în profil.
              </li>
              <li>
                <strong className="text-ink">Parolă (hash)</strong> — stocată
                exclusiv în formă criptată (bcrypt). Nu avem acces la parola în
                text clar.
              </li>
              <li>
                <strong className="text-ink">Adresă IP</strong> — înregistrată
                la autentificare în audit log, cu scop de securitate. Nu este
                partajată cu terți.
              </li>
              <li>
                <strong className="text-ink">ID personaj FiveM</strong> — dacă
                alegi să legi contul de site cu personajul din joc prin comanda{" "}
                <code className="text-signal">/codsite</code>.
              </li>
              <li>
                <strong className="text-ink">Conținut postat</strong> — mesaje
                pe forum, tickete de suport, subiecte create.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ink mb-2">
              3. Cum folosim datele
            </h2>
            <ul className="list-disc ml-5 space-y-1">
              <li>Autentificare și gestionarea contului tău.</li>
              <li>Comunicare legată de cont (emailuri de confirmare/resetare).</li>
              <li>
                Funcționarea forumului și sistemului de suport (tickete).
              </li>
              <li>
                Securitate: detectarea activității suspecte, prevenirea
                abuzurilor.
              </li>
            </ul>
            <p className="mt-2">
              Nu folosim datele tale pentru publicitate, nu le vindem și nu le
              transmitem unor terți, cu excepția furnizorilor tehnici de mai jos.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ink mb-2">
              4. Furnizori tehnici terți
            </h2>
            <ul className="list-disc ml-5 space-y-1">
              <li>
                <strong className="text-ink">Vercel</strong> — găzduire
                website. Poate procesa IP-ul tău la nivel de infrastructură.
              </li>
              <li>
                <strong className="text-ink">Neon</strong> — baza de date
                (PostgreSQL serverless). Datele sunt stocate în UE (eu-central-1).
              </li>
              <li>
                <strong className="text-ink">Resend</strong> — trimitere
                emailuri tranzacționale.
              </li>
              <li>
                <strong className="text-ink">
                  Cloudflare Turnstile
                </strong>{" "}
                — verificare anti-bot la autentificare/înregistrare. Cloudflare
                poate procesa date anonime despre sesiunea de browser.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ink mb-2">
              5. Cookie-uri
            </h2>
            <p>
              Site-ul folosește exclusiv cookie-uri funcționale, necesare
              autentificării:
            </p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>
                <code className="text-signal">faded_access</code> — token de
                sesiune (15 minute). Marcat HttpOnly, Secure, SameSite=Lax.
              </li>
              <li>
                <code className="text-signal">faded_refresh</code> — token de
                reînnoire sesiune (30 zile). Marcat HttpOnly, Secure,
                SameSite=Lax.
              </li>
            </ul>
            <p className="mt-2">
              Nu folosim cookie-uri de tracking, publicitate sau analiză.
              Preferințele de accesibilitate sunt stocate local în browser
              (localStorage), nu pe serverele noastre.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ink mb-2">
              6. Drepturile tale (GDPR)
            </h2>
            <p>
              Conform Regulamentului (UE) 2016/679 (GDPR), ai următoarele
              drepturi:
            </p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>
                <strong className="text-ink">Acces</strong> — poți solicita o
                copie a datelor tale.
              </li>
              <li>
                <strong className="text-ink">Rectificare</strong> — poți
                corecta date incorecte.
              </li>
              <li>
                <strong className="text-ink">Ștergere</strong> — poți solicita
                ștergerea contului și a datelor asociate.
              </li>
              <li>
                <strong className="text-ink">Portabilitate</strong> — poți
                solicita datele tale într-un format structurat.
              </li>
              <li>
                <strong className="text-ink">Opoziție</strong> — poți obiecta
                împotriva procesării datelor tale.
              </li>
            </ul>
            <p className="mt-2">
              Pentru orice solicitare, contactează-ne la{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-signal hover:underline"
              >
                {CONTACT_EMAIL}
              </a>
              . Vom răspunde în termen de 30 de zile.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ink mb-2">
              7. Retenție date
            </h2>
            <p>
              Datele contului sunt păstrate cât timp contul este activ. La
              ștergerea contului, datele personale sunt eliminate în termen de
              30 de zile. Conținutul public (postări pe forum) poate fi reținut
              în formă anonimizată.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ink mb-2">
              8. Modificări ale politicii
            </h2>
            <p>
              Orice modificare importantă va fi anunțată pe site cu cel puțin 7
              zile înainte. Continuarea utilizării site-ului după această
              perioadă constituie acceptarea noilor termeni.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ink mb-2">
              9. Contact
            </h2>
            <p>
              Pentru orice întrebare legată de confidențialitate, ne contactezi
              la:{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-signal hover:underline"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
