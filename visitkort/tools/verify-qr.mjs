import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { qrTile, C } from './lib.mjs';
const ROOT = 'F:/claudecode/camsilo/visitkort';
const QR = JSON.parse(fs.readFileSync(`${ROOT}/qr-matrix.json`, 'utf8'));
const FONTS = ''; // ikke nødvendigt for QR
// QR-only side, stor (50mm) så moduler er klare
const q = qrTile(QR, 35, 35, 50);
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="70mm" height="70mm" viewBox="0 0 70 70"><rect width="70" height="70" fill="#fff"/>${q.svg}</svg>`;
const html = `<!doctype html><html><head><meta charset="utf-8"><style>@page{size:70mm 70mm;margin:0}*{margin:0}html,body{background:#fff}</style></head><body style="width:70mm;height:70mm">${svg}</body></html>`;
fs.writeFileSync(`${ROOT}/build/qr-only.html`, html);
const CHROME = 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe';
const out = `${ROOT}/build/qr-only.png`;
spawnSync(CHROME, ['--headless=new','--disable-gpu','--hide-scrollbars','--no-sandbox','--force-color-profile=srgb','--virtual-time-budget=3000','--force-device-scale-factor=4','--window-size=265,265',`--screenshot=${out}`, pathToFileURL(`${ROOT}/build/qr-only.html`).href], { timeout: 60000 });
const { PNG } = await import(pathToFileURL('F:/claudecode/camsilo/node_modules/pngjs/lib/png.js').href);
const jsQRmod = await import(pathToFileURL('F:/claudecode/camsilo/node_modules/jsqr/dist/jsQR.js').href);
const jsQR = jsQRmod.default || jsQRmod;
const png = PNG.sync.read(fs.readFileSync(out));
const res = jsQR(Uint8ClampedArray.from(png.data), png.width, png.height);
console.log('billede:', png.width + 'x' + png.height);
console.log('DEKODET:', res ? JSON.stringify(res.data) : 'KUNNE IKKE DEKODES');
console.log('forventet: "https://camsilo.dk" →', res && res.data === 'https://camsilo.dk' ? 'MATCH ✓' : 'AFVIGER ✗');
