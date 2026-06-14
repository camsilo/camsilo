// Organiserer renderede filer i en ren afleverings-struktur:
//   tryk/     → print-klare PDF'er (til trykkeriet)
//   preview/  → PNG-previews (til at kigge på / godkende)
//   svg/      → redigérbare vektor-kilder
import fs from 'node:fs';
const ROOT = 'F:/claudecode/camsilo/visitkort';
const B = `${ROOT}/build`;
const CARDS = [
  { id: 'A', navn: 'esse', titel: 'Casper — Grundlægger & softwareudvikler' },
  { id: 'B', navn: 'odin-hud', titel: 'Casper — Founder & Software Developer' },
  { id: 'C', navn: 'runesten', titel: 'Brand-kort (kun CAMSILO)' },
];
for (const d of ['tryk', 'preview', 'svg']) fs.mkdirSync(`${ROOT}/${d}`, { recursive: true });
const cp = (from, to) => { fs.copyFileSync(from, to); return to.split('/').pop(); };
for (const c of CARDS) {
  const stem = `camsilo-visitkort-${c.id}-${c.navn}`;
  cp(`${B}/${stem}.pdf`, `${ROOT}/tryk/${stem}.pdf`);
  cp(`${B}/r-${c.id}-front.png`, `${ROOT}/preview/${c.id}-${c.navn}-forside.png`);
  cp(`${B}/r-${c.id}-back.png`, `${ROOT}/preview/${c.id}-${c.navn}-bagside.png`);
  cp(`${B}/r-${c.id}-both.png`, `${ROOT}/preview/${c.id}-${c.navn}-forside+bagside.png`);
  cp(`${B}/svg-${c.id}-forside.svg`, `${ROOT}/svg/${c.id}-${c.navn}-forside.svg`);
  cp(`${B}/svg-${c.id}-bagside.svg`, `${ROOT}/svg/${c.id}-${c.navn}-bagside.svg`);
  console.log(`Kort ${c.id} (${c.navn}) — ${c.titel}: pdf + 3 png + 2 svg`);
}
console.log('\nAfleveringsmapper: tryk/  preview/  svg/');
