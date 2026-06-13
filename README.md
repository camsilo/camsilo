# Camsilo — camsilo.dk

Firmasite for **Camsilo**, et dansk softwarestudie. Mørkt nordisk one-page design
med dansk/engelsk sprogskifte og et runebaseret logo (kaunan-runen ᚲ = Camsilos
"C", som samtidig læses som en kode-vinkelparentes).

## Stack

- Next.js 15 (App Router) · React 19 · TypeScript
- Ren CSS (ingen Tailwind) — designsystemet ligger i `src/app/globals.css`
- Ingen database — indholdet er statisk. First-party analytics gemmes som NDJSON
  under `DATA_DIR`; `/admin` er beskyttet af adgangskode.
- SEO: `sitemap.ts`, `robots.ts`, dynamisk OG-billede (`opengraph-image.tsx`),
  JSON-LD Organization-data (inkl. CVR) i `layout.tsx`.
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
    layout.tsx           # fonts, metadata, JSON-LD, GA, Sporing, html lang
    page.tsx             # renderer <Site/>
    globals.css          # hele designsystemet (CSS-vars, aurora, runebånd …)
    icon.svg             # favicon (logomærket)
    opengraph-image.tsx  # dynamisk 1200×630 delebillede (next/og)
    sitemap.ts           # /sitemap.xml
    robots.ts            # /robots.txt (afviser /admin + /api)
    admin/               # adgangskode-beskyttet analytics-dashboard
    api/hit/             # tracking-beacon (cookieløs, ingen IP-lagring)
  components/
    Logo.tsx             # LogoMark + LogoLockup (SVG, currentColor + var(--ice))
    Site.tsx             # hele one-pageren (client) — nav, hero, sektioner, footer
    Sporing.tsx          # first-party analytics-beacon
    GoogleAnalytics.tsx  # GA4 via env (NEXT_PUBLIC_GA_ID), springer /admin over
  lib/
    i18n.ts              # DA/EN-ordbog; sprogvalg gemmes i localStorage (camsilo_lang)
    admin-auth.ts        # HMAC-cookie-session til /admin
    analytics/           # store (NDJSON) + aggregate (KPI'er, lande, kilder)
```

## Miljøvariabler

Alle er valgfri — siten fungerer uden dem.

| Variabel | Bruges til |
|---|---|
| `ADMIN_PASSWORD` | adgangskode til `/admin` (uden den kan ingen logge ind) |
| `AUTH_SECRET` | HMAC-nøgle til admin-session-cookien (påkrævet i produktion) |
| `DATA_DIR` | hvor analytics-NDJSON gemmes (default `./data`) |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 Measurement ID (`G-…`) — uden den indlæses GA ikke |
| `GOOGLE_SITE_VERIFICATION` | token til Google Search Console-verifikation (meta-tag) |

## Deploy

HostStack, auto-deploy fra GitHub `camsilo/camsilo` (`main`) — config i
`hoststack.yaml` (web_service, `npm run build` → `npm start`, health check på `/`).
Domæne: **camsilo.dk** (DNS-zonen ligger allerede på HostStack, ns1/ns2.hoststack.dev).

Sproget skifter klient-side (DA er default og det, der prerenderes/SEO-indekseres).
