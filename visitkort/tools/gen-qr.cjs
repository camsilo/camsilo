// Genererer QR-matrix for camsilo.dk (vektor, høj fejlkorrektion → robust i tryk)
const QRCode = require('F:/claudecode/discipline-tracker/node_modules/qrcode');
const fs = require('fs');
const url = 'https://camsilo.dk';
const qr = QRCode.create(url, { errorCorrectionLevel: 'H' });
const size = qr.modules.size;
const data = Array.from(qr.modules.data, b => (b ? 1 : 0));
fs.writeFileSync(
  'F:/claudecode/camsilo/visitkort/qr-matrix.json',
  JSON.stringify({ url, ecc: 'H', size, data })
);
console.log('QR OK:', size + 'x' + size, 'moduler · ecc=H ·', url);
