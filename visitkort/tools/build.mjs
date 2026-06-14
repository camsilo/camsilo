// ──────────────────────────────────────────────────────────────
//  Camsilo visitkort — komponér 3 kort (forside+bagside) → HTML
//  Koordinatsystem: bleed-lokal 0..91 × 0..61 mm
//    trim   = 3..88 × 3..58   (85×55 mm)
//    safe   = 8..83 × 8..53   (5 mm inde i trim)
//  Print-side placeres på 101×71 mm med beskæringsmærker i slug.
// ──────────────────────────────────────────────────────────────
import fs from 'node:fs';
import {
  C, a, T, esc, logo, valknut, knotBand, corners, qrTile, sharedDefs, mote, RUNES,
} from './lib.mjs';

const ROOT = 'F:/claudecode/camsilo/visitkort';
const FONTS = fs.readFileSync(`${ROOT}/build/fonts-embedded.css`, 'utf8');
const QR = JSON.parse(fs.readFileSync(`${ROOT}/qr-matrix.json`, 'utf8'));

const BLEED = 3, TRIM_W = 85, TRIM_H = 55, AW = 91, AH = 61, SLUG = 5;
const SX0 = 8, SY0 = 8, SX1 = 83, SY1 = 53;          // safe box
const CX = AW / 2;                                    // 45.5 (vandret midte)

// små byggesten
const line = (x1, y1, x2, y2, stroke, sw = 0.25, op = 1) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${sw}" opacity="${op}"/>`;
const rect = (x, y, w, h, o = {}) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 0}" fill="${o.fill ?? 'none'}" ${o.stroke ? `stroke="${o.stroke}" stroke-width="${o.sw ?? 0.25}"` : ''}/>`;
const field = () => `<defs>${sharedDefs()}</defs><rect x="0" y="0" width="${AW}" height="${AH}" fill="url(#bgfield)"/>`;
// midter-anker korrektion for letter-spacing
const mid = (x, spacing) => (x - spacing / 2).toFixed(3);

const card = {};

/* ══════════════ KORT A — “ESSE” · Casper · Grundlægger ══════════════ */
card.A = {
  navn: 'esse',
  front: () => field()
    + `<rect x="0" y="0" width="${AW}" height="42" fill="url(#forge)"/>`
    // watermark-mærke, glødende, bløder ud over højre kant
    + `<circle cx="82" cy="30" r="30" fill="url(#emberGlow)" opacity="0.22"/>`
    + `<g opacity="0.2">` + logo(53, 3, 56, 'wmA', { texture: false, bg: C.bg }) + `</g>`
    // veil: toner watermarket ned i venstre side + bund, så tekst læses rent
    + `<defs><linearGradient id="veilA" x1="0" y1="0" x2="1" y2="0">`
    + `<stop offset="0%" stop-color="${a(C.bg, 0.96)}"/><stop offset="48%" stop-color="${a(C.bg, 0.72)}"/><stop offset="100%" stop-color="${a(C.bg, 0)}"/></linearGradient>`
    + `<linearGradient id="vbA" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${a(C.bg, 0)}"/><stop offset="100%" stop-color="${a(C.bg, 0.9)}"/></linearGradient></defs>`
    + `<rect x="0" y="0" width="74" height="${AH}" fill="url(#veilA)"/>`
    + `<rect x="0" y="44" width="${AW}" height="17" fill="url(#vbA)"/>`
    // stigende gnister
    + mote(15.5, 47, 0.5, 'url(#mote)', 0.9) + mote(20, 42.5, 0.36, 'url(#mote)', 0.7) + mote(12, 39, 0.3, 'url(#mote)', 0.6)
    // lockup
    + logo(SX0, 8.4, 6.6, 'lkA', { texture: false })
    + T(16.8, 13.2, 'CAMSILO', { family: 'display', weight: 700, size: 3.0, spacing: 0.95, fill: C.ink })
    // kicker-pill
    + rect(SX0, 20.6, 39.5, 4.7, { rx: 2.35, fill: a(C.ember, 0.06), stroke: a(C.ember, 0.32), sw: 0.22 })
    + T(10.2, 23.85, 'ᚲ', { family: 'rune', size: 2.5, fill: C.ember })
    + T(13.4, 23.7, 'DANSK SOFTWARESTUDIE', { family: 'mono', size: 1.7, spacing: 0.5, fill: C.dim })
    // tagline
    + T(SX0, 35.2, 'Software,', { family: 'display', weight: 700, size: 6.2, fill: C.ink, spacing: -0.1 })
    + T(SX0, 42.9, 'smedet i Norden.', { family: 'display', weight: 700, size: 6.2, fill: 'url(#emberText)', spacing: -0.1 })
    // bund (domænet er fjernet fra forsiden — det står ved QR på bagsiden)
    + T(SX0, 51.3, 'EST. 2025 · DANMARK', { family: 'mono', size: 1.95, spacing: 0.5, fill: C.dim })
    + corners(5, 5, 81, 51, { len: 3.6, sw: 0.3, color: C.ember, which: ['tl', 'br'] }),
  back: () => {
    const q = qrTile(QR, 70, 29.5, 18.5);
    return field()
      + `<rect x="0" y="0" width="${AW}" height="26" fill="url(#forge)" opacity="0.8"/>`
      + logo(SX0, 8.2, 6.0, 'lkAb', { texture: false })
      + T(15.6, 12.6, 'CAMSILO', { family: 'display', weight: 700, size: 2.7, spacing: 0.9, fill: C.ink })
      + line(SX0, 16.4, SX1, 16.4, 'url(#hairline)', 0.3)
      // navn + titel
      + T(SX0, 25.6, 'Casper Møller Madsen', { family: 'display', weight: 500, size: 3.35, fill: C.ink, spacing: -0.05 })
      + T(SX0, 30.0, 'GRUNDLÆGGER & SOFTWAREUDVIKLER', { family: 'mono', size: 1.7, spacing: 0.55, fill: C.ember })
      // kontaktrækker
      + T(SX0, 39.0, 'MAIL', { family: 'mono', size: 1.6, spacing: 0.55, fill: a(C.ember, 0.95) })
      + T(SX0, 42.3, 'casper@camsilo.dk', { family: 'body', size: 2.4, fill: C.ink })
      + T(SX0, 47.6, 'WEB', { family: 'mono', size: 1.6, spacing: 0.55, fill: a(C.ember, 0.95) })
      + T(SX0, 50.9, 'camsilo.dk', { family: 'body', size: 2.4, fill: C.ink })
      + T(40, 47.6, 'CVR', { family: 'mono', size: 1.6, spacing: 0.55, fill: a(C.ember, 0.95) })
      + T(40, 50.9, '45925145', { family: 'body', size: 2.4, fill: C.ink })
      // QR
      + q.svg
      + T(70, q.py0 + q.plaqueSize + 2.9, 'SCAN · CAMSILO.DK', { family: 'mono', size: 1.85, spacing: 0.4, fill: C.dim, anchor: 'middle' })
      + corners(5, 5, 81, 51, { len: 3.6, sw: 0.3, color: C.ember, which: ['tl', 'br'] });
  },
};

/* ══════════════ KORT B — “ODIN HUD” · Casper · Founder ══════════════ */
const grid = (step = 5.2) => {
  let g = `<g opacity="1">`;
  for (let x = 0; x <= AW + 0.1; x += step) g += line(+x.toFixed(2), 0, +x.toFixed(2), AH, a(C.ember, 0.05), 0.12);
  for (let y = 0; y <= AH + 0.1; y += step) g += line(0, +y.toFixed(2), AW, +y.toFixed(2), a(C.ember, 0.05), 0.12);
  return g + `</g>`;
};
const hudPanel = () =>
  rect(6, 6, AW - 12, AH - 12, { rx: 0.6, stroke: a(C.ember, 0.18), sw: 0.22 })
  + corners(6, 6, AW - 12, AH - 12, { len: 3.2, sw: 0.38, color: C.ember, which: ['tl', 'tr', 'bl', 'br'] });
const seidDot = (x, y) =>
  `<circle cx="${x}" cy="${y}" r="1.7" fill="none" stroke="${a(C.seid, 0.5)}" stroke-width="0.22"/>`
  + `<circle cx="${x}" cy="${y}" r="0.7" fill="${C.seid}"/>`;

card.B = {
  navn: 'odin-hud',
  front: () => field()
    + grid()
    + `<rect x="0" y="0" width="${AW}" height="40" fill="url(#forge)"/>`
    + `<circle cx="82" cy="6" r="26" fill="url(#seidGlow)"/>`
    + hudPanel()
    + line(6, 17.5, AW - 6, 17.5, 'url(#hairline)', 0.18, 0.6)
    // top labels
    + T(10, 12.6, 'ᚲ', { family: 'rune', size: 2.4, fill: C.ember })
    + T(13, 12.5, 'CAMSILO', { family: 'mono', size: 2.0, spacing: 1.0, fill: C.ember })
    + T(28.5, 12.5, '// SOFTWARESTUDIE', { family: 'mono', size: 1.7, spacing: 0.35, fill: C.dim })
    + seidDot(74.5, 11.8) + T(73, 12.5, 'I DRIFT', { family: 'mono', size: 1.7, spacing: 0.45, fill: C.seid, anchor: 'end' })
    // midte: mærke + ordmærke
    + logo(10, 23.5, 14, 'hudB', { texture: true })
    + T(27, 35.0, 'CAMSILO', { family: 'display', weight: 900, size: 7.6, spacing: 0.6, fill: C.ink })
    + T(27.4, 41.0, 'SOFTWARE, SMEDET I NORDEN', { family: 'mono', size: 1.95, spacing: 0.5, fill: C.ember })
    // bund-readouts
    + T(10, 51.5, '// EST 2025', { family: 'mono', size: 1.7, spacing: 0.35, fill: C.dim })
    + T(CX, 51.5, 'DK', { family: 'mono', size: 1.7, spacing: 0.6, fill: C.dim, anchor: 'middle' })
    + T(AW - 10, 51.5, 'camsilo.dk', { family: 'mono', size: 1.95, spacing: 0.4, fill: C.ember, anchor: 'end' }),
  back: () => {
    const q = qrTile(QR, 68, 25.8, 17, { frame: C.seid });
    return field()
      + grid()
      + `<rect x="0" y="0" width="${AW}" height="30" fill="url(#forge)"/>`
      + `<circle cx="12" cy="58" r="22" fill="url(#seidGlow)"/>`
      + hudPanel()
      + T(10, 12.6, 'ᚲ', { family: 'rune', size: 2.4, fill: C.ember })
      + T(13, 12.5, 'CAMSILO', { family: 'mono', size: 2.0, spacing: 1.0, fill: C.ember })
      + T(28.5, 12.5, '// KONTAKT', { family: 'mono', size: 1.7, spacing: 0.35, fill: C.dim })
      // readout-blok (label over værdi)
      + T(10, 19.6, 'OPERATØR', { family: 'mono', size: 1.65, spacing: 0.5, fill: C.seid })
      + T(10, 23.6, 'Casper Møller Madsen', { family: 'display', weight: 500, size: 3.0, fill: C.ink, spacing: -0.05 })
      + T(10, 30.0, 'ROLLE', { family: 'mono', size: 1.65, spacing: 0.5, fill: C.seid })
      + T(10, 33.7, 'Founder & Software Developer', { family: 'body', size: 2.25, fill: C.ink })
      + q.svg
      + T(68, q.py0 + q.plaqueSize + 2.6, '// SCAN', { family: 'mono', size: 1.85, spacing: 0.5, fill: C.seid, anchor: 'middle' })
      + line(10, 40.5, AW - 10, 40.5, 'url(#hairline)', 0.18, 0.7)
      // bund-band: mail / web / cvr
      + T(10, 45.0, 'MAIL', { family: 'mono', size: 1.6, spacing: 0.5, fill: a(C.ember, 0.95) })
      + T(26, 45.0, 'casper@camsilo.dk', { family: 'body', size: 2.15, fill: C.ink })
      + T(10, 51.0, 'WEB', { family: 'mono', size: 1.6, spacing: 0.5, fill: a(C.ember, 0.95) })
      + T(26, 51.0, 'camsilo.dk', { family: 'body', size: 2.1, fill: C.ink })
      + T(52, 51.0, 'CVR', { family: 'mono', size: 1.6, spacing: 0.5, fill: a(C.ember, 0.95) })
      + T(63, 51.0, '45925145', { family: 'body', size: 2.1, fill: C.ink });
  },
};

/* ══════════════ KORT C — “RUNESTEN” · brand-only ══════════════ */
card.C = {
  navn: 'runesten',
  front: () => field()
    + `<circle cx="${CX}" cy="21" r="30" fill="url(#emberGlow)" opacity="0.42"/>`
    + `<circle cx="${CX}" cy="20.5" r="15" fill="url(#emberGlow)" opacity="0.5"/>`
    + logo(CX - 11.5, 6.5, 25, 'runeC', { texture: true })
    // flankerende ristede linjer ved ordmærket (spejlsymmetriske om CX)
    + line(16, 40.5, 30, 40.5, a(C.ember, 0.45), 0.25)
    + line(61, 40.5, 75, 40.5, a(C.ember, 0.45), 0.25)
    + T(mid(CX, 2.2), 41.6, 'CAMSILO', { family: 'display', weight: 700, size: 5.0, spacing: 2.2, fill: C.ink, anchor: 'middle' })
    + T(mid(CX, 2.0), 47.7, RUNES, { family: 'rune', size: 3.1, spacing: 2.0, fill: C.emberLight, anchor: 'middle' })
    + corners(5, 5, 81, 51, { len: 3.2, sw: 0.34, color: a(C.ember, 0.85), which: ['tl', 'tr', 'bl', 'br'] }),
  back: () => {
    const q = qrTile(QR, CX, 35.2, 17);
    return field()
      + `<rect x="0" y="0" width="${AW}" height="${AH}" fill="url(#forge)" opacity="0.7"/>`
      + valknut(CX - 13, 18, 26, { color: C.ember, bg: C.bgRaise, opacity: 0.07 })
      + T(CX, 12.7, 'Software,', { family: 'display', weight: 500, size: 3.8, fill: C.ink, anchor: 'middle' })
      + T(mid(CX, 0), 17.7, 'smedet i Norden.', { family: 'display', weight: 500, size: 3.8, fill: 'url(#emberText)', anchor: 'middle' })
      + T(mid(CX, 1.3), 22.0, 'DANSK SOFTWARESTUDIE', { family: 'mono', size: 1.65, spacing: 1.3, fill: C.dim, anchor: 'middle' })
      + line(CX - 9, 23.2, CX + 9, 23.2, a(C.ember, 0.4), 0.22)
      + q.svg
      + T(CX, q.py0 + q.plaqueSize + 2.7, 'camsilo.dk', { family: 'display', weight: 500, size: 2.7, spacing: 0.3, fill: C.ember, anchor: 'middle' })
      + T(CX, q.py0 + q.plaqueSize + 5.9, 'kontakt@camsilo.dk · CVR 45925145', { family: 'mono', size: 1.8, spacing: 0.2, fill: C.dim, anchor: 'middle' })
      + corners(5, 5, 81, 51, { len: 2.8, sw: 0.28, color: a(C.ember, 0.8), which: ['tl', 'tr', 'bl', 'br'] });
  },
};

/* ───────────────────────── HTML-skabeloner ───────────────────────── */
const head = (pageW, pageH) =>
  `<!doctype html><html><head><meta charset="utf-8"><style>${FONTS}
  @page{size:${pageW}mm ${pageH}mm;margin:0}
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{background:#000}
  svg{display:block}</style></head>`;

// enkelt-side preview (kun trim 85×55)
function previewSide(art) {
  return head(TRIM_W, TRIM_H)
    + `<body style="width:${TRIM_W}mm;height:${TRIM_H}mm">`
    + `<svg xmlns="http://www.w3.org/2000/svg" width="${TRIM_W}mm" height="${TRIM_H}mm" viewBox="${BLEED} ${BLEED} ${TRIM_W} ${TRIM_H}">${art}</svg>`
    + `</body></html>`;
}

// forside+bagside ved siden af hinanden (til samlet preview-PNG)
function previewBoth(front, back) {
  const gap = 6, totW = TRIM_W * 2 + gap;
  const tile = (art) =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="${TRIM_W}mm" height="${TRIM_H}mm" viewBox="${BLEED} ${BLEED} ${TRIM_W} ${TRIM_H}" style="box-shadow:0 0 0 0.3mm #2a211a">${art}</svg>`;
  return head(totW, TRIM_H)
    + `<body style="width:${totW}mm;height:${TRIM_H}mm;background:#050403;display:flex;gap:${gap}mm;align-items:center">`
    + tile(front) + tile(back) + `</body></html>`;
}

// beskæringsmærker i page-koordinat (101×71)
function cropMarks() {
  const tx0 = SLUG + BLEED, ty0 = SLUG + BLEED, tx1 = SLUG + BLEED + TRIM_W, ty1 = SLUG + BLEED + TRIM_H; // 8,8,93,63
  const m = '#111', sw = 0.12, L = 3.4, g = 1.0; // mærker i slug, uden for bleed
  const v = (x, yTop) => yTop
    ? line(x, 0.6, x, 0.6 + L, m, sw) : line(x, ty1 + (SLUG - BLEED - g), x, ty1 + (SLUG - BLEED - g) + L, m, sw);
  // tegn 8 mærker eksplicit
  const marks = [
    line(tx0, 0.8, tx0, 0.8 + L, m, sw), line(tx1, 0.8, tx1, 0.8 + L, m, sw),       // top vert
    line(tx0, 71 - 0.8 - L, tx0, 71 - 0.8, m, sw), line(tx1, 71 - 0.8 - L, tx1, 71 - 0.8, m, sw), // bund vert
    line(0.8, ty0, 0.8 + L, ty0, m, sw), line(0.8, ty1, 0.8 + L, ty1, m, sw),       // venstre horiz
    line(101 - 0.8 - L, ty0, 101 - 0.8, ty0, m, sw), line(101 - 0.8 - L, ty1, 101 - 0.8, ty1, m, sw), // højre horiz
  ].join('');
  return marks;
}

// standalone vektor-SVG (bleed 91×61, fonts indlejret) — redigérbar kilde
function standaloneSVG(art) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n`
    + `<svg xmlns="http://www.w3.org/2000/svg" width="${AW}mm" height="${AH}mm" viewBox="0 0 ${AW} ${AH}">`
    + `<style>${FONTS}</style>`
    + `<!-- Camsilo visitkort · 85×55 mm trim · 3 mm bleed (kunst fylder 91×61) · trim = 3..88 × 3..58 -->`
    + art + `</svg>`;
}

// print-side (101×71, bleed-kunst + beskæringsmærker + slug-label)
function printPage(art, label) {
  return `<div class="page"><svg xmlns="http://www.w3.org/2000/svg" width="101mm" height="71mm" viewBox="0 0 101 71">`
    + `<rect x="0" y="0" width="101" height="71" fill="#ffffff"/>`
    + `<g transform="translate(${SLUG},${SLUG})">${art}</g>`
    + cropMarks()
    + `<text x="50.5" y="69" font-family="'Fragment Mono',monospace" font-size="1.9" fill="#9aa0a6" text-anchor="middle">${esc(label)}</text>`
    + `</svg></div>`;
}
function printDoc(front, back, id, navn) {
  const lbl = (side) => `CAMSILO · KORT ${id} (${navn}) · ${side} · 85×55 mm + 3 mm beskæring`;
  return head(101, 71)
    + `<style>.page{width:101mm;height:71mm;page-break-after:always;overflow:hidden}.page:last-child{page-break-after:auto}</style>`
    + `<body>` + printPage(front, lbl('FORSIDE')) + printPage(back, lbl('BAGSIDE')) + `</body></html>`;
}

/* ───────────────────────── skriv filer ───────────────────────── */
const B = `${ROOT}/build`;
const manifest = [];
const PXMM = 96 / 25.4;
for (const id of ['A', 'B', 'C']) {
  const c = card[id];
  const front = c.front(), back = c.back();
  fs.writeFileSync(`${B}/preview-${id}-front.html`, previewSide(front));
  fs.writeFileSync(`${B}/preview-${id}-back.html`, previewSide(back));
  fs.writeFileSync(`${B}/preview-${id}-both.html`, previewBoth(front, back));
  fs.writeFileSync(`${B}/print-${id}.html`, printDoc(front, back, id, c.navn));
  fs.writeFileSync(`${B}/svg-${id}-forside.svg`, standaloneSVG(front));
  fs.writeFileSync(`${B}/svg-${id}-bagside.svg`, standaloneSVG(back));
  manifest.push({ kind: 'png', file: `preview-${id}-front.html`, out: `r-${id}-front.png`, w: Math.round(TRIM_W * PXMM), h: Math.round(TRIM_H * PXMM) });
  manifest.push({ kind: 'png', file: `preview-${id}-back.html`, out: `r-${id}-back.png`, w: Math.round(TRIM_W * PXMM), h: Math.round(TRIM_H * PXMM) });
  manifest.push({ kind: 'png', file: `preview-${id}-both.html`, out: `r-${id}-both.png`, w: Math.round((TRIM_W * 2 + 6) * PXMM), h: Math.round(TRIM_H * PXMM) });
  manifest.push({ kind: 'pdf', file: `print-${id}.html`, out: `camsilo-visitkort-${id}-${c.navn}.pdf` });
}
fs.writeFileSync(`${B}/manifest.json`, JSON.stringify(manifest, null, 2));
console.log('Byggede', manifest.length, 'render-jobs ·', ['A', 'B', 'C'].map((i) => `${i}=${card[i].navn}`).join(' '));
