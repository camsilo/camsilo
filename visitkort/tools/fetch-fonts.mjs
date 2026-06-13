import fs from 'node:fs';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
const cssURL = 'https://fonts.googleapis.com/css2'
  + '?family=Unbounded:wght@500;700;900'
  + '&family=Schibsted+Grotesk:wght@400;500;700'
  + '&family=Fragment+Mono'
  + '&family=Noto+Sans+Runic'
  + '&display=swap';
let css = await (await fetch(cssURL, { headers: { 'User-Agent': UA } })).text();
const urls = [...new Set([...css.matchAll(/url\((https:\/\/[^)]+\.woff2)\)/g)].map(m => m[1]))];
console.log('woff2 files:', urls.length);
let bytes = 0;
for (const u of urls) {
  const buf = Buffer.from(await (await fetch(u)).arrayBuffer());
  bytes += buf.length;
  css = css.split(u).join('data:font/woff2;base64,' + buf.toString('base64'));
}
fs.writeFileSync('F:/claudecode/camsilo/visitkort/build/fonts-embedded.css', css);
console.log('Embedded', urls.length, 'woff2 ·', (bytes/1024).toFixed(0), 'KB raw · wrote fonts-embedded.css');
