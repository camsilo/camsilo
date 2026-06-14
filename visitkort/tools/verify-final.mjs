import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { PNG } = require('pngjs');
const jsQR = require('jsqr');
const B = 'F:/claudecode/camsilo/visitkort/build/';
const EXPECT = 'https://camsilo.dk';
let allOk = true;
for (const f of ['r-A-back.png', 'r-B-back.png', 'r-C-back.png']) {
  const png = PNG.sync.read(fs.readFileSync(B + f));
  const res = jsQR(Uint8ClampedArray.from(png.data), png.width, png.height);
  const ok = res && res.data === EXPECT;
  allOk = allOk && ok;
  console.log(f.padEnd(12), `${png.width}x${png.height}`, '->', ok ? 'SCANNER OK ' + res.data : (res ? 'AFVIGER: ' + res.data : 'KAN IKKE DEKODES'));
}
console.log(allOk ? '\nALLE TRE QR-KODER SKANNER KORREKT' : '\nMINDST EN QR FEJLER');
