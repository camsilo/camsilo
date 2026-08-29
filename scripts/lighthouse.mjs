/**
 * Lighthouse mod en lokal produktionsbygning.
 *
 * Browseren startes af Playwright frem for af Lighthouses egen chrome-launcher,
 * som fejler med EPERM på Windows, når den skal rydde sin midlertidige mappe op.
 * Vi kobler os i stedet på en Chromium, vi selv styrer.
 *
 *   node scripts/lighthouse.mjs <url> [flere urls …]
 */
import { chromium } from "playwright";
import lighthouse from "lighthouse";

const urls = process.argv.slice(2);
if (urls.length === 0) {
  console.error("Brug: node scripts/lighthouse.mjs <url> [url …]");
  process.exit(1);
}

const PORT = 9222;
const browser = await chromium.launch({
  args: [`--remote-debugging-port=${PORT}`, "--no-sandbox"],
});

const graenser = { performance: 85, accessibility: 95, "best-practices": 90, seo: 90 };

/**
 * Admin-siderne SKAL være noindex — de indeholder regnskabet. Lighthouse
 * trækker SEO-scoren i bund for netop det, så dér måles SEO ikke. Det er en
 * bevidst undtagelse, ikke en sænket målsætning.
 */
const erAdminSti = (u) => new URL(u).pathname.startsWith("/admin");
let fejlede = false;

try {
  for (const url of urls) {
    const r = await lighthouse(
      url,
      { port: PORT, output: "json", logLevel: "error" },
      {
        extends: "lighthouse:default",
        settings: {
          onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
          // Admin-sider kræver login; Lighthouse kører uden session og ser
          // derfor login-siden. Det er fint — vi måler den side, den ser.
          skipAudits: ["uses-http2"],
        },
      },
    );

    const lhr = r.lhr;
    console.log(`\n=== ${url} ===`);
    for (const [id, kat] of Object.entries(lhr.categories)) {
      const score = Math.round(kat.score * 100);
      const springOver = id === "seo" && erAdminSti(url);
      const graense = graenser[id] ?? 0;
      const ok = springOver || score >= graense;
      if (!ok) fejlede = true;
      const note = springOver ? " (noindex er tilsigtet — måles ikke)" : ` (mindst ${graense})`;
      console.log(`  ${ok ? "OK  " : "LAV "} ${kat.title.padEnd(16)} ${score}${note}`);
    }

    const problemer = Object.values(lhr.audits)
      .filter(
        (a) =>
          a.score !== null &&
          a.score < 1 &&
          a.scoreDisplayMode !== "notApplicable" &&
          a.scoreDisplayMode !== "informative",
      )
      .sort((a, b) => a.score - b.score)
      .slice(0, 12);

    if (problemer.length) {
      console.log("  Det trækker ned:");
      for (const p of problemer) {
        const v = p.displayValue ? ` — ${p.displayValue}` : "";
        console.log(`    · ${p.title}${v}`);
      }
    }
  }
} finally {
  await browser.close();
}

process.exit(fejlede ? 1 : 0);
