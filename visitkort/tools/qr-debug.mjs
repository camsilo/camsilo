import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
const { PNG } = await import(pathToFileURL('F:/claudecode/camsilo/node_modules/pngjs/lib/png.js').href);
const jm = await import(pathToFileURL('F:/claudecode/camsilo/node_modules/jsqr/dist/jsQR.js').href);
const jsQR = jm.default?.default || jm.default || jm;
console.log('typeof jsQR:', typeof jsQR);
// 1) my render
const my = PNG.sync.read(fs.readFileSync('F:/claudecode/camsilo/visitkort/build/qr-only.png'));
console.log('my png:', my.width+'x'+my.height, 'dataLen=', my.data.length, 'expect4ch=', my.width*my.height*4);
let r1 = jsQR(Uint8ClampedArray.from(my.data), my.width, my.height);
console.log('my decode:', r1 ? r1.data : 'null');
// 2) control via qrcode lib
const QRCode = (await import(pathToFileURL('F:/claudecode/discipline-tracker/node_modules/qrcode/lib/index.js').href)).default
  || await import(pathToFileURL('F:/claudecode/discipline-tracker/node_modules/qrcode/lib/index.js').href);
await QRCode.toFile('F:/claudecode/camsilo/visitkort/build/qr-control.png', 'https://camsilo.dk', { errorCorrectionLevel:'H', margin:4, width:600 });
const ctl = PNG.sync.read(fs.readFileSync('F:/claudecode/camsilo/visitkort/build/qr-control.png'));
let r2 = jsQR(Uint8ClampedArray.from(ctl.data), ctl.width, ctl.height);
console.log('control png:', ctl.width+'x'+ctl.height, 'decode:', r2 ? r2.data : 'null');
