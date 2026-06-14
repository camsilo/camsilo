# Camsilo · visitkort

Tre færdige, tryk-klare visitkort-designs i camsilo.dk's "Smedje & egetræ"-stil —
flettet rune-C, glødende jern-orange, egetræsbrun, futhark-runer og QR-kode til
**camsilo.dk**. Alle dobbeltsidede.

## De tre designs

| Kort | Navn | Hvem | Udtryk |
|------|------|------|--------|
| **A** | `esse` | Casper Møller Madsen — **Grundlægger & softwareudvikler** | Hero/redaktionelt: stor tagline + glødende watermark-C der bløder ud over kanten. Varmest. |
| **B** | `odin-hud` | Casper Møller Madsen — **Founder & Software Developer** | Kommandocenter/HUD: gitter, panel med hjørnebeslag, kold *seid*-turkis accent. Mest teknisk. |
| **C** | `runesten` | **Kun CAMSILO** (brand-kort, intet personnavn) | Monumentalt, centreret emblem + runerække + valknut. Mest minimalistisk/ikonisk. |

> Bagsiden på A og B bruger `casper@camsilo.dk`. Brand-kortet C bruger `kontakt@camsilo.dk`
> (firma-indbakke), da der ikke er et personnavn på det. Sig til, hvis du vil have casper@ på alle.

## Mapper

```
tryk/      → PDF'er til trykkeriet (DETTE sender du videre)
preview/   → PNG'er til at kigge på / godkende (forside, bagside, og side-om-side)
svg/       → redigérbare vektor-kilder (bleed 91×61 mm, fonts indlejret)
```

Hver PDF er **2 sider**: side 1 = forside, side 2 = bagside.

## Tryk-specifikationer (vigtigt for trykkeriet)

- **Færdigt format (trim):** 85 × 55 mm (dansk/europæisk standard-visitkort), liggende.
- **Beskæring (bleed):** 3 mm hele vejen rundt — baggrunden fylder helt ud til 91 × 61 mm.
- **Sikkerhedszone:** al tekst holdes mindst 5 mm inde fra trim-kanten.
- **Beskæringsmærker:** indlagt i PDF'en (sort, i slug-området). PDF-siden er 101 × 71 mm
  inkl. mærker — trykkeriet beskærer til 85 × 55.
- **Fonts:** indlejret i PDF'en (Unbounded, Schibsted Grotesk, Fragment Mono, Noto Sans Runic).
  Trykkeriet behøver **ikke** installere noget. (SVG'erne har også fonts indlejret; hvis du
  redigerer dem, så bed evt. om "konvertér tekst til kurver" inden tryk.)
- **Farverum:** filerne er **RGB**. Til offsettryk konverteres til CMYK af trykkeriet — bed dem
  ramme den glødende orange så tæt som muligt. Vejledende spot-farve:
  **≈ Pantone 1585 C / 165 C** (orange `#f26a1b`). Den kølige turkis på kort B er kun en lille accent.

### Anbefaling for "mega fedt" resultat
- **350–400 g** kraftigt karton.
- **Soft-touch / mat laminering** — klæder den mørke kul-sorte flade og føles premium.
- Evt. **spot-UV** (blank lak) på logo + tagline + ember-elementer → de "gløder" mod den matte sort.
- Evt. **folie** (kobber/orange) på rune-C'et hvis du vil have det helt skarpt.

## QR-koden
Peger på **https://camsilo.dk**, fejlkorrektion **H** (meget robust), mørke moduler på en cremet
"smedet stempel"-plade for maksimal skanbarhed på den mørke baggrund. **Test-scan en prøve før
masseoplag.**

## Sådan bestiller du (online-trykkeri)
1. Vælg *Visitkort · 85 × 55 mm · dobbeltsidet*.
2. Upload PDF'en fra `tryk/` for det design, du vil have (eller flere).
3. Vælg "med beskæring/bleed" — mærkerne er allerede i filen.
4. Vælg papir/finish som ovenfor. Godkend deres digitale prøve (tjek især orange + QR).

---
*Genereret som ren vektor (logo, runer, valknut og QR er matematisk skarpe i enhver størrelse).
Kilde-scripts ligger i `tools/`; kør `node tools/build.mjs && node tools/render.mjs && node tools/package.mjs` for at regenerere.*
