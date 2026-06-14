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
const sizes = [15, 15.5, 18.5];
const grows = [1.02, 1.03];
for (const grow of grows) for (const qpx of sizes) {
  const field = qpx + 9; // plads til plade
  const c = field / 2;
  const q = qrTile(QR, c, c, qpx, { grow, round: 0 });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${field}mm" height="${field}mm" viewBox="0 0 ${field} ${field}"><rect width="${field}" height="${field}" fill="#0d0b09"/>${q.svg}</svg>`;
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>@page{size:${field}mm ${field}mm;margin:0}*{margin:0}</style></head><body style="width:${field}mm;height:${field}mm">${svg}</body></html>`;
  const tag = `s${qpx}_g${grow}`;
  fs.writeFileSync(`${ROOT}/build/qrz-${tag}.html`, html);
  const out = `${ROOT}/build/qrz-${tag}.png`;
  const wpx = Math.round(field * 96 / 25.4);
  spawnSync(CHROME, ['--headless=new','--disable-gpu','--hide-scrollbars','--no-sandbox','--force-color-profile=srgb','--virtual-time-budget=3000','--force-device-scale-factor=10',`--window-size=${wpx},${wpx}`,`--screenshot=${out}`, pathToFileURL(`${ROOT}/build/qrz-${tag}.html`).href], { timeout: 60000 });
  const png = PNG.sync.read(fs.readFileSync(out));
  const res = jsQR(Uint8ClampedArray.from(png.data), png.width, png.height);
  console.log(`grow=${grow} qr=${qpx}mm → ` + (res && res.data==='https://camsilo.dk' ? 'MATCH ✓' : (res?res.data:'KAN IKKE DEKODES')));
}
