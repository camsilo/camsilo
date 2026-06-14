/**
 * Camsilo logo-asset generator.
 *
 * Kilde: ../src/app/icon.svg — den selvstændige master (hardkodede hex-farver der
 * matcher CSS-variablerne 1:1: --bg #0d0b09, --ember #f26a1b, --ember-deep #b8400a,
 * --ember-light #ff8a44, --oak #b07a42). Vi udleder tre vektor-mastere og rasteriserer
 * hver til en PNG-stige med sharp.
 *
 * Kør:  cd camsilo ; node brand/generate.mjs
 * Tilføj størrelser: redigér SIZES nedenfor og kør igen (idempotent — overskriver).
 */
import sharp from "sharp";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = join(HERE, "..", "src", "app", "icon.svg");
const svgDir = join(HERE, "svg");
const pngDir = join(HERE, "png");

const RECT = '  <rect width="64" height="64" rx="14" fill="#0d0b09"/>';

const master = readFileSync(SRC, "utf8");
if (!master.includes(RECT)) {
  throw new Error("Baggrunds-rect ikke fundet i icon.svg — generatoren skal opdateres.");
}

// Tre vektor-mastere afledt af samme kilde:
//  icon   = afrundet mørk flise (favicon/PWA/app-ikon)
//  square = mørk firkant uden afrunding (social/OG, maskable, platforme der selv afrunder)
//  mark   = transparent — kun det vævede C, til frilægning på enhver flade
const variants = {
  icon: master,
  square: master.replace('rx="14"', 'rx="0"'),
  mark: master.replace(RECT + "\n", "").replace(RECT, ""),
};

// PNG-størrelser pr. variant
const SIZES = {
  icon: [16, 32, 48, 64, 128, 180, 192, 256, 512, 1024],
  square: [256, 512, 1024, 2048],
  mark: [64, 128, 256, 512, 1024, 2048],
};

mkdirSync(svgDir, { recursive: true });
for (const v of Object.keys(variants)) mkdirSync(join(pngDir, v), { recursive: true });

// Skriv SVG-mastere
const svgNames = { icon: "camsilo-icon.svg", square: "camsilo-icon-square.svg", mark: "camsilo-mark.svg" };
for (const [v, svg] of Object.entries(variants)) {
  writeFileSync(join(svgDir, svgNames[v]), svg, "utf8");
}

// Rasterisér. Vi hæver SVG-densiteten pr. mål, så rasteriseringen altid sker ved
// fuld opløsning (skarpt selv ved 2048) — ikke en upscale af 64px.
let count = 0;
for (const [v, svg] of Object.entries(variants)) {
  const buf = Buffer.from(svg);
  for (const size of SIZES[v]) {
    const density = Math.ceil((72 * size) / 64);
    const out = join(pngDir, v, `${v}-${size}.png`);
    await sharp(buf, { density })
      .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ compressionLevel: 9 })
      .toFile(out);
    count++;
  }
}

// Bekvem favicon-kopi (32px afrundet ikon) i roden af png/
await sharp(Buffer.from(variants.icon), { density: Math.ceil((72 * 32) / 64) })
  .resize(32, 32)
  .png({ compressionLevel: 9 })
  .toFile(join(pngDir, "favicon-32.png"));

console.log(`Færdig: 3 SVG-mastere + ${count + 1} PNG'er skrevet til brand/`);
