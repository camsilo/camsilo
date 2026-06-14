import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { PNG } = require('pngjs');
const jsQR = require('jsqr');
const B = 'F:/claudecode/camsilo/visitkort/build/';
// kort-bagside renders er trim 85x55 (viewBox 3 3 85 55) ved 2568x1664
const PW = 2568, PH = 1664;
const bx = (x) => Math.round((x - 3) / 85 * PW);
const by = (y) => Math.round((y - 3) / 55 * PH);
// QR-plade-bbox i bleed-lokal mm (center, halv) pr. kort
const cards = {
  'r-A-back.png': { cx: 70, cy: 29.5, half: (18.5 + 9 * (18.5 / 29)) / 2 },
  'r-B-back.png': { cx: 68, cy: 27, half: (15.5 + 9 * (15.5 / 29)) / 2 },
  'r-C-back.png': { cx: 45.5, cy: 35.6, half: (15 + 9 * (15 / 29)) / 2 },
};
for (const [f, c] of Object.entries(cards)) {
  const src = PNG.sync.read(fs.readFileSync(B + f));
  const pad = 6; // mm ekstra
  const x0 = bx(c.cx - c.half - pad), x1 = bx(c.cx + c.half + pad);
  const y0 = by(c.cy - c.half - pad), y1 = by(c.cy + c.half + pad);
  const w = x1 - x0, h = y1 - y0;
  const crop = new PNG({ width: w, height: h });
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const si = ((y0 + y) * PW + (x0 + x)) * 4, di = (y * w + x) * 4;
    crop.data[di] = src.data[si]; crop.data[di + 1] = src.data[si + 1];
    crop.data[di + 2] = src.data[si + 2]; crop.data[di + 3] = 255;
  }
  fs.writeFileSync(B + 'crop-' + f, PNG.sync.write(crop));
  const res = jsQR(Uint8ClampedArray.from(crop.data), w, h);
  console.log(f.padEnd(12), `crop ${w}x${h}`, '->', res && res.data === 'https://camsilo.dk' ? 'SCANNER OK' : (res ? res.data : 'KAN IKKE DEKODES'));
}
