import type { Metadata } from "next";
export const metadata: Metadata = { title: "Politică de Confidențialitate", robots: { index: true } };
const LAST_UPDATED = "11 iulie 2026";
const CONTACT = "contact@faded.ro";
export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-void px-6 py-24">
      <div className="mx-auto max-w-2xl">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-signal">Legal</span>
        <h1 className="font-display uppercase text-3xl mt-3">Politică de Confidențialitate</h1>
        <p className="mt-2 text-sm text-ink-faint font-mono">Ultima actualizare: {LAST_UPDATED}</p>
        <div className="mt-10 space-y-8 text-sm text-ink-muted leading-relaxed">

          <section>
            <h2 className="text-base font-semibold text-ink mb-3">1. Cine suntem și cum ne contactezi</h2>
            <p>FADED Romania Roleplay (<span className="text-signal">faded.ro</span>) este un serviciu online de tip comunitate gaming, operat în scop non-comercial pe teritoriul Uniunii Europene. În sensul Regulamentului (UE) 2016/679 (GDPR) și al Legii nr. 190/2018 privind măsurile de implementare a GDPR în România, suntem <strong className="text-ink">operatorul</strong> datelor tale cu caracter personal.</p>
            <p className="mt-2">Contact: <a href={`mailto:${CONTACT}`} className="text-signal hover:underline">{CONTACT}</a></p>
            <p className="mt-2">Autoritatea de supraveghere competentă în România este <strong className="text-ink">ANSPDCP</strong> (Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal), cu sediul în București, B-dul G-ral. Gheorghe Magheru 28-30. Website: <span className="text-signal">dataprotection.ro</span>. Ai dreptul să depui o plângere la ANSPDCP dacă consideri că drepturile tale au fost încălcate.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ink mb-3">2. Ce date colectăm și de ce</h2>
            <p className="mb-3">Colectăm exclusiv datele necesare funcționării platformei. Mai jos găsești o descriere detaliată, inclusiv temeiul juridic conform Art. 6 GDPR:</p>
            <div className="space-y-3">
              <div className="panel rounded-md p-4">
                <p className="font-medium text-ink">Adresă de email</p>
                <p className="text-xs text-ink-faint mt-1">Folosită pentru autentificare, recuperare cont și notificări esențiale. <strong className="text-ink-muted">Temei juridic:</strong> Art. 6(1)(b) GDPR — executarea unui contract (termenii de utilizare acceptați).</p>
              </div>
              <div className="panel rounded-md p-4">
                <p className="font-medium text-ink">Nume de utilizator și parolă</p>
                <p className="text-xs text-ink-faint mt-1">Username-ul este vizibil public. Parola este stocată exclusiv sub formă de hash criptografic (bcrypt, cost factor 12) — nu avem niciodată acces la parola în text clar. <strong className="text-ink-muted">Temei juridic:</strong> Art. 6(1)(b) GDPR.</p>
              </div>
              <div className="panel rounded-md p-4">
                <p className="font-medium text-ink">Adresă IP și User-Agent</p>
                <p className="text-xs text-ink-faint mt-1">Înregistrate în audit log la autentificare și acțiuni sensibile, cu scop exclusiv de securitate și prevenire a fraudelor. Păstrate maxim 90 de zile. <strong className="text-ink-muted">Temei juridic:</strong> Art. 6(1)(f) GDPR — interes legitim (securitatea platformei).</p>
              </div>
              <div className="panel rounded-md p-4">
                <p className="font-medium text-ink">ID personaj FiveM și ore jucate</p>
                <p className="text-xs text-ink-faint mt-1">Colectate opțional, doar dacă alegi să îți legi contul cu serverul FiveM folosind comanda /codsite. <strong className="text-ink-muted">Temei juridic:</strong> Art. 6(1)(a) GDPR — consimțământ explicit.</p>
              </div>
              <div className="panel rounded-md p-4">
                <p className="font-medium text-ink">Conținut generat (postări forum, tickete)</p>
                <p className="text-xs text-ink-faint mt-1">Mesajele postate public pe forum sunt vizibile oricărui vizitator. Ticketele de suport sunt private. <strong className="text-ink-muted">Temei juridic:</strong> Art. 6(1)(b) GDPR.</p>
              </div>
              <div className="panel rounded-md p-4">
                <p className="font-medium text-ink">Poză de profil și banner (URL-uri externe)</p>
                <p className="text-xs text-ink-faint mt-1">URL-uri furnizate voluntar de utilizator, stocate la noi. Imaginile sunt găzduite pe servicii terțe (ex: imgur). <strong className="text-ink-muted">Temei juridic:</strong> Art. 6(1)(a) GDPR — consimțământ.</p>
              </div>
              <div className="panel rounded-md p-4">
                <p className="font-medium text-ink">Data și ora acceptării Termenilor</p>
                <p className="text-xs text-ink-faint mt-1">Înregistrăm momentul în care ai acceptat Termenii și Condițiile, conform obligației legale de a demonstra consimțământul. <strong className="text-ink-muted">Temei juridic:</strong> Art. 6(1)(c) GDPR — obligație legală.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ink mb-3">3. Furnizori tehnici (suboperatori)</h2>
            <p className="mb-3">Colaborăm cu următorii furnizori tehnici, fiecare garantând conformitatea cu GDPR prin Acorduri de Prelucrare a Datelor (DPA):</p>
            <ul className="list-disc ml-5 space-y-2">
              <li><strong className="text-ink">Vercel Inc.</strong> (SUA) — găzduire website. Transferul datelor către SUA este acoperit de Clauzele Contractuale Standard (SCC) aprobate de Comisia Europeană (Decizia 2021/914/UE). Privacy Policy: vercel.com/legal/privacy-policy.</li>
              <li><strong className="text-ink">Neon Inc.</strong> — baza de date PostgreSQL serverless, cluster eu-central-1 (Frankfurt, Germania). Datele sunt stocate exclusiv pe teritoriul UE.</li>
              <li><strong className="text-ink">Resend Inc.</strong> (SUA) — serviciu de trimitere emailuri tranzacționale. Transfer acoperit de SCC. Emailurile conțin exclusiv date operaționale (link confirmare, resetare parolă).</li>
              <li><strong className="text-ink">Cloudflare Inc.</strong> (SUA) — protecție anti-bot (Turnstile) și CDN/DNS. Turnstile procesează date minime despre sesiunea de browser pentru a determina dacă utilizatorul este uman. Transfer acoperit de SCC și Privacy Shield successor. Privacy Policy: cloudflare.com/privacypolicy.</li>
            </ul>
            <p className="mt-3">Nu vindem, închiriem sau transferăm datele tale vreunui terț în scopuri comerciale sau publicitare.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ink mb-3">4. Cookie-uri și stocare locală</h2>
            <p className="mb-2">Folosim exclusiv cookie-uri strict necesare funcționării — nu există cookie-uri de tracking, publicitate sau analiză:</p>
            <ul className="list-disc ml-5 space-y-2">
              <li><code className="text-signal">faded_access</code> — token JWT de sesiune, expiră în 15 minute. HttpOnly, Secure, SameSite=Lax.</li>
              <li><code className="text-signal">faded_refresh</code> — token de reînnoire sesiune, expiră în 30 de zile. HttpOnly, Secure, SameSite=Lax.</li>
            </ul>
            <p className="mt-2">Preferințele de accesibilitate sunt stocate în <code className="text-signal">localStorage</code> al browserului tău — nu sunt transmise serverelor noastre și nu conțin date cu caracter personal.</p>
            <p className="mt-2">Conform Directivei 2002/58/CE (ePrivacy) și OUG nr. 13/2012, cookie-urile strict necesare nu necesită consimțământ explicit, deoarece nu pot fi dezactivate fără a afecta funcționarea serviciului.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ink mb-3">5. Perioade de retenție</h2>
            <ul className="list-disc ml-5 space-y-2">
              <li>Date cont activ: pe durata existenței contului.</li>
              <li>Date cont șters: eliminate în termen de 30 de zile, cu excepția celor pe care avem obligație legală să le păstrăm.</li>
              <li>Adrese IP din audit log: maximum 90 de zile.</li>
              <li>Emailuri tranzacționale: Resend le păstrează conform propriilor politici (verificați la resend.com).</li>
              <li>Conținut public (postări forum): poate fi reținut în formă anonimizată după ștergerea contului.</li>
              <li>Data acceptării TOS: pe durata existenței contului și 3 ani după ștergere (obligație de demonstrare a consimțământului).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ink mb-3">6. Drepturile tale conform GDPR</h2>
            <p className="mb-3">Conform Regulamentului (UE) 2016/679 și Legii nr. 190/2018, beneficiezi de următoarele drepturi:</p>
            <div className="space-y-2">
              {[
                ["Dreptul de acces (Art. 15)", "Poți solicita o copie a tuturor datelor pe care le deținem despre tine."],
                ["Dreptul la rectificare (Art. 16)", "Poți corecta datele incorecte sau incomplete (username, email)."],
                ["Dreptul la ștergere / dreptul de a fi uitat (Art. 17)", "Poți solicita ștergerea contului și a datelor asociate. Nu putem șterge datele pe care avem obligație legală să le păstrăm."],
                ["Dreptul la restricționarea prelucrării (Art. 18)", "Poți solicita suspendarea temporară a prelucrării datelor tale în anumite condiții."],
                ["Dreptul la portabilitate (Art. 20)", "Poți solicita datele tale într-un format structurat, utilizat în mod curent și citibil automat (JSON)."],
                ["Dreptul la opoziție (Art. 21)", "Poți obiecta față de prelucrarea bazată pe interesul nostru legitim."],
                ["Dreptul de a retrage consimțământul", "Poți retrage în orice moment consimțământul pentru prelucrările bazate pe Art. 6(1)(a) (legare cont FiveM, poză de profil). Retragerea nu afectează legalitatea prelucrărilor anterioare."],
              ].map(([title, desc]) => (
                <div key={title} className="panel rounded-md p-3">
                  <p className="font-medium text-ink text-xs">{title}</p>
                  <p className="text-xs text-ink-faint mt-0.5">{desc}</p>
                </div>
              ))}
            </div>
            <p className="mt-4">Pentru exercitarea oricărui drept, contactează-ne la <a href={`mailto:${CONTACT}`} className="text-signal hover:underline">{CONTACT}</a>. Răspundem în termen de <strong className="text-ink">30 de zile calendaristice</strong>. Dacă nu ești mulțumit de răspuns, poți depune plângere la <strong className="text-ink">ANSPDCP</strong> (dataprotection.ro) sau la o instanță judecătorească competentă.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ink mb-3">7. Securitatea datelor</h2>
            <p>Aplicăm măsuri tehnice și organizatorice adecvate conform Art. 32 GDPR pentru a proteja datele tale:</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Transmitere exclusiv prin HTTPS/TLS (HSTS activat).</li>
              <li>Parole hashed cu bcrypt (cost factor 12).</li>
              <li>Tokens JWT cu durată scurtă de viață (15 minute).</li>
              <li>Cookie-uri HttpOnly și Secure — inaccesibile prin JavaScript.</li>
              <li>Rate limiting pe toate endpoint-urile de autentificare.</li>
              <li>Protecție anti-bot (Cloudflare Turnstile) la înregistrare și autentificare.</li>
              <li>Audit log pentru acțiuni sensibile.</li>
            </ul>
            <p className="mt-3">Cu toate acestea, nicio metodă de transmitere sau stocare electronică nu este 100% sigură. <strong className="text-ink">Nu putem garanta securitatea absolută a datelor transmise prin internet.</strong> Dacă devii conștient de o breșă de securitate, te rugăm să ne anunți imediat la {CONTACT}.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ink mb-3">8. Transferuri internaționale</h2>
            <p>Unii furnizori tehnici sunt stabiliți în SUA (Vercel, Resend, Cloudflare). Transferurile sunt efectuate cu garanții adecvate conform Cap. V GDPR, respectiv prin Clauze Contractuale Standard (SCC) adoptate prin Decizia Comisiei 2021/914/UE. Poți solicita o copie a acestor garanții la {CONTACT}.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ink mb-3">9. Minori</h2>
            <p>Serviciile FADED sunt destinate persoanelor cu vârsta de minimum 16 ani. Conform Art. 8 GDPR și Legii nr. 190/2018 Art. 6, prelucrarea datelor minorilor sub 16 ani necesită consimțământul părintelui sau al tutorelui legal. Dacă ai cunoștință că un minor sub 16 ani și-a creat un cont fără consimțământul parental, te rugăm să ne contactezi la {CONTACT} pentru ștergerea imediată.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ink mb-3">10. Declinarea răspunderii</h2>
            <p className="mb-2">FADED Romania Roleplay nu își asumă răspunderea pentru:</p>
            <ul className="list-disc ml-5 space-y-2">
              <li>Datele pe care le furnizezi voluntar altor utilizatori în cadrul activităților de roleplay sau pe forum.</li>
              <li>Conținutul postat de utilizatori pe forum sau în alte secțiuni publice ale platformei.</li>
              <li>Breșe de securitate cauzate de factori externi controlului nostru rezonabil (atacuri cibernetice sofisticate, vulnerabilități zero-day ale furnizorilor terți).</li>
              <li>Datele personale pe care le dezvălui voluntar în joc (în cadrul scenariilor de roleplay), pe platforme externe (Discord, social media) sau altor jucători.</li>
              <li>Prelucrarea datelor de către Rockstar Games, Take-Two Interactive sau platforma FiveM — acestea sunt entități independente cu propriile politici de confidențialitate.</li>
              <li>Pierderi indirecte, incidentale sau consecvente rezultate din utilizarea serviciilor noastre, în măsura permisă de legislația aplicabilă.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ink mb-3">11. Modificări ale politicii</h2>
            <p>Putem actualiza această politică periodic. Modificările semnificative vor fi comunicate prin email sau prin anunț pe site cu cel puțin 14 zile înainte de intrarea în vigoare. Data ultimei actualizări este afișată în antetul acestui document. Continuarea utilizării serviciilor după intrarea în vigoare a modificărilor constituie acceptarea noii politici.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ink mb-3">12. Contact și plângeri</h2>
            <p>Pentru orice întrebare, solicitare sau plângere legată de prelucrarea datelor tale personale:</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Email: <a href={`mailto:${CONTACT}`} className="text-signal hover:underline">{CONTACT}</a></li>
              <li>Sistem tickete: <span className="text-signal">faded.ro/suport</span></li>
              <li>ANSPDCP (autoritate de supraveghere): <span className="text-signal">dataprotection.ro</span> — B-dul G-ral. Gheorghe Magheru 28-30, Sector 1, București</li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
