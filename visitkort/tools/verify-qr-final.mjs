import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { qrTile, C } from './lib.mjs';
const require = createRequire(import.meta.url);
const { PNG } = require('pngjs'); const jsQR = require('jsqr');
const ROOT = 'F:/claudecode/camsilo/visitkort';
const QR = JSON.parse(fs.readFileSync(`${ROOT}/qr-matrix.json`, 'utf8'));
const CHROME = 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe';
const EXPECT = 'https://camsilo.dk';
const dec = (png) => { const r = jsQR(Uint8ClampedArray.from(png.data), png.width, png.height); return r && r.data === EXPECT; };
const configs = [
  { id: 'A', qpx: 18.5, frame: C.ember }, { id: 'B', qpx: 17, frame: C.seid }, { id: 'C', qpx: 17, frame: C.ember },
];
for (const cfg of configs) {
  // PRIMÆR: modulgrid ved kortets fysiske opløsning (dsf8 ~ 30px/mm)
  const field = cfg.qpx + 9, c = field / 2;
  const q = qrTile(QR, c, c, cfg.qpx, { frame: cfg.frame });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${field}mm" height="${field}mm" viewBox="0 0 ${field} ${field}"><rect width="${field}" height="${field}" fill="${C.bg}"/>${q.svg}</svg>`;
  fs.writeFileSync(`${ROOT}/build/vf-${cfg.id}.html`, `<!doctype html><meta charset=utf-8><style>@page{size:${field}mm ${field}mm;margin:0}*{margin:0}</style><body style="width:${field}mm;height:${field}mm">${svg}`);
  const out = `${ROOT}/build/vf-${cfg.id}.png`;
  const wpx = Math.round(field * 96 / 25.4);
  spawnSync(CHROME, ['--headless=new','--disable-gpu','--hide-scrollbars','--no-sandbox','--force-color-profile=srgb','--virtual-time-budget=2500','--force-device-scale-factor=8',`--window-size=${wpx},${wpx}`,`--screenshot=${out}`, pathToFileURL(`${ROOT}/build/vf-${cfg.id}.html`).href], { timeout: 60000 });
  const grid = dec(PNG.sync.read(fs.readFileSync(out)));
  // SEKUNDÆR: fuldt kort-render
  const full = dec(PNG.sync.read(fs.readFileSync(`${ROOT}/build/r-${cfg.id}-back.png`)));
  console.log(`Kort ${cfg.id} (QR ${cfg.qpx}mm): modulgrid@kort-opløsning=${grid ? 'OK' : 'FEJL'} | fuldt-kort-jsQR=${full ? 'OK' : 'fejl(locator)'}`);
}
