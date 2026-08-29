/**
 * Startgrundlag for E2E.
 *
 * Uden gennemført onboarding viser regnskabet kun Opsætning, uanset hvad der
 * står i ?del= — så uden det her ville testene måle en side, der aldrig
 * bliver vist. Data skrives til .e2e-data, som er engangs og aldrig rører
 * det rigtige regnskab.
 *
 * Tallene er de faktiske fra sagen: en britisk faktura dateret 19-12-2025 og
 * en dansk fra 22-06-2026. Det gør, at testene også fanger periodiseringen.
 */
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

const MAPPE = path.join(process.cwd(), ".e2e-data", "regnskab");

export default function globalSetup() {
  rmSync(path.join(process.cwd(), ".e2e-data"), { recursive: true, force: true });
  mkdirSync(MAPPE, { recursive: true });

  const skriv = (navn: string, data: unknown) =>
    writeFileSync(path.join(MAPPE, navn), JSON.stringify(data), "utf8");

  skriv("indstillinger.json", {
    onboardingFaerdig: true,
    virksomhedsnavn: "Testfirma",
    cvr: "45925145",
    virksomhedsform: "enkeltmandsvirksomhed",
    momsregistreret: true,
    momsperiode: "kvartal",
    foersteAar: 2025,
    kommuneskatPct: 25,
    kirkeskat: false,
    betalerBSkat: false,
  });

  skriv("fakturaer.json", [
    {
      id: "e2e-1",
      nummer: "INV-001",
      kunde: "BRITISK KUNDE LTD",
      land: "GB",
      kundeMomsnr: "GB 208411146",
      fakturadato: "2025-12-19",
      ydelse: "Udvikling",
      valuta: "GBP",
      beloebOere: 3_246_000,
      momsOere: 0,
      kurs: 8.5288,
      kursdato: "2025-12-19",
      kurskilde: "Danmarks Nationalbank",
      dkkOere: 27_684_485,
      momsDkkOere: 0,
      rubrik: "rubrikC",
      betalt: true,
      ts: 1,
    },
    {
      id: "e2e-2",
      nummer: "INV-002",
      kunde: "DANSK KUNDE",
      land: "DK",
      fakturadato: "2026-06-22",
      ydelse: "Oversættelse",
      valuta: "DKK",
      beloebOere: 6_000_000,
      momsOere: 1_500_000,
      kurs: 1,
      dkkOere: 6_000_000,
      momsDkkOere: 1_500_000,
      rubrik: "salgsmoms",
      betalt: true,
      ts: 2,
    },
  ]);

  skriv("kursdifferencer.json", [
    {
      id: "e2e-k1",
      fakturaId: "e2e-1",
      aar: 2026,
      bogfoertOere: 27_684_485,
      modtagetOere: 27_919_464,
      differenceOere: 234_979,
      ts: 3,
    },
  ]);

  // Nok posteringer til at grafer, målere og lister har noget at tegne —
  // og et meget stort tal, så et beløb, der flyder ud af sin boks, opdages.
  const nu = Date.now();
  skriv(
    "transaktioner.json",
    [
      { dato: "2025-11-03", tekst: "RENDER.COM", beloebOere: -2_346, konto: "firma",
        momsType: "omvendt3land", momsOere: 587, kategori: "hosting", afklaret: true },
      { dato: "2026-06-13", tekst: "ANTHROPIC* CLAUDE SUB", beloebOere: -129_141, konto: "firma",
        momsType: "omvendt3land", momsOere: 32_285, kategori: "software", afklaret: true },
      { dato: "2026-07-01", tekst: "BUNNYCDN", beloebOere: -6_653, konto: "firma",
        momsType: "omvendt", momsOere: 1_663, kategori: "hosting", afklaret: true },
      { dato: "2026-03-25", tekst: "Overført til privat konto", beloebOere: -15_075_530,
        konto: "firma", momsType: "udenfor", kategori: "privat-haevning", afklaret: true },
      { dato: "2026-07-06", tekst: "DANSK KUNDE - betaling INV-002", beloebOere: 7_497_180,
        konto: "firma", momsType: "udenfor", kategori: "salg", afklaret: true },
      { dato: "2026-08-20", tekst: "LØNOVERFØRSEL", beloebOere: 957_933, konto: "privat",
        momsType: "udenfor", kategori: "loen", afklaret: true },
      { dato: "2026-08-27", tekst: "Superbrugsen", beloebOere: -24_095, konto: "privat",
        momsType: "udenfor", kategori: "dagligvarer", afklaret: true },
      { dato: "2026-08-26", tekst: "Ukategoriseret postering", beloebOere: -12_500, konto: "privat" },
    ].map((t, i) => ({
      ...t,
      id: `e2e-t${i}`,
      importId: "e2e-import",
      fingeraftryk: `e2e${String(i).padStart(21, "0")}`,
      ts: nu - i * 1000,
    })),
  );

  skriv("indberetninger.json", []);
  skriv("regler.json", []);
  skriv("importlog.json", []);
  skriv("bilag.json", []);
}
