import type { Metadata } from "next";
export const metadata: Metadata = { title: "Termeni și Condiții" };
const LAST_UPDATED = "11 iulie 2026";
const CONTACT = "contact@faded.ro";
export default function TosPage() {
  return (
    <main className="min-h-screen bg-void px-6 py-24">
      <div className="mx-auto max-w-2xl">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-signal">Legal</span>
        <h1 className="font-display uppercase text-3xl mt-3">Termeni și Condiții</h1>
        <p className="mt-2 text-sm text-ink-faint font-mono">Ultima actualizare: {LAST_UPDATED}</p>
        <p className="mt-4 text-sm text-ink-muted leading-relaxed">Acești Termeni și Condiții reglementează accesul și utilizarea platformei online <span className="text-signal">faded.ro</span> și a serviciilor asociate, inclusiv serverul FiveM FADED Romania Roleplay, forumul comunității, sistemul de suport și orice alt serviciu operat sub brandul FADED. Documentul a fost redactat în conformitate cu legislația română și europeană aplicabilă.</p>

        <div className="mt-10 space-y-8 text-sm text-ink-muted leading-relaxed">

          <section>
            <h2 className="text-base font-semibold text-ink mb-3">1. Definiții</h2>
            <ul className="list-disc ml-5 space-y-2">
              <li><strong className="text-ink">&quot;Platforma&quot;</strong> — ansamblul serviciilor online disponibile la faded.ro, inclusiv site-ul web, forumul, sistemul de tickete și conturile de utilizator.</li>
              <li><strong className="text-ink">&quot;Serverul&quot;</strong> — serverul de joc FiveM operat de FADED Romania Roleplay.</li>
              <li><strong className="text-ink">&quot;Utilizator&quot; / &quot;Tu&quot;</strong> — orice persoană fizică care accesează Platforma sau Serverul.</li>
              <li><strong className="text-ink">&quot;FADED&quot; / &quot;Noi&quot;</strong> — echipa care operează FADED Romania Roleplay.</li>
              <li><strong className="text-ink">&quot;Conținut utilizator&quot;</strong> — orice text, imagine, mesaj sau alt material publicat de utilizator pe Platformă.</li>
              <li><strong className="text-ink">&quot;Servicii premium&quot;</strong> — beneficii achiziționate prin Magazinul FADED (Tebex).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ink mb-3">2. Acceptarea termenilor</h2>
            <p>Prin crearea unui cont pe Platformă, prin accesarea Serverului sau prin simpla navigare pe site, confirmi că ai citit, înțeles și ești de acord cu acești Termeni și Condiții, cu Politica de Confidențialitate și cu Regulamentul Serverului. Dacă nu ești de acord cu oricare dintre prevederi, nu ai dreptul să utilizezi serviciile noastre.</p>
            <p className="mt-2">Acești termeni constituie un contract juridic valabil între tine și FADED Romania Roleplay, în conformitate cu Legea nr. 365/2002 privind comerțul electronic și Legea nr. 455/2001 privind semnătura electronică.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ink mb-3">3. Eligibilitate și vârsta minimă</h2>
            <p>Serviciile FADED sunt destinate exclusiv persoanelor cu vârsta de minimum <strong className="text-ink">16 ani</strong>, în conformitate cu Art. 8 din Regulamentul (UE) 2016/679 (GDPR) și Legea nr. 190/2018. Prin crearea unui cont, declari pe propria răspundere că ai împlinit această vârstă.</p>
            <p className="mt-2">Utilizatorii cu vârsta între 16 și 18 ani sunt considerați minori conform Codului Civil Român și, deși pot accesa serviciile noastre, li se recomandă informarea părinților sau tutorilor legali. FADED nu este răspunzător pentru utilizarea serviciilor de către persoane care furnizează date de vârstă false.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ink mb-3">4. Crearea și gestionarea contului</h2>
            <ul className="list-disc ml-5 space-y-2">
              <li>Fiecare persoană fizică poate deține un singur cont activ. Conturile multiple (multi-accounting) sunt strict interzise și vor fi șterse fără notificare.</li>
              <li>Ești responsabil pentru securitatea credențialelor contului tău. Nu ai voie să partajezi parola cu alte persoane.</li>
              <li>Dacă bănuiești că contul tău a fost compromis, trebuie să ne anunți imediat la {CONTACT} și să îți schimbi parola.</li>
              <li>FADED nu va solicita niciodată parola ta prin email, Discord, în joc sau prin orice alt canal.</li>
              <li>Conturile inactive mai mult de 365 de zile consecutive pot fi șterse, cu notificare prealabilă prin email.</li>
              <li>Ne rezervăm dreptul de a refuza crearea unui cont sau de a șterge conturi existente care încalcă acești termeni.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ink mb-3">5. Reguli de conduită</h2>
            <p className="mb-3">Utilizând serviciile FADED, te obligi să respecți următoarele reguli, atât pe server cât și pe platformele online ale comunității:</p>
            <div className="space-y-3">
              <div className="panel rounded-md p-4">
                <p className="font-medium text-ink">Discurs și comunicare</p>
                <p className="text-xs text-ink-faint mt-1">Este strict interzis limbajul rasist, xenofob, sexist, homofob, discriminatoriu pe criterii etnice, religioase, de handicap sau de altă natură. Sunt interzise amenințările, hărțuirea și bullying-ul față de orice participant la comunitate. Aceste interdicții respectă prevederile OG nr. 137/2000 privind prevenirea și sancționarea tuturor formelor de discriminare și Legii nr. 15/2021 privind hărțuirea online.</p>
              </div>
              <div className="panel rounded-md p-4">
                <p className="font-medium text-ink">Confidențialitate și date personale</p>
                <p className="text-xs text-ink-faint mt-1">Este interzisă distribuirea datelor personale ale altor utilizatori fără consimțământul explicit al acestora (doxxing), inclusiv adrese, numere de telefon, fotografii personale sau orice altă informație de identificare. Această interdicție respectă prevederile GDPR și ale Legii nr. 190/2018.</p>
              </div>
              <div className="panel rounded-md p-4">
                <p className="font-medium text-ink">Securitate și integritate</p>
                <p className="text-xs text-ink-faint mt-1">Este interzisă utilizarea de cheats, trainers, exploits, scripturi neautorizate sau orice altă metodă care oferă avantaje incorecte față de alți jucători. Este interzisă orice tentativă de acces neautorizat la sistemele FADED (hacking). Aceste fapte pot constitui infracțiuni conform Legii nr. 161/2003 privind combaterea criminalității informatice.</p>
              </div>
              <div className="panel rounded-md p-4">
                <p className="font-medium text-ink">Conținut ilegal sau dăunător</p>
                <p className="text-xs text-ink-faint mt-1">Este interzisă postarea de conținut pornografic, violent sau explicit, de materiale care încalcă drepturile de autor, de spam sau de publicitate nesolicitată. Este interzisă promovarea activităților ilegale. Respectăm Legea nr. 148/2000 privind publicitatea și Regulamentul DSA (Digital Services Act, Regulamentul UE 2022/2065).</p>
              </div>
              <div className="panel rounded-md p-4">
                <p className="font-medium text-ink">Roleplay și interacțiuni în joc</p>
                <p className="text-xs text-ink-faint mt-1">Toate interacțiunile în joc trebuie să respecte Regulamentul Serverului disponibil la faded.ro/regulament. Roleplay-ul trebuie să fie realist și matur. Este interzisă impersonarea membrilor staff-ului, a forțelor de ordine reale sau a altor jucători.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ink mb-3">6. Conținut generat de utilizatori</h2>
            <p>Prin publicarea de conținut pe platformele FADED (forum, tickete, mesaje), acorzi FADED o licență neexclusivă, gratuită, perpetuă și transferabilă de a afișa, distribui și adapta acel conținut în scopul operării serviciilor. Rămâi proprietarul conținutului, dar îți asumi întreaga responsabilitate pentru acesta.</p>
            <p className="mt-2">Declari că orice conținut publicat este original, nu încalcă drepturile de autor ale terților și nu contravine legislației aplicabile. FADED respectă prevederile Directivei (UE) 2019/790 privind dreptul de autor și drepturile conexe și va răspunde prompt la notificările de tip DMCA/take-down.</p>
            <p className="mt-2"><strong className="text-ink">FADED nu este responsabil pentru conținutul publicat de utilizatori</strong> și nu garantează acuratețea, completitudinea sau legalitatea acestuia. Ne rezervăm dreptul de a elimina orice conținut care încalcă acești termeni sau legislația aplicabilă, fără notificare prealabilă.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ink mb-3">7. Sistem de sancțiuni și moderare</h2>
            <p className="mb-3">Staff-ul FADED aplică sancțiuni în mod discreționat, proporțional cu gravitatea încălcării. Sistemul de sancțiuni include, dar nu se limitează la:</p>
            <ul className="list-disc ml-5 space-y-2">
              <li><strong className="text-ink">Avertisment</strong> — notificare oficială, documentată în sistemul nostru.</li>
              <li><strong className="text-ink">Mute / Restricție de comunicare</strong> — restricționarea temporară a dreptului de a posta sau comunica.</li>
              <li><strong className="text-ink">Kick / Timeout</strong> — eliminarea temporară de pe server sau din comunitate.</li>
              <li><strong className="text-ink">Ban temporar</strong> — suspendarea accesului pe o perioadă determinată (24h – 30 zile).</li>
              <li><strong className="text-ink">Ban permanent</strong> — interzicerea definitivă a accesului la toate serviciile FADED, inclusiv la contul de pe site.</li>
            </ul>
            <p className="mt-3">Sancțiunile pot fi aplicate pentru orice comportament care, în opinia staff-ului, prejudiciază comunitatea sau experiența altor jucători, chiar dacă nu este explicit menționat în acești termeni. Deciziile staff-ului sunt finale în absența unei contestații formale.</p>
            <p className="mt-2">Contestarea sancțiunilor se face exclusiv prin sistemul de tickete de la <span className="text-signal">faded.ro/suport</span>, în termen de 7 zile calendaristice de la aplicarea sancțiunii. Contestațiile depuse după această perioadă nu vor fi luate în considerare.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ink mb-3">8. Donații și servicii premium</h2>
            <p>Serviciile premium achiziționate prin Magazinul FADED (operat prin Tebex) sunt supuse următoarelor condiții:</p>
            <ul className="list-disc ml-5 mt-2 space-y-2">
              <li><strong className="text-ink">Caracter de donație voluntară:</strong> Achizițiile reprezintă donații voluntare pentru susținerea comunității, în schimbul cărora se acordă beneficii digitale fără valoare monetară intrinsecă.</li>
              <li><strong className="text-ink">Politica de retur:</strong> Achizițiile sunt în general <strong className="text-ink">nereturnabile</strong>. Conform Art. 16(a) din Directiva 2011/83/UE privind drepturile consumatorilor, dreptul de retragere de 14 zile nu se aplică conținutului digital livrat imediat, dacă utilizatorul și-a dat consimțământul explicit înainte de livrare. Prin finalizarea achiziției, ești informat și ești de acord cu această clauză.</li>
              <li><strong className="text-ink">Excepții:</strong> Vom procesa returnul doar în cazul unor erori tehnice dovedite din vina noastră sau al unor circumstanțe excepționale prevăzute de legislația română (OG 21/1992 privind protecția consumatorilor).</li>
              <li><strong className="text-ink">Modificarea beneficiilor:</strong> Ne rezervăm dreptul de a modifica sau înlocui conținutul pachetelor premium, menținând valoarea globală a acestora. Nu garantăm disponibilitatea perpetuă a beneficiilor achiziționate în cazul încetării serviciului.</li>
              <li><strong className="text-ink">Pierderea beneficiilor:</strong> Banul permanent din cauza încălcării termenilor atrage pierderea tuturor beneficiilor premium, fără drept la compensare.</li>
            </ul>
            <p className="mt-3">Pentru dispute legate de achiziții, poți contacta ANPC (Autoritatea Națională pentru Protecția Consumatorilor) sau platforma europeană de soluționare online a litigiilor (ec.europa.eu/consumers/odr).</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ink mb-3">9. Proprietate intelectuală</h2>
            <p>Toate elementele originale ale Platformei FADED — inclusiv dar fără a se limita la: logo, design vizual, scripturi custom, sisteme de joc, texte, grafică — sunt proprietatea intelectuală a echipei FADED și sunt protejate de Legea nr. 8/1996 privind dreptul de autor și drepturile conexe.</p>
            <p className="mt-2">Este interzisă reproducerea, copierea, distribuirea, modificarea sau utilizarea comercială a oricărui element al Platformei fără acordul scris prealabil al administrației FADED.</p>
            <p className="mt-2">FADED Romania Roleplay operează pe platforma FiveM și utilizează conținut din Grand Theft Auto V. Nu suntem afiliați cu, sponsorizați de sau aprobați de Rockstar Games, Take-Two Interactive Software sau FiveM. Toate mărcile comerciale sunt proprietatea deținătorilor respectivi.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ink mb-3">10. Limitarea răspunderii</h2>
            <p className="mb-2">În măsura permisă de legislația română și europeană în vigoare, FADED Romania Roleplay nu este responsabil pentru:</p>
            <ul className="list-disc ml-5 space-y-2">
              <li>Pierderi de date, progres în joc, beneficii premium sau orice alt element digital cauzate de probleme tehnice, atacuri cibernetice, erori de server sau forță majoră.</li>
              <li>Conținutul publicat de utilizatori pe forum sau în alte secțiuni publice ale Platformei.</li>
              <li>Datele personale pe care utilizatorii le divulgă voluntar altor jucători, pe Discord, social media sau în cadrul scenariilor de roleplay.</li>
              <li>Daune directe, indirecte, incidentale, speciale sau consecvente rezultate din utilizarea sau imposibilitatea utilizării Serviciilor.</li>
              <li>Întreruperi temporare ale serviciului pentru mentenanță, actualizări sau evenimente tehnice neprevăzute.</li>
              <li>Acțiunile sau omisiunile furnizorilor terți (Rockstar Games, FiveM, Tebex, Vercel etc.).</li>
              <li>Pierderi financiare, reputaționale sau de altă natură rezultate din bannul sau sancționarea unui cont, aplicat conform acestor termeni.</li>
            </ul>
            <p className="mt-3">Răspunderea noastră totală față de orice utilizator, indiferent de cauza acțiunii, este limitată la valoarea sumelor plătite de acel utilizator către FADED în ultimele 12 luni. Aceste limitări se aplică în măsura maximă permisă de Codul Civil Român și de Directiva 2011/83/UE.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ink mb-3">11. Disponibilitatea serviciului</h2>
            <p>FADED nu garantează disponibilitatea continuă, neîntreruptă sau fără erori a Platformei sau Serverului. Ne rezervăm dreptul de a suspenda, modifica sau înceta orice serviciu, temporar sau permanent, cu sau fără notificare prealabilă, fără a fi obligați la compensarea utilizatorilor pentru perioadele de indisponibilitate.</p>
            <p className="mt-2">Facem eforturi rezonabile pentru a menține serviciul funcțional, dar nu oferim garanții de tip SLA (Service Level Agreement).</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ink mb-3">12. Act Privind Serviciile Digitale (DSA)</h2>
            <p>Conform Regulamentului (UE) 2022/2065 privind un mediu digital unic (Digital Services Act), activ din 17 februarie 2024, FADED Romania Roleplay este calificat ca <strong className="text-ink">furnizor de servicii de intermediere de mici dimensiuni</strong> și aplică, în mod corespunzător:</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Un sistem de raportare a conținutului ilegal (sistemul de tickete la /suport).</li>
              <li>Un mecanism de contestare a deciziilor de moderare.</li>
              <li>Transparență în aplicarea politicilor de moderare.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ink mb-3">13. Modificarea termenilor</h2>
            <p>Ne rezervăm dreptul de a modifica acești Termeni și Condiții în orice moment. Modificările semnificative vor fi notificate prin email și/sau anunț pe site cu cel puțin <strong className="text-ink">14 zile calendaristice</strong> înainte de intrarea în vigoare. Continuarea utilizării serviciilor după această perioadă constituie acceptarea noilor termeni.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ink mb-3">14. Legislație aplicabilă și soluționarea litigiilor</h2>
            <p>Acești Termeni și Condiții sunt guvernați de legislația <strong className="text-ink">română</strong> și, unde este aplicabil, de legislația Uniunii Europene.</p>
            <p className="mt-2">Orice litigiu decurgând din sau în legătură cu acești termeni va fi soluționat, în primă etapă, pe cale amiabilă, prin contactarea noastră la {CONTACT}. Termenul pentru soluționare amiabilă este de 30 de zile de la data sesizării.</p>
            <p className="mt-2">În cazul eșecului procedurii amiabile, litigiile vor fi supuse jurisdicției exclusive a instanțelor judecătorești competente din <strong className="text-ink">România</strong>. Consumatorii din UE au, de asemenea, dreptul de a utiliza platforma europeană de soluționare online a litigiilor (ODR): <span className="text-signal">ec.europa.eu/consumers/odr</span>.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-ink mb-3">15. Contact</h2>
            <ul className="list-disc ml-5 space-y-1">
              <li>Email: <a href={`mailto:${CONTACT}`} className="text-signal hover:underline">{CONTACT}</a></li>
              <li>Sistem tickete: <span className="text-signal">faded.ro/suport</span></li>
            </ul>
          </section>

        </div>
      </div>
    </main>
  );
}
