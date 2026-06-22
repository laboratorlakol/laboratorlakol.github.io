# FADED Romania Roleplay — Website

Site oficial pentru serverul FiveM **FADED Romania Roleplay**.
Next.js 16 (App Router) + TypeScript + Tailwind v4 + Framer Motion + Prisma.

## Ce conține acest proiect, pe faze

**Faza 1 — Frontend/UX-UI** ✅
Landing page completă: Hero, statistici live, Despre, Features, Galerie,
Echipă, Noutăți, Footer.

**Faza 2 — Autentificare & Backend** ✅ (acest update)
- Înregistrare cu confirmare de email
- Login / logout cu JWT (access token) + refresh token rotativ
- Resetare parolă
- Roluri (Member → Founder), audit log pe orice acțiune de auth
- Dashboard simplu pentru playeri (cont + slot pentru personaj FiveM)

**Fazele următoare** (nu sunt în acest update)
- Legare cont ↔ personaj FiveM (`/codsite`)
- Forum
- Panel Admin + CMS
- Magazin (redirect Tebex)

---

## Setup — ai nevoie de 3 lucruri înainte să meargă

### 1. Bază de date — Neon (gratuit)

1. Creează cont pe [neon.tech](https://neon.tech) (poți cu GitHub).
2. `Create a project` → orice nume, regiune apropiată (EU recomandat).
3. Din pagina proiectului, `Connection string` — Neon îți dă **două**
   variante: una cu `-pooler` în hostname (pentru `DATABASE_URL`) și una
   fără (pentru `DATABASE_URL_UNPOOLED`). Copiază-le pe ambele.
4. Pune-le în `.env` (vezi `.env.example`).

### 2. Email — Resend (gratuit, ~3000 emailuri/lună)

1. Creează cont pe [resend.com](https://resend.com).
2. `API Keys` → `Create API Key` → copiază-l în `RESEND_API_KEY`.
3. **Important**: până nu adaugi și verifici propriul domeniu (`Domains` →
   `Add Domain` → adaugi câteva înregistrări DNS la `faded.ro`), Resend te
   lasă să trimiți emailuri *doar către adresa ta de cont*, cu adresa de
   expeditor `onboarding@resend.dev`. E suficient pentru testare; pentru
   emailuri reale către utilizatori, verifică domeniul `faded.ro` în Resend
   și schimbă `EMAIL_FROM` în `.env` (ex: `FADED <noreply@faded.ro>`).

### 3. Secrete proprii

```bash
openssl rand -base64 48   # rulează de două ori, una pentru JWT_SECRET
```

Completează `.env` (copiază din `.env.example`) cu toate valorile de mai sus.

---

## Rulare locală

```bash
npm install                  # generează și clientul Prisma automat
npm run db:migrate            # creează tabelele în Neon, cere un nume (ex: init)
npm run dev
```

Site-ul pornește pe `http://localhost:3000`. Încearcă `/register`.

### Cont de Founder, fără panel admin (încă)

```bash
SEED_FOUNDER_EMAIL="tu@exemplu.com" \
SEED_FOUNDER_USERNAME="founder" \
SEED_FOUNDER_PASSWORD="o-parola-puternica" \
npm run db:seed
```

---

## Deploy pe Vercel

1. Push pe GitHub ca de obicei.
2. În proiectul Vercel → `Settings` → `Environment Variables` → adaugă
   **toate** variabilele din `.env` (DATABASE_URL, DATABASE_URL_UNPOOLED,
   JWT_SECRET, RESEND_API_KEY, EMAIL_FROM, NEXT_PUBLIC_SITE_URL).
3. Tot ce ține de `prisma generate` se întâmplă automat la `npm install`
   (vezi `postinstall` în `package.json`) — nu trebuie configurat nimic
   suplimentar în Vercel.
4. **Migrațiile** nu se aplică automat la deploy. După ce ai rulat
   `npm run db:migrate` local o dată (creează fișierele din
   `prisma/migrations/`, le adaugi în git), Vercel doar le folosește — dar
   tabelele trebuie create în Neon înainte de primul deploy care le folosește.
   Dacă schimbi schema mai târziu, rulează din nou `npm run db:migrate`
   local (cu `.env` ținând spre Neon), apoi `git push`.

---

## Hardening ideas (pentru când serverul crește)

- **Rate limiting real**: limiterul actual e în memorie, per instanță
  serverless — bun ca baseline, dar resetabil la fiecare cold start. Pentru
  protecție serioasă, [Upstash Redis](https://upstash.com) (gratuit) +
  `@upstash/ratelimit`.
- **2FA pentru roluri de staff**: cerut explicit în brief, nu e încă
  implementat — vine cu Panel Admin (fază următoare), unde are sens lângă
  Device Fingerprinting / Trusted Devices.

## Structură nouă față de Faza 1

```
prisma/
  schema.prisma       # User, RefreshToken, AuditLog, Warning, Timeout, Ban...
  seed.ts              # creează un cont Founder
src/
  lib/
    prisma.ts
    auth/
      password.ts      # bcrypt
      jwt.ts            # access token (15 min)
      tokens.ts          # refresh/verify/reset tokens (opaci, hash în DB)
      cookies.ts
      rbac.ts            # hierarhia de roluri
      session.ts
      audit.ts
      rate-limit.ts
      validation.ts      # scheme zod
      auth-context.tsx   # AuthProvider client-side
  middleware.ts          # blochează request-uri cross-origin spre /api/auth
  app/
    api/auth/{register,login,refresh,logout,me,verify-email,
              request-password-reset,reset-password}/route.ts
    login/ register/ verify-email/ forgot-password/ reset-password/
    dashboard/
```
