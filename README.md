# FADED Romania Roleplay — Website

Landing page oficială pentru serverul FiveM **FADED Romania Roleplay**.
Construit cu Next.js 16 (App Router), TypeScript, Tailwind CSS v4 și Framer Motion.

## Ce conține faza curentă (Frontend / UX-UI)

- Hero cinematic cu glow, "smoke" ambiental și CTA-uri
- Panou de statistici live, stilizat ca un terminal de dispatch (MDT) — citește
  momentan valori placeholder, pregătit să consume `/api/stats` când backend-ul e gata
- Secțiuni: Despre, Features, Galerie, Echipă, Noutăți, Footer
- Navbar responsive cu meniu mobil
- SEO de bază: metadata, OpenGraph, `sitemap.xml`, `robots.txt`
- Design system complet în `src/app/globals.css` (culori, glow, scanline) — orice
  componentă nouă trebuie să folosească aceste variabile, nu culori hardcodate

> Aceasta e doar partea de site (UX/UI). Autentificare, forum, panel admin,
> backend NestJS/Prisma și integrarea FiveM/Discord vin în fazele următoare.

## Înainte de a da push

1. **Logo**: înlocuiește `public/logo/faded-wordmark.svg` cu logo-ul real
   (SVG sau PNG). Dacă pui PNG, actualizează extensia în `navbar.tsx` și
   `footer.tsx` (`src="/logo/..."`).
2. **Discord**: schimbă linkul placeholder `https://discord.gg/faded` din
   `hero.tsx` și `footer.tsx` cu invite-ul real.
3. **Imagine OpenGraph**: adaugă o imagine `1200x630` la `public/og-image.png`
   pentru preview-uri pe Discord/WhatsApp/social media.

## Rulare locală

```bash
npm install
npm run dev
```

Site-ul pornește pe `http://localhost:3000`.

## Deploy pe Vercel (plan gratuit) cu domeniul faded.ro

1. **GitHub**: creează un repo nou (poate fi privat) și fă push la codul din
   acest folder:
   ```bash
   git init
   git add .
   git commit -m "Initial FADED landing page"
   git branch -M main
   git remote add origin <url-ul-repo-ului-tau>
   git push -u origin main
   ```

2. **Vercel**: pe [vercel.com](https://vercel.com), `Add New Project` →
   importă repo-ul de GitHub. Vercel detectează automat Next.js, nu e nevoie
   de configurare suplimentară (fără `vercel.json`).

3. **Domeniu propriu**: în proiectul din Vercel → `Settings` → `Domains` →
   adaugă `faded.ro` (și `www.faded.ro` dacă vrei). Vercel îți dă două
   înregistrări DNS (de regulă un `A` record către `76.76.21.21` și un `CNAME`
   pentru `www`) — le adaugi la registrarul de unde ai cumpărat domeniul.
   Propagarea poate dura de la câteva minute la câteva ore.

4. **Plan gratuit**: tot ce e în acest proiect (pagini statice, fără server
   functions încă) se încadrează fără probleme în limitele planului Hobby de
   pe Vercel.

## Structură

```
src/
  app/
    layout.tsx       # fonturi, metadata, SEO
    page.tsx          # asamblează secțiunile landing page-ului
    globals.css       # design tokens (culori, glow, scanline)
    sitemap.ts
    robots.ts
  components/
    ui/button.tsx     # buton stil shadcn, tematizat FADED
    sections/         # navbar, hero, live-stats, about, features,
                       # gallery, team, news, footer
  lib/utils.ts        # helper cn() pentru clase Tailwind
public/
  logo/faded-wordmark.svg
```

## Următorii pași (faza 2 — Backend & FiveM)

- Schema Prisma + NestJS (auth, forum, conturi, roluri RBAC)
- Endpoint `/api/stats` real, alimentat din serverul FiveM + Discord
- Script `/codsite` pe server pentru legarea contului website ↔ CitizenID
- Panel admin, CMS, sistem de forum, regulament, ticketing
