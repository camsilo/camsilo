/**
 * Kategoriserings-motoren — Odins første blik på en postering.
 *
 * To lag:
 *  1) LÆRTE regler (fra dine svar til Odin) — vinder altid.
 *  2) INDBYGGEDE mønstre for kendte danske forretninger/tjenester.
 *
 * Et match sætter kategori + moms/fradrags-defaults fra kategorien (eller
 * reglens egne overstyringer), men posteringen er først "afklaret", når du
 * selv har bekræftet den i Odin-spørge-flowet. Automatik foreslår — du bestemmer.
 */
import type { Konto, MomsType, Regel, Transaktion } from "./typer";
import { findKategori } from "./kategorier";

/** Normalisér en posteringstekst til mønster-matching og regel-læring. */
export function normaliserTekst(tekst: string): string {
  return tekst
    .toLowerCase()
    // Kortnota-støj og datoer i teksten
    .replace(/dankort-?nota|visa\/dankort|visa k(ø|oe)b|mastercard|kortk(ø|oe)b|nota/gi, " ")
    .replace(/den \d{1,2}[-./]\d{1,2}([-./]\d{2,4})?/g, " ")
    .replace(/\d{4,}/g, " ") // lange tal (kortnumre, referencer)
    .replace(/\s+/g, " ")
    .trim();
}

/** Udled et regel-mønster af en posteringstekst (til "husk denne forretning"). */
export function foreslaaMoenster(tekst: string): string {
  const n = normaliserTekst(tekst);
  // Behold de første 2-3 meningsbærende ord — nok til at kende forretningen igen.
  const ord = n.split(" ").filter((o) => o.length > 1);
  return ord.slice(0, 3).join(" ").slice(0, 40) || n.slice(0, 40);
}

type Moenster = {
  moenster: string;
  konto?: Konto;
  kategori: string;
  momsType?: MomsType;
  momsFradragPct?: number;
  fradragPct?: number;
  skatteRelevant?: boolean;
};

/**
 * Indbyggede mønstre — matches som delstreng i den normaliserede tekst.
 * Firma-relevante tjenester får firma-kategori når de står på firma-bogen,
 * men på privat-bogen lander de i privat-kategorier (styret af `konto`).
 */
const INDBYGGEDE: Moenster[] = [
  // ── Udenlandske dev/SaaS-tjenester (firma: omvendt betalingspligt).
  //    Kategoriens default er EU ("omvendt"); leverandører der typisk
  //    fakturerer fra USA/tredjeland overstyres til "omvendt3land",
  //    så rubrik A-ydelser (kun EU-køb) ikke overrapporteres. ──
  { moenster: "github", konto: "firma", kategori: "software", momsType: "omvendt3land" },
  { moenster: "openai", konto: "firma", kategori: "software", momsType: "omvendt3land" },
  { moenster: "anthropic", konto: "firma", kategori: "software", momsType: "omvendt3land" },
  { moenster: "adobe", konto: "firma", kategori: "software" },
  { moenster: "figma", konto: "firma", kategori: "software", momsType: "omvendt3land" },
  { moenster: "jetbrains", konto: "firma", kategori: "software" },
  { moenster: "microsoft", konto: "firma", kategori: "software" },
  { moenster: "google cloud", konto: "firma", kategori: "hosting" },
  { moenster: "google workspace", konto: "firma", kategori: "software" },
  { moenster: "vercel", konto: "firma", kategori: "hosting", momsType: "omvendt3land" },
  { moenster: "hoststack", konto: "firma", kategori: "hosting" },
  { moenster: "cloudflare", konto: "firma", kategori: "hosting", momsType: "omvendt3land" },
  { moenster: "digitalocean", konto: "firma", kategori: "hosting", momsType: "omvendt3land" },
  { moenster: "hetzner", konto: "firma", kategori: "hosting" },
  { moenster: "amazon web services", konto: "firma", kategori: "hosting" },
  { moenster: "aws emea", konto: "firma", kategori: "hosting" },
  { moenster: "godaddy", konto: "firma", kategori: "hosting", momsType: "omvendt3land" },
  { moenster: "one.com", konto: "firma", kategori: "hosting", momsType: "koebsmoms" },
  { moenster: "simply.com", konto: "firma", kategori: "hosting", momsType: "koebsmoms" },
  { moenster: "punktum", konto: "firma", kategori: "hosting", momsType: "koebsmoms" },
  { moenster: "dk hostmaster", konto: "firma", kategori: "hosting", momsType: "koebsmoms" },
  { moenster: "google ads", konto: "firma", kategori: "markedsfoering" },
  { moenster: "facebk", konto: "firma", kategori: "markedsfoering" },
  { moenster: "meta platforms", konto: "firma", kategori: "markedsfoering" },
  { moenster: "linkedin", konto: "firma", kategori: "markedsfoering" },
  { moenster: "elevenlabs", konto: "firma", kategori: "software", momsType: "omvendt3land" },
  { moenster: "namecheap", konto: "firma", kategori: "hosting", momsType: "omvendt3land" },
  { moenster: "stripe", konto: "firma", kategori: "bankgebyr" },

  // ── Skat / offentligt ──
  { moenster: "skattekonto", kategori: "moms-skat-betaling", konto: "firma" },
  { moenster: "skattestyrelsen", kategori: "skat-retur", konto: "privat" },
  { moenster: "b-skat", kategori: "skat-retur", konto: "privat", skatteRelevant: true },

  // ── Dagligvarer (privat) ──
  { moenster: "netto", konto: "privat", kategori: "dagligvarer" },
  { moenster: "f(ø|oe)tex", konto: "privat", kategori: "dagligvarer" },
  { moenster: "rema", konto: "privat", kategori: "dagligvarer" },
  { moenster: "lidl", konto: "privat", kategori: "dagligvarer" },
  { moenster: "aldi", konto: "privat", kategori: "dagligvarer" },
  { moenster: "bilka", konto: "privat", kategori: "dagligvarer" },
  { moenster: "coop", konto: "privat", kategori: "dagligvarer" },
  { moenster: "meny", konto: "privat", kategori: "dagligvarer" },
  { moenster: "spar ", konto: "privat", kategori: "dagligvarer" },
  { moenster: "l(ø|oe)vbjerg", konto: "privat", kategori: "dagligvarer" },
  { moenster: "nemlig.com", konto: "privat", kategori: "dagligvarer" },

  // ── Transport ──
  { moenster: "dsb", konto: "privat", kategori: "transport-privat" },
  { moenster: "rejsekort", konto: "privat", kategori: "transport-privat" },
  { moenster: "midttrafik", konto: "privat", kategori: "transport-privat" },
  { moenster: "movia", konto: "privat", kategori: "transport-privat" },
  { moenster: "circle k", konto: "privat", kategori: "transport-privat" },
  { moenster: "uno-x", konto: "privat", kategori: "transport-privat" },
  { moenster: "ok benzin", konto: "privat", kategori: "transport-privat" },
  { moenster: "q8", konto: "privat", kategori: "transport-privat" },
  { moenster: "shell", konto: "privat", kategori: "transport-privat" },
  { moenster: "easypark", konto: "privat", kategori: "transport-privat" },

  // ── Streaming / abonnementer (privat) ──
  { moenster: "spotify", konto: "privat", kategori: "abonnementer" },
  { moenster: "netflix", konto: "privat", kategori: "abonnementer" },
  { moenster: "hbo", konto: "privat", kategori: "abonnementer" },
  { moenster: "disney", konto: "privat", kategori: "abonnementer" },
  { moenster: "viaplay", konto: "privat", kategori: "abonnementer" },
  { moenster: "tv 2 play", konto: "privat", kategori: "abonnementer" },
  { moenster: "youtube premium", konto: "privat", kategori: "abonnementer" },
  { moenster: "playstation", konto: "privat", kategori: "underholdning" },
  { moenster: "steam", konto: "privat", kategori: "underholdning" },
  { moenster: "nintendo", konto: "privat", kategori: "underholdning" },

  // ── Telefon/internet ──
  { moenster: "yousee", konto: "privat", kategori: "telefon-internet-privat" },
  { moenster: "telenor", konto: "privat", kategori: "telefon-internet-privat" },
  { moenster: "telia", konto: "privat", kategori: "telefon-internet-privat" },
  { moenster: "telmore", konto: "privat", kategori: "telefon-internet-privat" },
  { moenster: "cbb", konto: "privat", kategori: "telefon-internet-privat" },
  { moenster: "oister", konto: "privat", kategori: "telefon-internet-privat" },
  { moenster: "lebara", konto: "privat", kategori: "telefon-internet-privat" },
  { moenster: "hiper", konto: "privat", kategori: "telefon-internet-privat" },
  { moenster: "fastspeed", konto: "privat", kategori: "telefon-internet-privat" },

  // ── El/varme/vand (privat) ──
  { moenster: "(ø|oe)rsted", konto: "privat", kategori: "el-varme-vand" },
  { moenster: "andel energi", konto: "privat", kategori: "el-varme-vand" },
  { moenster: "norlys", konto: "privat", kategori: "el-varme-vand" },
  { moenster: "nrgi", konto: "privat", kategori: "el-varme-vand" },
  { moenster: "ewii", konto: "privat", kategori: "el-varme-vand" },
  { moenster: "vindst(ø|oe)d", konto: "privat", kategori: "el-varme-vand" },

  // ── Forsikring ──
  { moenster: "tryg", konto: "privat", kategori: "forsikring-privat" },
  { moenster: "topdanmark", konto: "privat", kategori: "forsikring-privat" },
  { moenster: "alm. brand", konto: "privat", kategori: "forsikring-privat" },
  { moenster: "alm brand", konto: "privat", kategori: "forsikring-privat" },
  { moenster: "codan", konto: "privat", kategori: "forsikring-privat" },
  { moenster: "gf forsikring", konto: "privat", kategori: "forsikring-privat" },
  { moenster: "lb forsikring", konto: "privat", kategori: "forsikring-privat" },

  // ── Fagforening / A-kasse ──
  { moenster: "3f", konto: "privat", kategori: "fagforening" },
  { moenster: "hk ", konto: "privat", kategori: "fagforening" },
  { moenster: "krifa", konto: "privat", kategori: "fagforening" },
  { moenster: "ase", konto: "privat", kategori: "fagforening" },
  { moenster: "a-kasse", konto: "privat", kategori: "fagforening" },
  { moenster: "fagforening", konto: "privat", kategori: "fagforening" },
  { moenster: "prosa", konto: "privat", kategori: "fagforening" },
  { moenster: "ida ", konto: "privat", kategori: "fagforening" },

  // ── Restauranter / fastfood (privat) ──
  { moenster: "mcdonald", konto: "privat", kategori: "restauranter" },
  { moenster: "burger king", konto: "privat", kategori: "restauranter" },
  { moenster: "sunset", konto: "privat", kategori: "restauranter" },
  { moenster: "just eat", konto: "privat", kategori: "restauranter" },
  { moenster: "wolt", konto: "privat", kategori: "restauranter" },
  { moenster: "restaurant", konto: "privat", kategori: "restauranter" },
  { moenster: "cafe", konto: "privat", kategori: "restauranter" },
  { moenster: "espresso house", konto: "privat", kategori: "restauranter" },

  // ── Diverse ──
  { moenster: "mobilepay", konto: "privat", kategori: "mobilepay" },
  { moenster: "pengeautomat", kategori: "kontant", konto: "privat" },
  { moenster: "h(æ|ae)veautomat", kategori: "kontant", konto: "privat" },
  { moenster: "atm", kategori: "kontant", konto: "privat" },
  { moenster: "apotek", konto: "privat", kategori: "sundhed" },
  { moenster: "matas", konto: "privat", kategori: "toej" },
  { moenster: "l(ø|oe)n", konto: "privat", kategori: "loen" },
  { moenster: "salary", konto: "privat", kategori: "loen" },
  { moenster: "su styrelsen", konto: "privat", kategori: "offentlig-ydelse" },
  { moenster: "udbetaling danmark", konto: "privat", kategori: "offentlig-ydelse" },
];

/** Kompilér de indbyggede mønstre til regex-venlige matchere (én gang). */
const KOMPILEREDE = INDBYGGEDE.map((m) => ({
  ...m,
  rx: new RegExp(m.moenster.includes("(") ? m.moenster : escapeRx(m.moenster), "i"),
}));

function escapeRx(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export type Forslag = {
  kategori: string;
  momsType?: MomsType;
  momsFradragPct?: number;
  fradragPct?: number;
  skatteRelevant?: boolean;
  kilde: "laert" | "indbygget";
};

/**
 * Find Odins bedste forslag til en postering. Lærte regler vinder over
 * indbyggede; længere (mere specifikke) mønstre vinder over kortere.
 */
export function foreslaaKategori(
  tekst: string,
  konto: Konto,
  laerte: Regel[],
): Forslag | null {
  const n = normaliserTekst(tekst);

  // 1) Lærte regler — mest specifikke (længste mønster) først.
  const laertMatch = laerte
    .filter((r) => !r.konto || r.konto === konto)
    .filter((r) => n.includes(r.moenster.toLowerCase()))
    .sort((a, b) => b.moenster.length - a.moenster.length)[0];
  if (laertMatch) {
    return {
      kategori: laertMatch.kategori,
      momsType: laertMatch.momsType,
      momsFradragPct: laertMatch.momsFradragPct,
      fradragPct: laertMatch.fradragPct,
      skatteRelevant: laertMatch.skatteRelevant,
      kilde: "laert",
    };
  }

  // 2) Indbyggede mønstre.
  const match = KOMPILEREDE.filter((m) => !m.konto || m.konto === konto)
    .filter((m) => m.rx.test(n))
    .sort((a, b) => b.moenster.length - a.moenster.length)[0];
  if (!match) return null;
  return {
    kategori: match.kategori,
    momsType: match.momsType,
    momsFradragPct: match.momsFradragPct,
    fradragPct: match.fradragPct,
    skatteRelevant: match.skatteRelevant,
    kilde: "indbygget",
  };
}

/**
 * Anvend et kategorivalg på en postering: kategoriens defaults + evt.
 * overstyringer, og udregn momsbeløbet. Bruges både af auto-forslag og
 * når du svarer Odin.
 */
export function anvendKategori(
  t: Pick<Transaktion, "konto" | "beloebOere">,
  kategoriId: string,
  overstyr?: {
    momsType?: MomsType;
    momsFradragPct?: number;
    fradragPct?: number;
    skatteRelevant?: boolean;
  },
): Partial<Transaktion> {
  const k = findKategori(kategoriId);
  const patch: Partial<Transaktion> = { kategori: kategoriId };

  if (t.konto === "firma") {
    const momsType = overstyr?.momsType ?? k?.momsType ?? "koebsmoms";
    const momsFradragPct = overstyr?.momsFradragPct ?? k?.momsFradragPct ?? 100;
    const fradragPct = overstyr?.fradragPct ?? k?.fradragPct ?? 100;
    patch.momsType = momsType;
    patch.momsFradragPct = momsFradragPct;
    patch.fradragPct = fradragPct;
    patch.momsOere = beregnMoms(t.beloebOere, momsType);
  } else {
    patch.skatteRelevant = overstyr?.skatteRelevant ?? k?.skatteRelevant ?? false;
  }
  return patch;
}

/**
 * Momsbeløb (fortegnsløst, øre) for et bruttobeløb efter momstype:
 * - salgsmoms/koebsmoms: 25 % moms indeholdt i beløbet → moms = 20 % af brutto.
 * - omvendt/omvendt3land: udenlandsk nettofaktura → beregnet dansk moms =
 *   25 % af beløbet (mekanikken er ens for EU og tredjeland).
 * - momsfri/udenfor: 0.
 */
export function beregnMoms(beloebOere: number, momsType: MomsType): number {
  const brutto = Math.abs(beloebOere);
  switch (momsType) {
    case "salgsmoms":
    case "koebsmoms":
      return Math.round(brutto / 5);
    case "omvendt":
    case "omvendt3land":
      return Math.round(brutto / 4);
    default:
      return 0;
  }
}
