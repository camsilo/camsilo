import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { qrTile } from './lib.mjs';
const ROOT = 'F:/claudecode/camsilo/visitkort';
const QR = JSON.parse(fs.readFileSync(`${ROOT}/qr-matrix.json`, 'utf8'));
const CHROME = 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe';
const { PNG } = await import(pathToFileURL('F:/claudecode/camsilo/node_modules/pngjs/lib/png.js').href);
const jm = await import(pathToFileURL('F:/claudecode/camsilo/node_modules/jsqr/dist/jsQR.js').href);
const jsQR = jm.default?.default || jm.default || jm;
// test ved REALISTISK kort-størrelse: QR=18.5mm (kort A), render som på kortet
const combos = [
  { grow: 1.04, round: 0.14 }, // nuværende
  { grow: 1.0, round: 0.08 },
  { grow: 1.0, round: 0 },
  { grow: 1.02, round: 0 },
  { grow: 0.92, round: 0.18 }, // mindre runde prikker m. luft
];
for (const cmb of combos) {
  const q = qrTile(QR, 13, 13, 18.5, cmb); // plads til plade ~24mm i 26mm felt
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="26mm" height="26mm" viewBox="0 0 26 26"><rect width="26" height="26" fill="#0d0b09"/>${q.svg}</svg>`;
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>@page{size:26mm 26mm;margin:0}*{margin:0}</style></head><body style="width:26mm;height:26mm">${svg}</body></html>`;
  const tag = `g${cmb.grow}_r${cmb.round}`;
  fs.writeFileSync(`${ROOT}/build/qrsw-${tag}.html`, html);
  const out = `${ROOT}/build/qrsw-${tag}.png`;
  // dsf 12 → 26mm*3.78*12 ≈ 1180px → modul ~ (18.5/29)*45px ≈ 29px : skarpt
  spawnSync(CHROME, ['--headless=new','--disable-gpu','--hide-scrollbars','--no-sandbox','--force-color-profile=srgb','--virtual-time-budget=3000','--force-device-scale-factor=12','--window-size=98,98',`--screenshot=${out}`, pathToFileURL(`${ROOT}/build/qrsw-${tag}.html`).href], { timeout: 60000 });
  const png = PNG.sync.read(fs.readFileSync(out));
  const res = jsQR(Uint8ClampedArray.from(png.data), png.width, png.height);
  console.log(`grow=${cmb.grow} round=${cmb.round}  (${png.width}px)  →`, res ? res.data : 'KAN IKKE DEKODES');
}
