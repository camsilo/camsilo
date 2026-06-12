# Camsilo — camsilo.dk

Firmasite for **Camsilo**, et dansk softwarestudie. Mørkt nordisk one-page design
med dansk/engelsk sprogskifte og et runebaseret logo (kaunan-runen ᚲ = Camsilos
"C", som samtidig læses som en kode-vinkelparentes).

## Stack

- Next.js 15 (App Router) · React 19 · TypeScript
- Ren CSS (ingen Tailwind) — designsystemet ligger i `src/app/globals.css`
- Ingen database, ingen secrets — alt indhold er statisk
- Typografi: Unbounded (display) · Schibsted Grotesk (brødtekst) · Fragment Mono

## Kommandoer

```powershell
npm install
npm run dev          # port 3000
npm run typecheck    # tsc --noEmit
npm run build
```

## Struktur

```
src/
  app/
    layout.tsx       # fonts, metadata (camsilo.dk), html lang
    page.tsx         # renderer <Site/>
    globals.css      # hele designsystemet (CSS-vars, aurora, runebånd …)
    icon.svg         # favicon (logomærket)
  components/
    Logo.tsx         # LogoMark + LogoLockup (SVG, currentColor + var(--ice))
    Site.tsx         # hele one-pageren (client) — nav, hero, sektioner, footer
  lib/
    i18n.ts          # DA/EN-ordbog; sprogvalg gemmes i localStorage (camsilo_lang)
```

## Deploy

HostStack, auto-deploy fra GitHub `camsilo/camsilo` (`main`) — config i
`hoststack.yaml` (web_service, `npm run build` → `npm start`, health check på `/`).
Domæne: **camsilo.dk** (DNS-zonen ligger allerede på HostStack, ns1/ns2.hoststack.dev).

Sproget skifter klient-side (DA er default og det, der prerenderes/SEO-indekseres).
