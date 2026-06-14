# Camsilo — logo-assets

Logoet er **det vævede "C"** — et to-strenget nordisk fletværk: ét bånd i glødende jern
(ember-orange), ét i egetræsbrun (oak), der væver skiftevis over/under langs en åben C-bue,
lukket af to nittehoveder. Alle assets her er afledt af den selvstændige master
`../src/app/icon.svg` (den parametriske kilde bag mærket er `../src/components/Logo.tsx`).

Farver (matcher CSS-variablerne 1:1): baggrund `#0d0b09`, ember `#f26a1b` /
deep `#b8400a` / light `#ff8a44`, oak `#b07a42`.

## Indhold

```
brand/
├─ generate.mjs              ← regenerér alt (node brand/generate.mjs)
├─ svg/                      ← vektor-mastere, skalérbare i det uendelige
│  ├─ camsilo-mark.svg        transparent — kun mærket, til frilægning hvor som helst
│  ├─ camsilo-icon.svg        afrundet mørk flise — favicon / PWA / app-ikon
│  └─ camsilo-icon-square.svg mørk firkant uden afrunding — social/OG, maskable
└─ png/
   ├─ favicon-32.png         32px afrundet ikon (bekvem favicon-kopi)
   ├─ icon/                  afrundet mørk flise: 16·32·48·64·128·180·192·256·512·1024
   ├─ square/                mørk firkant: 256·512·1024·2048
   └─ mark/                  transparent mærke: 64·128·256·512·1024·2048
```

## Hvad bruger jeg hvornår?

| Brug | Fil |
|---|---|
| Favicon | `png/favicon-32.png` eller `svg/camsilo-icon.svg` |
| PWA / hjemmeskærm-ikon | `png/icon/icon-192.png`, `icon-512.png` |
| Apple touch-ikon | `png/icon/icon-180.png` |
| Social / OG-share, app-store | `png/square/square-1024.png` (platforme afrunder selv) |
| Mærke på enhver flade (lyst/mørkt/print) | `svg/camsilo-mark.svg` eller `png/mark/mark-*.png` |
| Skalérbart / tryk | enhver `svg/`-fil (vektor — vælg altid SVG hvis muligt) |

> SVG først. PNG-stigerne er til steder der ikke tager SVG. Den transparente `mark`
> har en mørk indgraveret "casing", så den popper både på lyse og mørke flader.

## Regenerering / nye størrelser

Redigér `SIZES` i `generate.mjs` og kør (fra projektroden, så `sharp` resolves):

```powershell
cd .\camsilo\; node brand/generate.mjs
```

Idempotent — overskriver. Ændrer du selve mærket, så ret det i `src/app/icon.svg`
(masteren) og kør igen; alt afledes derfra.

**Ikke inkluderet:** vandret wordmark-lockup (mærke + "CAMSILO"). Det kræver display-fonten
*Unbounded 700* indlejret for tro rasterisering — sig til hvis du vil have den genereret.
