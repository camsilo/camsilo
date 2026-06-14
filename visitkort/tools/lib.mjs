// ──────────────────────────────────────────────────────────────
//  Camsilo visitkort — delt brand-værktøjskasse (vektor, print-sikker)
//  Palette + flettet C-logo (parametrisk, 1:1 fra Logo.tsx) + valknut +
//  fletbånd + hjørnebeslag + QR-flise + tekst- og glød-helpers.
//  INGEN blur-filtre: alle "glød"-effekter er radiale gradienter, så
//  PDF'en forbliver skarp vektor i tryk.
// ──────────────────────────────────────────────────────────────

export const C = {
  bg: '#0d0b09', bgRaise: '#16110c', bgWarm: '#1d1207',
  ink: '#f5f0e8', dim: '#b8aa99', faint: '#9b8c7c',
  ember: '#f26a1b', emberDeep: '#b8400a', emberLight: '#ff8a44', emberGold: '#ffc070',
  oak: '#b07a42', onEmber: '#1c0f05', seid: '#74e3d2',
  plaque: '#f4ecdd', plaqueEdge: '#e6d6bb', qrDark: '#171008',
};

// 8-cifret hex (rrggbbaa) — universelt understøttet i moderne renderere + Chrome→PDF
export const a = (hex, alpha) =>
  hex + Math.round(Math.max(0, Math.min(1, alpha)) * 255).toString(16).padStart(2, '0');

const FAM = {
  display: "'Unbounded'", body: "'Schibsted Grotesk'",
  mono: "'Fragment Mono'", rune: "'Noto Sans Runic'",
};

export const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// SVG-tekst i mm-koordinater
export function T(x, y, str, o = {}) {
  const {
    size = 2.4, fill = C.ink, family = 'body', weight = 400, spacing = 0,
    anchor = 'start', opacity = 1, upper = false, style = '',
  } = o;
  const s = upper ? String(str).toUpperCase() : String(str);
  return `<text x="${x}" y="${y}" font-family="${FAM[family]}, sans-serif" `
    + `font-size="${size}" font-weight="${weight}" letter-spacing="${spacing}" `
    + `fill="${fill}" text-anchor="${anchor}" opacity="${opacity}" `
    + `style="font-feature-settings:'kern';${style}">${esc(s)}</text>`;
}

// ── Flettet C-logomærke ─────────────────────────────────────────
//  Parametrik overført 1:1 fra src/components/Logo.tsx (deterministisk).
const CX = 32, R0 = 18.6, AMP = 5.0, TWISTS = 5, N = 150, A0 = 46, A1 = 314, WIN = 0.072;
const LW = 5.3, CASE = LW + 3.6, CARVE_N = 26, CARVE_LEN = LW * 0.9, SLANT = 0.52;
const pt = (aDeg, r) => {
  const ang = (aDeg * Math.PI) / 180;
  return [CX + r * Math.cos(ang), CX + r * Math.sin(ang)];
};
const band = (t, sign, shift = 0) => {
  const aDeg = A0 + (A1 - A0) * t;
  const off = AMP * Math.sin(t * TWISTS * Math.PI);
  return pt(aDeg, R0 + sign * off + shift);
};
function lpath(sign, lo = 0, hi = 1, shift = 0) {
  let d = '';
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    if (t < lo - 1e-9 || t > hi + 1e-9) continue;
    const [x, y] = band(t, sign, shift);
    d += `${d ? 'L' : 'M'}${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  return d;
}
function carve(sign, lo, hi, count) {
  let d = '';
  const dt = 0.6 / N, h = CARVE_LEN / 2;
  for (let k = 0; k < count; k++) {
    const t = lo + (hi - lo) * ((k + 0.5) / count);
    const [x, y] = band(t, sign);
    const [ax, ay] = band(Math.max(0, t - dt), sign);
    const [bx, by] = band(Math.min(1, t + dt), sign);
    let tx = bx - ax, ty = by - ay;
    const L = Math.hypot(tx, ty) || 1; tx /= L; ty /= L;
    const px = -ty, py = tx, c = Math.cos(SLANT), s = Math.sin(SLANT);
    const dx = px * c + tx * s, dy = py * c + ty * s;
    d += `M${(x - dx * h).toFixed(2)} ${(y - dy * h).toFixed(2)}L${(x + dx * h).toFixed(2)} ${(y + dy * h).toFixed(2)}`;
  }
  return d;
}
const OAK = lpath(-1), EMBER = lpath(1);
const OAK_GRAIN_HI = lpath(-1, 0, 1, 1.25), OAK_GRAIN_LO = lpath(-1, 0, 1, -1.25);
const OAK_CARVE = carve(-1, 0, 1, CARVE_N), EMBER_CARVE = carve(1, 0, 1, CARVE_N);
const FLIP_CS = [1, 3].map((k) => k / TWISTS);
const FLIPS = FLIP_CS.map((c) => lpath(-1, c - WIN, c + WIN));
const FLIP_CARVES = FLIP_CS.map((c) => carve(-1, c - WIN, c + WIN, 5));
const E0 = band(0, 1), E1 = band(1, 1);

// markInner: paths i 64×64-koordinat. bg = casing-farve (gabet mellem bånd).
export function markInner(uid, { bg = C.bg, texture = true } = {}) {
  const idE = `E-${uid}`, idO = `O-${uid}`, idR = `R-${uid}`;
  const sj = 'fill="none" stroke-linecap="round" stroke-linejoin="round"';
  const carveOak = `fill="none" stroke="#33210f" stroke-width="1.0" stroke-opacity="0.55" stroke-linecap="round"`;
  const carveEmber = `fill="none" stroke="${a('#ffe4c2', 0.4)}" stroke-width="0.9" stroke-linecap="round"`;
  const grain = `fill="none" stroke="#3a2614" stroke-width="0.75" stroke-opacity="0.45" stroke-linecap="round"`;
  const flips = FLIPS.map((d, i) =>
    `<path d="${d}" stroke="${bg}" stroke-width="${CASE}" ${sj}/>`
    + `<path d="${d}" stroke="url(#${idO})" stroke-width="${LW}" ${sj}/>`
    + (texture ? `<path d="${FLIP_CARVES[i]}" ${carveOak}/>` : '')
  ).join('');
  const rivets = [E0, E1].map(([x, y]) =>
    `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="4.0" fill="${bg}"/>`
    + `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="3.5" fill="url(#${idR})"/>`
    + `<circle cx="${(x - 0.9).toFixed(2)}" cy="${(y - 1.0).toFixed(2)}" r="1.05" fill="${a('#fff4e4', 0.9)}"/>`
  ).join('');
  return `
  <defs>
    <linearGradient id="${idE}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${C.emberDeep}"/>
      <stop offset="48%" stop-color="${C.ember}"/>
      <stop offset="100%" stop-color="${C.emberGold}"/>
    </linearGradient>
    <linearGradient id="${idO}" x1="1" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#5c3d20"/>
      <stop offset="50%" stop-color="${C.oak}"/>
      <stop offset="100%" stop-color="#e3a866"/>
    </linearGradient>
    <radialGradient id="${idR}" cx="38%" cy="34%" r="72%">
      <stop offset="0%" stop-color="#ffe6c4"/>
      <stop offset="42%" stop-color="${C.emberLight}"/>
      <stop offset="100%" stop-color="${C.emberDeep}"/>
    </radialGradient>
  </defs>
  <g ${sj}>
    <path d="${OAK}" stroke="${bg}" stroke-width="${CASE}"/>
    <path d="${OAK}" stroke="url(#${idO})" stroke-width="${LW}"/>
    ${texture ? `<path d="${OAK_GRAIN_HI}" ${grain}/><path d="${OAK_GRAIN_LO}" ${grain}/><path d="${OAK_CARVE}" ${carveOak}/>` : ''}
    <path d="${EMBER}" stroke="${bg}" stroke-width="${CASE}"/>
    <path d="${EMBER}" stroke="url(#${idE})" stroke-width="${LW}"/>
    ${texture ? `<path d="${EMBER_CARVE}" ${carveEmber}/>` : ''}
    ${flips}
    ${rivets}
  </g>`;
}

// placér logomærke i mm: x,y = øverste venstre, size = mm
export function logo(x, y, size, uid, opts = {}) {
  return `<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="0 0 64 64" overflow="visible">${markInner(uid, opts)}</svg>`;
}

// ── Valknut (Odins tegn) — geometri 1:1 fra Ornaments.tsx, 100×100 ──
const TRI_A = [[29.0, 77.29], [92.01, 77.29], [60.5, 22.71]];
const TRI_B = [[7.99, 89.41], [71.0, 89.41], [39.5, 34.84]];
const TRI_C = [[7.99, 65.16], [71.0, 65.16], [39.5, 10.59]];
const PATCH_A = [[60.5, 22.71], [29.0, 77.29]];
const PATCH_B = [[39.5, 34.84], [51.05, 54.85]];
const triPath = (p) => `M${p[0][0]} ${p[0][1]}L${p[1][0]} ${p[1][1]}L${p[2][0]} ${p[2][1]}Z`;
const segPath = (p) => `M${p[0][0]} ${p[0][1]}L${p[1][0]} ${p[1][1]}`;
export function valknut(x, y, size, { color = C.ember, bg = C.bg, opacity = 1 } = {}) {
  const W = 6, CS = 9.6;
  const tris = [TRI_A, TRI_B, TRI_C].map((p) =>
    `<path d="${triPath(p)}" stroke="${bg}" stroke-width="${CS}"/>`
    + `<path d="${triPath(p)}" stroke="${color}" stroke-width="${W}"/>`).join('');
  const patches = [PATCH_A, PATCH_B].map((p) =>
    `<path d="${segPath(p)}" stroke="${bg}" stroke-width="${CS}" stroke-linecap="butt"/>`
    + `<path d="${segPath(p)}" stroke="${color}" stroke-width="${W}" stroke-linecap="butt"/>`).join('');
  return `<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="0 0 100 100" overflow="visible" opacity="${opacity}">`
    + `<g fill="none" stroke-linejoin="miter" stroke-miterlimit="8">${tris}${patches}</g></svg>`;
}

// ── Fletbånd (knotwork) — 48×24 flise fra Ornaments.tsx ─────────
export function knotBand(x, y, width, { color = C.ember, opacity = 0.6, scale = 0.22 } = {}) {
  const w = 3.4, tileW = 48 * scale, tileH = 24 * scale;
  const uid = `plait-${Math.round(x * 7 + y * 13 + width * 3)}`;
  return `<g opacity="${opacity}"><defs><pattern id="${uid}" width="${tileW}" height="${tileH}" patternUnits="userSpaceOnUse" patternTransform="translate(${x} ${y}) scale(${scale})">`
    + `<path d="M0 20 L12 4 L24 20 L36 4 L48 20" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="square"/>`
    + `<path d="M0 4 L12 20 L24 4 L36 20 L48 4" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="square"/>`
    + `<path d="M14.5 7.3 L21.5 16.7" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="square"/>`
    + `<path d="M38.5 7.3 L45.5 16.7" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="square"/>`
    + `</pattern></defs><rect x="${x}" y="${y}" width="${width}" height="${tileH}" fill="url(#${uid})"/></g>`;
}

// ── Hjørnebeslag (smedet vinkeljern) ────────────────────────────
export function corners(x, y, w, h, o = {}) {
  const { len = 3.4, sw = 0.3, color = C.ember, which = ['tl', 'br'] } = o;
  const seg = (px, py, dx, dy) =>
    `<path d="M${(px + dx).toFixed(2)} ${py.toFixed(2)} L${px.toFixed(2)} ${py.toFixed(2)} L${px.toFixed(2)} ${(py + dy).toFixed(2)}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="square"/>`;
  let p = '';
  if (which.includes('tl')) p += seg(x, y, len, len);
  if (which.includes('tr')) p += seg(x + w, y, -len, len);
  if (which.includes('bl')) p += seg(x, y + h, len, -len);
  if (which.includes('br')) p += seg(x + w, y + h, -len, -len);
  return p;
}

// ── QR-flise: cremet "smedet stempel" m. mørke moduler (maks. skanbar) ──
// matrix = {size, data[]}. cx,cy = midte. qrPx = QR-modulareal i mm.
// Returnerer { svg, plaqueSize } så kortet kan placere ramme/labels.
export function qrTile(matrix, cx, cy, qrPx, o = {}) {
  const { dark = C.qrDark, plaque = C.plaque, edge = C.plaqueEdge, frame = C.ember, brackets = true,
    grow = 1.03, round = 0 } = o;
  const m = matrix.size, mod = qrPx / m, quiet = 4.5 * mod;
  const plaqueSize = qrPx + 2 * quiet;
  const px0 = cx - plaqueSize / 2, py0 = cy - plaqueSize / 2;
  const qx0 = cx - qrPx / 2, qy0 = cy - qrPx / 2;
  let rects = '';
  for (let r = 0; r < m; r++) for (let c = 0; c < m; c++) {
    if (matrix.data[r * m + c]) {
      const X = qx0 + c * mod, Y = qy0 + r * mod;
      const w = mod * grow;
      rects += `<rect x="${X.toFixed(3)}" y="${Y.toFixed(3)}" width="${w.toFixed(3)}" height="${w.toFixed(3)}" rx="${(mod * round).toFixed(3)}"/>`;
    }
  }
  const rr = 1.4;
  const svg =
    `<rect x="${px0.toFixed(2)}" y="${py0.toFixed(2)}" width="${plaqueSize.toFixed(2)}" height="${plaqueSize.toFixed(2)}" rx="${rr}" fill="${plaque}" stroke="${edge}" stroke-width="0.25"/>`
    // "smedet stempel"-indre ramme: tynd ember-hårstreg → præget look, ikke app-screenshot
    + `<rect x="${(px0 + 0.85).toFixed(2)}" y="${(py0 + 0.85).toFixed(2)}" width="${(plaqueSize - 1.7).toFixed(2)}" height="${(plaqueSize - 1.7).toFixed(2)}" rx="${(rr - 0.6).toFixed(2)}" fill="none" stroke="${a(frame, 0.16)}" stroke-width="0.18"/>`
    + `<g fill="${dark}">${rects}</g>`
    + (brackets ? corners(px0 + 0.7, py0 + 0.7, plaqueSize - 1.4, plaqueSize - 1.4, { len: 2.2, sw: 0.34, color: frame, which: ['tl', 'tr', 'bl', 'br'] }) : '');
  return { svg, plaqueSize, px0, py0 };
}

// ── Glød-baggrunde (radiale gradienter — ingen blur) ────────────
//  defs() leverer genbrugte gradient-defs; brug via fill="url(#id)".
export function sharedDefs() {
  return `
  <linearGradient id="bgfield" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="${C.bg}"/>
    <stop offset="55%" stop-color="${C.bgRaise}"/>
    <stop offset="100%" stop-color="${C.bgWarm}"/>
  </linearGradient>
  <radialGradient id="forge" cx="50%" cy="0%" r="75%">
    <stop offset="0%" stop-color="${a(C.ember, 0.20)}"/>
    <stop offset="38%" stop-color="${a(C.emberDeep, 0.09)}"/>
    <stop offset="72%" stop-color="${a(C.ember, 0)}"/>
  </radialGradient>
  <radialGradient id="emberGlow" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="${a(C.ember, 0.55)}"/>
    <stop offset="45%" stop-color="${a(C.ember, 0.18)}"/>
    <stop offset="100%" stop-color="${a(C.ember, 0)}"/>
  </radialGradient>
  <radialGradient id="seidGlow" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="${a(C.seid, 0.30)}"/>
    <stop offset="60%" stop-color="${a(C.seid, 0.07)}"/>
    <stop offset="100%" stop-color="${a(C.seid, 0)}"/>
  </radialGradient>
  <radialGradient id="mote" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="#ffe2b0"/>
    <stop offset="55%" stop-color="${C.ember}"/>
    <stop offset="100%" stop-color="${a(C.ember, 0)}"/>
  </radialGradient>
  <linearGradient id="emberText" x1="0" y1="0" x2="1" y2="0.3">
    <stop offset="0%" stop-color="${C.emberDeep}"/>
    <stop offset="45%" stop-color="${C.ember}"/>
    <stop offset="100%" stop-color="#ffc664"/>
  </linearGradient>
  <linearGradient id="hairline" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="${a(C.ember, 0.7)}"/>
    <stop offset="100%" stop-color="${a(C.ember, 0)}"/>
  </linearGradient>`;
}

// glødplet (ember-mote / lille gnist)
export const mote = (x, y, r, fill = 'url(#mote)', op = 1) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" opacity="${op}"/>`;

// rune-streng der staver CAMSILO
export const RUNES = 'ᚲᚨᛗᛋᛁᛚᛟ';
