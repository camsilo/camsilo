import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
const { PNG } = await import(pathToFileURL('F:/claudecode/camsilo/node_modules/pngjs/lib/png.js').href);
const jm = await import(pathToFileURL('F:/claudecode/camsilo/node_modules/jsqr/dist/jsQR.js').href);
const jsQR = jm.default?.default || jm.default || jm;
const QR = JSON.parse(fs.readFileSync('F:/claudecode/camsilo/visitkort/qr-matrix.json','utf8'));
const m = QR.size, S = 12, Q = 4, dim = (m + 2*Q)*S;
function render(transpose){
  const png = new PNG({width:dim, height:dim});
  for (let y=0;y<dim;y++) for (let x=0;x<dim;x++){ const i=(y*dim+x)*4; png.data[i]=png.data[i+1]=png.data[i+2]=255; png.data[i+3]=255; }
  for (let r=0;r<m;r++) for (let c=0;c<m;c++){
    const bit = transpose ? QR.data[c*m+r] : QR.data[r*m+c];
    if(!bit) continue;
    for (let dy=0;dy<S;dy++) for (let dx=0;dx<S;dx++){
      const X=(Q+c)*S+dx, Y=(Q+r)*S+dy, i=(Y*dim+X)*4;
      png.data[i]=png.data[i+1]=png.data[i+2]=0;
    }
  }
  return png;
}
for (const t of [false,true]){
  const png = render(t);
  const res = jsQR(Uint8ClampedArray.from(png.data), dim, dim);
  console.log((t?'transposed':'normal   ')+':', res ? res.data : 'null');
}
