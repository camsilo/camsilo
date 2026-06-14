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
const tests = [
  { name: 'B-config seid-frame 15.5', qpx: 15.5, frame: C.seid },
  { name: 'B-config ember-frame 15.5', qpx: 15.5, frame: C.ember },
  { name: 'B-config no-brackets 15.5', qpx: 15.5, frame: C.seid, brackets: false },
];
for (const t of tests) {
  const field = t.qpx + 9, c = field / 2;
  const q = qrTile(QR, c, c, t.qpx, { frame: t.frame, brackets: t.brackets !== false });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${field}mm" height="${field}mm" viewBox="0 0 ${field} ${field}"><rect width="${field}" height="${field}" fill="${C.bg}"/>${q.svg}</svg>`;
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>@page{size:${field}mm ${field}mm;margin:0}*{margin:0}</style></head><body style="width:${field}mm;height:${field}mm">${svg}</body></html>`;
  const tag = t.name.replace(/[^a-z0-9]/gi, '_');
  fs.writeFileSync(`${ROOT}/build/iso-${tag}.html`, html);
  const out = `${ROOT}/build/iso-${tag}.png`;
  const wpx = Math.round(field * 96 / 25.4);
  // test ved card-lignende opløsning (dsf 8) OG høj (dsf 16)
  for (const dsf of [8, 16]) {
    spawnSync(CHROME, ['--headless=new','--disable-gpu','--hide-scrollbars','--no-sandbox','--force-color-profile=srgb','--virtual-time-budget=3000',`--force-device-scale-factor=${dsf}`,`--window-size=${wpx},${wpx}`,`--screenshot=${out}`, pathToFileURL(`${ROOT}/build/iso-${tag}.html`).href], { timeout: 60000 });
    const png = PNG.sync.read(fs.readFileSync(out));
    const res = jsQR(Uint8ClampedArray.from(png.data), png.width, png.height);
    console.log(`${t.name} @dsf${dsf} (${png.width}px, ${(png.width/(field)*t.qpx/29).toFixed(1)}px/modul) -> ` + (res && res.data==='https://camsilo.dk' ? 'OK' : (res?res.data:'FEJL')));
  }
}
