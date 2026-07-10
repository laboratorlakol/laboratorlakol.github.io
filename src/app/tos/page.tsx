import type { Metadata } from "next";
export const metadata: Metadata = { title: "Termeni și Condiții" };
const LAST_UPDATED = "11 iulie 2026";
export default function TosPage() {
  return (
    <main className="min-h-screen bg-void px-6 py-24">
      <div className="mx-auto max-w-2xl">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-signal">Legal</span>
        <h1 className="font-display uppercase text-3xl mt-3">Termeni și Condiții</h1>
        <p className="mt-2 text-sm text-ink-faint font-mono">Ultima actualizare: {LAST_UPDATED}</p>
        <div className="mt-10 space-y-8 text-sm text-ink-muted leading-relaxed">
          <section>
            <h2 className="text-base font-semibold text-ink mb-3">1. Acceptarea termenilor</h2>
            <p>Prin accesarea site-ului <span className="text-signal">faded.ro</span> sau conectarea pe serverul FiveM FADED Romania Roleplay, confirmi că ai citit, înțeles și acceptat în totalitate acești Termeni și Condiții. Dacă nu ești de acord cu oricare dintre prevederi, te rugăm să nu folosești serviciile noastre.</p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-ink mb-3">2. Eligibilitate</h2>
            <p>Pentru a folosi platforma FADED, trebuie să ai minimum <strong className="text-ink">16 ani</strong>. Prin crearea unui cont confirmi că îndeplinești această condiție. Conturile create de persoane sub această vârstă vor fi șterse fără notificare prealabilă.</p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-ink mb-3">3. Reguli de conduită</h2>
            <p className="mb-3">Utilizatorii platformei FADED se obligă să respecte următoarele reguli:</p>
            <ul className="list-disc ml-5 space-y-2">
              <li>Este interzis să folosești limbaj rasist, homofob, sexist sau orice formă de discurs instigator la ură, atât pe server cât și pe forum sau în tickete.</li>
              <li>Este interzisă hărțuirea altor utilizatori, fie în joc, fie pe platformele noastre online.</li>
              <li>Este interzisă distribuirea datelor personale ale altor jucători fără consimțământul explicit al acestora (doxxing).</li>
              <li>Este interzisă utilizarea de moduri, cheats, trainers sau orice alt software care oferă avantaje incorecte în joc.</li>
              <li>Este interzisă impersonarea membrilor staff-ului sau a altor jucători.</li>
              <li>Este interzisă promovarea altor servere FiveM sau platforme concurente pe canalele noastre.</li>
              <li>Roleplay-ul trebuie să fie realist și în conformitate cu regulamentul serverului publicat la <span className="text-signal">/regulament</span>.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-base font-semibold text-ink mb-3">4. Conturi și securitate</h2>
            <ul className="list-disc ml-5 space-y-2">
              <li>Fiecare persoană fizică poate deține un singur cont pe platformă. Conturile multiple sunt interzise și vor fi șterse.</li>
              <li>Ești responsabil pentru securitatea contului tău. Nu partaja credențialele cu alte persoane.</li>
              <li>FADED nu va solicita niciodată parola ta prin email, Discord sau în joc.</li>
              <li>Conturile inactive mai mult de 365 de zile pot fi șterse, cu notificare prealabilă pe email.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-base font-semibold text-ink mb-3">5. Conținut utilizator</h2>
            <p>Prin postarea de conținut pe forum, în tickete sau în orice altă secțiune a platformei, acorzi FADED o licență neexclusivă de a afișa acel conținut pe platformele noastre. Rămâi proprietarul conținutului tău, dar îți asumi responsabilitatea că acesta nu încalcă drepturile terților sau legislația în vigoare.</p>
            <p className="mt-2">Conținutul care încalcă regulile de conduită de mai sus va fi șters fără notificare, iar contul asociat poate fi suspendat sau banat.</p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-ink mb-3">6. Sancțiuni și moderare</h2>
            <p className="mb-3">Staff-ul FADED are dreptul de a aplica sancțiuni fără a fi obligat să ofere o justificare detaliată în cazurile flagrante. Sistemul de sancțiuni include:</p>
            <ul className="list-disc ml-5 space-y-1">
              <li><strong className="text-ink">Avertisment</strong> — notificare oficială fără restricții imediate.</li>
              <li><strong className="text-ink">Mute / Timeout</strong> — restricție temporară a funcționalităților de comunicare.</li>
              <li><strong className="text-ink">Ban temporar</strong> — suspendare pe o perioadă determinată.</li>
              <li><strong className="text-ink">Ban permanent</strong> — interzicerea definitivă a accesului la serviciile FADED.</li>
            </ul>
            <p className="mt-3">Contestarea sancțiunilor se poate face exclusiv prin sistemul de tickete de la <span className="text-signal">/suport</span>, în termen de 7 zile de la aplicare.</p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-ink mb-3">7. Donații și magazin</h2>
            <p>Achizițiile efectuate prin Magazinul FADED (Tebex) sunt <strong className="text-ink">nereturnabile</strong>, cu excepția cazurilor prevăzute de legislația UE privind protecția consumatorilor (Directiva 2011/83/UE). Beneficiile achiziționate sunt legate de contul tău și nu pot fi transferate. FADED își rezervă dreptul de a modifica conținutul pachetelor fără notificare prealabilă, menținând valoarea aproximativă a acestora.</p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-ink mb-3">8. Disponibilitatea serviciului</h2>
            <p>FADED nu garantează disponibilitatea continuă a serverului sau a platformei online. Ne rezervăm dreptul de a efectua perioade de mentenanță, de a modifica sau de a întrerupe serviciul, cu sau fără notificare prealabilă. Nu suntem răspunzători pentru eventualele pierderi de date sau timp de joc cauzate de întreruperi tehnice.</p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-ink mb-3">9. Proprietate intelectuală</h2>
            <p>Toate elementele originale ale platformei FADED (logo, design, scripturi custom, sisteme de joc) sunt proprietatea echipei FADED și nu pot fi reproduse, copiate sau distribuite fără acordul scris al administrației. FADED Romania Roleplay operează pe platforma FiveM și nu este afiliat cu Rockstar Games sau Take-Two Interactive.</p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-ink mb-3">10. Modificarea termenilor</h2>
            <p>Ne rezervăm dreptul de a modifica acești termeni în orice moment. Modificările semnificative vor fi anunțate cu cel puțin 7 zile înainte de intrarea în vigoare. Continuarea utilizării serviciilor după publicarea modificărilor constituie acceptarea noilor termeni.</p>
          </section>
          <section>
            <h2 className="text-base font-semibold text-ink mb-3">11. Legislație aplicabilă</h2>
            <p>Acești termeni sunt guvernați de legislația română și a Uniunii Europene. Orice litigiu va fi soluționat în instanțele competente din România, după epuizarea procedurii de soluționare amiabilă. Pentru orice nelămurire, ne poți contacta la <a href="mailto:contact@faded.ro" className="text-signal hover:underline">contact@faded.ro</a>.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
