/**
 * CSV-importer for danske bank-kontoudtog — bygget til at æde, hvad danske
 * netbanker spytter ud, uden konfiguration:
 *
 * - Encoding: UTF-8 (m/u BOM) ELLER Windows-1252/ISO-8859-1 (Danske Bank m.fl.
 *   eksporterer stadig i legacy-tegnsæt — detekteres på ugyldige UTF-8-sekvenser).
 * - Separator: ; (dansk standard), , eller tab — detekteres pr. fil.
 * - Talformat: "1.234,56" (dansk), "1,234.56" (engelsk), "-1234.56" — detekteres.
 * - Dato: dd-mm-yyyy, dd.mm.yyyy, dd/mm/yyyy, yyyy-mm-dd m.fl.
 * - Kolonner: findes via header-navne (Dato/Tekst/Beløb/Saldo og engelske
 *   pendanter) — og falder tilbage på indholds-heuristik uden header.
 * - Dedup: fingeraftryk pr. postering, så overlappende eksporter er ufarlige.
 *
 * Parseren er bevidst tilgivende: ulæselige linjer springes over og TÆLLES,
 * frem for at vælte hele importen.
 */
import { createHash } from "crypto";
import type { Konto } from "./typer";

export type ParsedRaekke = {
  dato: string; // ISO yyyy-mm-dd
  tekst: string;
  beloebOere: number;
  saldoOere?: number;
};

export type ParseResultat = {
  raekker: ParsedRaekke[];
  fejllinjer: number;
  /** Hvad detektionen landede på — vises i forhåndsvisningen. */
  detekteret: {
    encoding: "utf-8" | "windows-1252";
    separator: string;
    harHeader: boolean;
    kolonner: { dato: number; tekst: number; beloeb: number; saldo?: number };
  };
};

// ── Encoding ────────────────────────────────────────────────────

/** Afkod bytes: UTF-8 hvis gyldig, ellers Windows-1252 (dækker også ISO-8859-1). */
export function afkodBytes(bytes: Uint8Array): {
  tekst: string;
  encoding: "utf-8" | "windows-1252";
} {
  try {
    const utf8 = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    // Strip evt. BOM
    return { tekst: utf8.replace(/^﻿/, ""), encoding: "utf-8" };
  } catch {
    const cp1252 = new TextDecoder("windows-1252").decode(bytes);
    return { tekst: cp1252, encoding: "windows-1252" };
  }
}

// ── Linje-splitting med citat-håndtering ────────────────────────

/** Split én CSV-linje på separatoren under hensyn til "..."-citater. */
function splitLinje(linje: string, sep: string): string[] {
  const felter: string[] = [];
  let felt = "";
  let iCitat = false;
  for (let i = 0; i < linje.length; i++) {
    const c = linje[i];
    if (c === '"') {
      if (iCitat && linje[i + 1] === '"') {
        felt += '"';
        i++;
      } else {
        iCitat = !iCitat;
      }
    } else if (c === sep && !iCitat) {
      felter.push(felt);
      felt = "";
    } else {
      felt += c;
    }
  }
  felter.push(felt);
  return felter.map((f) => f.trim());
}

/** Detektér separator: den kandidat der giver flest OG mest stabile felter. */
function detekterSeparator(linjer: string[]): string {
  const kandidater = [";", ",", "\t"];
  let bedst = ";";
  let bedstScore = -1;
  let bedstAntal = 0;
  for (const sep of kandidater) {
    const antal = linjer.slice(0, 25).map((l) => splitLinje(l, sep).length);
    const medFlere = antal.filter((n) => n >= 3);
    if (medFlere.length === 0) continue;
    // Stabilitet: hyppigste feltantal
    const hyppighed = new Map<number, number>();
    for (const n of medFlere) hyppighed.set(n, (hyppighed.get(n) ?? 0) + 1);
    const score = Math.max(...hyppighed.values()) * 100 + medFlere.length;
    const stabiltAntal = [...hyppighed.entries()].sort(
      (a, b) => b[1] - a[1] || b[0] - a[0],
    )[0][0];
    // Uafgjort brydes til fordel for FLEST felter — en tab-separeret fil uden
    // kommaer må aldrig tabe til komma-kandidaten på ren rækkefølge.
    if (score > bedstScore || (score === bedstScore && stabiltAntal > bedstAntal)) {
      bedstScore = score;
      bedstAntal = stabiltAntal;
      bedst = sep;
    }
  }
  return bedst;
}

// ── Tal og datoer ───────────────────────────────────────────────

/**
 * Parse et pengebeløb til øre. Håndterer "1.234,56", "1,234.56", "-1234.56",
 * "1234", "+512,00", omgivende valuta ("DKK", "kr.") og NBSP-tusindtals-
 * separatorer. `format` afgør de TVETYDIGE tilfælde ("1.234"/"1,234" med
 * præcis 3 cifre efter separatoren) — uden format antages dansk.
 * Returnerer null hvis strengen ikke er et beløb.
 */
export function parseBeloebOere(raa: string, format?: "dk" | "en"): number | null {
  let s = raa
    .replace(/ /g, "") // NBSP
    .replace(/(kr\.?|dkk)/gi, "")
    .replace(/\s/g, "")
    .trim();
  if (!s) return null;
  let negativ = false;
  if (/^\(.*\)$/.test(s)) {
    negativ = true; // regnskabsnotation (123,45)
    s = s.slice(1, -1);
  }
  if (s.startsWith("-")) {
    negativ = true;
    s = s.slice(1);
  } else if (s.startsWith("+")) {
    s = s.slice(1);
  }
  if (!/^[\d.,]+$/.test(s)) return null;

  const sidstePunkt = s.lastIndexOf(".");
  const sidsteKomma = s.lastIndexOf(",");
  let heltal: string;
  let decimaler = "00";

  if (sidstePunkt >= 0 && sidsteKomma >= 0) {
    // Begge til stede — den SIDSTE er decimalseparator.
    const decPos = Math.max(sidstePunkt, sidsteKomma);
    heltal = s.slice(0, decPos).replace(/[.,]/g, "");
    decimaler = s.slice(decPos + 1);
  } else if (sidsteKomma >= 0) {
    const efter = s.slice(sidsteKomma + 1);
    if (efter.length === 3) {
      // "1,234" — tvetydig. Engelsk format: komma er ALTID tusindtal.
      // Dansk: komma med 3 cifre efter læses også som tusindtal.
      heltal = s.replace(/,/g, "");
    } else {
      heltal = s.slice(0, sidsteKomma).replace(/[.,]/g, "");
      decimaler = efter;
    }
  } else if (sidstePunkt >= 0) {
    const efter = s.slice(sidstePunkt + 1);
    if (efter.length === 3 && format !== "en") {
      // "1.234" i dansk kontekst = tusindtalsseparator; i en fil der beviseligt
      // bruger engelsk talformat er punktum decimaltegn (fx Revoluts veksel-
      // linjer med 3 decimaler) — ellers ville beløbet blive 1000× for stort.
      heltal = s.replace(/\./g, "");
    } else {
      heltal = s.slice(0, sidstePunkt).replace(/[.,]/g, "");
      decimaler = efter;
    }
  } else {
    heltal = s;
  }

  if (!/^\d+$/.test(heltal) || !/^\d{1,2}$/.test(decimaler.padEnd(2, "0").slice(0, 2))) {
    if (!/^\d+$/.test(heltal)) return null;
  }
  const oere =
    parseInt(heltal, 10) * 100 + parseInt(decimaler.padEnd(2, "0").slice(0, 2), 10);
  if (!Number.isSafeInteger(oere)) return null;
  return negativ ? -oere : oere;
}

/** Parse en dato til ISO yyyy-mm-dd. Dansk rækkefølge (dag først) antages. */
export function parseDato(raa: string): string | null {
  const s = raa.trim().replace(/ /g, "");
  // ISO: 2026-07-08 (evt. med tid bagefter)
  let m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return gyldigIso(m[1], m[2], m[3]);
  // dd-mm-yyyy / dd.mm.yyyy / dd/mm/yyyy / dd-mm-yy
  m = s.match(/^(\d{1,2})[-./](\d{1,2})[-./](\d{2,4})$/);
  if (m) {
    const aar = m[3].length === 2 ? `20${m[3]}` : m[3];
    return gyldigIso(aar, m[2].padStart(2, "0"), m[1].padStart(2, "0"));
  }
  return null;
}

function gyldigIso(aar: string, md: string, dag: string): string | null {
  const a = Number(aar);
  const m = Number(md);
  const d = Number(dag);
  if (a < 1990 || a > 2100 || m < 1 || m > 12 || d < 1 || d > 31) return null;
  return `${aar}-${md}-${dag}`;
}

// ── Kolonne-detektion ───────────────────────────────────────────

const HEADER_DATO = /^(bogf(ø|oe?)ringsdato|dato|date|booking ?date|completed ?date|transaktionsdato|value ?date|started ?date)$/i;
// Tekst-kolonnen matches i to prioriterede runder: stærke navne (den fulde
// posteringstekst) før svage (Nordeas "Modtager" m.fl., der ofte er tom ved
// indbetalinger og ellers ville stjæle kolonnen på ren position).
const HEADER_TEKST_STAERK = /^(tekst|posteringstekst|description|beskrivelse|message|narrative|title|titel)$/i;
const HEADER_TEKST_SVAG = /^(navn|modtager|payee|reference|transaktionstype)$/i;
const HEADER_BELOEB = /^(bel(ø|oe?)b|amount|bel(ø|oe?)b i dkk|amount \(dkk\)|value|sum)$/i;
const HEADER_SALDO = /^(saldo|balance|disponibel(t)? ?(bel(ø|oe?)b)?|bogf(ø|oe?)rt saldo)$/i;

function rensHeader(h: string): string {
  return h.replace(/^"|"$/g, "").trim();
}

type Kolonner = { dato: number; tekst: number; beloeb: number; saldo?: number };

function findKolonnerFraHeader(felter: string[]): Kolonner | null {
  let dato = -1;
  let tekst = -1;
  let beloeb = -1;
  let saldo = -1;
  felter.forEach((raaF, i) => {
    const f = rensHeader(raaF);
    if (dato < 0 && HEADER_DATO.test(f)) dato = i;
    else if (tekst < 0 && HEADER_TEKST_STAERK.test(f)) tekst = i;
    else if (beloeb < 0 && HEADER_BELOEB.test(f)) beloeb = i;
    else if (saldo < 0 && HEADER_SALDO.test(f)) saldo = i;
  });
  // Anden runde: svage tekst-navne bruges kun hvis intet stærkt navn fandtes.
  if (tekst < 0) {
    felter.forEach((raaF, i) => {
      if (tekst < 0 && i !== dato && i !== beloeb && i !== saldo &&
          HEADER_TEKST_SVAG.test(rensHeader(raaF)))
        tekst = i;
    });
  }
  if (dato < 0 || tekst < 0 || beloeb < 0) return null;
  return { dato, tekst, beloeb, ...(saldo >= 0 ? { saldo } : {}) };
}

/**
 * Afgør filens talformat ud fra utvetydige beviser i talkolonnerne:
 * begge separatorer i én værdi → den sidste er decimaltegn; ellers tæller
 * "x.yy" som engelsk og "x,yy" som dansk bevis. Uafgjort → dansk.
 */
function detekterTalformat(vaerdier: string[]): "dk" | "en" {
  let dk = 0;
  let en = 0;
  for (const raa of vaerdier) {
    const s = raa.replace(/[^\d.,]/g, "");
    const p = s.lastIndexOf(".");
    const k = s.lastIndexOf(",");
    if (p >= 0 && k >= 0) {
      if (p > k) en++;
      else dk++;
    } else if (p >= 0 && /\.\d{1,2}$/.test(s)) {
      en++;
    } else if (k >= 0 && /,\d{1,2}$/.test(s)) {
      dk++;
    }
  }
  return en > dk ? "en" : "dk";
}

/** Uden header: gæt kolonner ud fra indholdet af de første datalinjer. */
function findKolonnerFraIndhold(raekker: string[][]): Kolonner | null {
  const antal = raekker[0]?.length ?? 0;
  if (antal < 3) return null;
  const n = Math.min(raekker.length, 12);

  const datoScore = new Array(antal).fill(0);
  const talScore = new Array(antal).fill(0);
  const tekstLaengde = new Array(antal).fill(0);

  for (let r = 0; r < n; r++) {
    for (let k = 0; k < antal; k++) {
      const v = raekker[r][k] ?? "";
      if (parseDato(v)) datoScore[k]++;
      else if (parseBeloebOere(v) !== null && /\d/.test(v)) talScore[k]++;
      else tekstLaengde[k] += v.length;
    }
  }

  const dato = datoScore.indexOf(Math.max(...datoScore));
  if (datoScore[dato] < n * 0.6) return null;

  // Talkolonner (ekskl. dato-kolonnen), i rækkefølge: beløb først, saldo sidst.
  const talKolonner = talScore
    .map((s, i) => ({ s, i }))
    .filter((x) => x.i !== dato && x.s >= n * 0.6)
    .map((x) => x.i);
  if (talKolonner.length === 0) return null;
  const beloeb = talKolonner[0];
  const saldo = talKolonner.length > 1 ? talKolonner[talKolonner.length - 1] : undefined;

  // Tekst: den kolonne med mest tekst, som hverken er dato eller tal.
  let tekst = -1;
  let bedst = -1;
  for (let k = 0; k < antal; k++) {
    if (k === dato || k === beloeb || k === saldo) continue;
    if (tekstLaengde[k] > bedst) {
      bedst = tekstLaengde[k];
      tekst = k;
    }
  }
  if (tekst < 0) return null;
  return { dato, tekst, beloeb, ...(saldo !== undefined ? { saldo } : {}) };
}

// ── Hovedparser ─────────────────────────────────────────────────

export function parseKontoudtog(bytes: Uint8Array): ParseResultat {
  const { tekst, encoding } = afkodBytes(bytes);
  const linjer = tekst
    .split(/\r\n|\r|\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (linjer.length === 0) {
    return {
      raekker: [],
      fejllinjer: 0,
      detekteret: {
        encoding,
        separator: ";",
        harHeader: false,
        kolonner: { dato: 0, tekst: 1, beloeb: 2 },
      },
    };
  }

  const sep = detekterSeparator(linjer);
  const alleFelter = linjer.map((l) => splitLinje(l, sep));

  // Header?
  const headerKolonner = findKolonnerFraHeader(alleFelter[0]);
  const harHeader =
    headerKolonner !== null ||
    // Linje 0 ligner en header hvis den hverken har dato eller beløb.
    (alleFelter[0].every((f) => !parseDato(f)) &&
      alleFelter[0].every((f) => parseBeloebOere(f) === null || !/\d/.test(f)));

  const dataFelter = harHeader ? alleFelter.slice(1) : alleFelter;
  const kolonner =
    headerKolonner ?? findKolonnerFraIndhold(dataFelter);

  if (!kolonner || dataFelter.length === 0) {
    return {
      raekker: [],
      fejllinjer: dataFelter.length,
      detekteret: {
        encoding,
        separator: sep,
        harHeader,
        kolonner: kolonner ?? { dato: 0, tekst: 1, beloeb: 2 },
      },
    };
  }

  // Talformatet låses pr. FIL ud fra utvetydige beviser i beløbs-/saldo-
  // kolonnerne (fx "1,234.56" → engelsk; "1.234,56" → dansk), så tvetydige
  // værdier som "1.234" tolkes konsistent med resten af filen.
  const talformat = detekterTalformat(
    dataFelter.flatMap((f) => [
      f[kolonner.beloeb] ?? "",
      ...(kolonner.saldo !== undefined ? [f[kolonner.saldo] ?? ""] : []),
    ]),
  );

  const raekker: ParsedRaekke[] = [];
  let fejllinjer = 0;
  for (const felter of dataFelter) {
    const dato = parseDato(felter[kolonner.dato] ?? "");
    const beloeb = parseBeloebOere(felter[kolonner.beloeb] ?? "", talformat);
    const t = (felter[kolonner.tekst] ?? "").replace(/^"|"$/g, "").trim();
    if (!dato || beloeb === null) {
      fejllinjer++;
      continue;
    }
    const raekke: ParsedRaekke = { dato, tekst: t || "(uden tekst)", beloebOere: beloeb };
    if (kolonner.saldo !== undefined) {
      const saldo = parseBeloebOere(felter[kolonner.saldo] ?? "", talformat);
      if (saldo !== null) raekke.saldoOere = saldo;
    }
    raekker.push(raekke);
  }

  return {
    raekker,
    fejllinjer,
    detekteret: { encoding, separator: sep, harHeader, kolonner },
  };
}

// ── Dedup-fingeraftryk ──────────────────────────────────────────

/**
 * Fingeraftryk pr. postering til dedup på tværs af overlappende eksporter.
 * Saldo indgår BEVIDST IKKE: den varierer med eksportformatet (nogle formater
 * har den slet ikke), og fingeraftrykket skal være stabilt uanset hvilken
 * eksport posteringen kom fra. I stedet nummereres ens posteringer inden for
 * samme batch fortløbende, så to ens køb samme dag overlever — mens gen-import
 * af samme (eller overlappende) udtog stadig dedupes.
 */
export function beregnFingeraftryk(
  konto: Konto,
  raekker: ParsedRaekke[],
): string[] {
  const taeller = new Map<string, number>();
  return raekker.map((r) => {
    const grund = [
      konto,
      r.dato,
      r.tekst.toLowerCase().replace(/\s+/g, " ").trim(),
      r.beloebOere,
    ].join("|");
    const n = taeller.get(grund) ?? 0;
    taeller.set(grund, n + 1);
    return createHash("sha256").update(`${grund}|n${n}`).digest("hex").slice(0, 24);
  });
}
