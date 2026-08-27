/**
 * Lager for Odin-regnskabet — JSON-filer under DATA_DIR/regnskab, skrevet
 * atomart (temp + rename) og serialiseret gennem én in-proces-kø pr. fil,
 * samme velafprøvede mønster som beskeds-lageret. Ingen database.
 *
 * Filer:
 *   transaktioner.json   — alle posteringer, begge bøger
 *   regler.json          — lærte kategoriseringsregler (Odins hukommelse)
 *   indstillinger.json   — virksomheds- og skatteopsætning
 *   importlog.json       — gennemførte importer
 *   indberetninger.json  — momsperioder markeret som indberettet
 *
 * VIGTIGT: En korrupt fil må ALDRIG læses som "tom" — så ville næste
 * skrivning udslette historikken. Læsefejl kastes altid videre.
 */
import { mkdir, readFile, writeFile, rename } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import type {
  Faktura,
  ImportLog,
  Indstillinger,
  Kursdifference,
  MomsIndberetning,
  Regel,
  Transaktion,
} from "./typer";
import { STANDARD_INDSTILLINGER } from "./typer";
import {
  beregnMomsOpgoerelse,
  intervalForNoegle,
  type Periode,
} from "./moms";

function mappe(): string {
  const base = process.env.DATA_DIR ?? path.join(process.cwd(), "data");
  return path.join(base, "regnskab");
}

// ── Generisk atomar JSON-fil med kø ────────────────────────────

let kaede: Promise<unknown> = Promise.resolve();
function iKoe<T>(fn: () => Promise<T>): Promise<T> {
  const naeste = kaede.then(fn, fn);
  kaede = naeste.catch(() => {});
  return naeste;
}

async function laesJson<T>(navn: string, tomVaerdi: T): Promise<T> {
  let t: string;
  try {
    t = await readFile(path.join(mappe(), navn), "utf8");
  } catch (err) {
    if ((err as NodeJS.ErrnoException)?.code === "ENOENT") return tomVaerdi;
    throw err;
  }
  return JSON.parse(t) as T;
}

async function skrivJson(navn: string, data: unknown): Promise<void> {
  await mkdir(mappe(), { recursive: true });
  const fil = path.join(mappe(), navn);
  const tmp = `${fil}.${process.pid}.${randomUUID()}.tmp`;
  await writeFile(tmp, JSON.stringify(data), "utf8");
  await rename(tmp, fil);
}

// ── Transaktioner ───────────────────────────────────────────────

const T_FIL = "transaktioner.json";

async function laesTransaktioner(): Promise<Transaktion[]> {
  const arr = await laesJson<Transaktion[]>(T_FIL, []);
  if (!Array.isArray(arr)) throw new Error(`${T_FIL} er ikke et array`);
  return arr;
}

/** Alle posteringer, nyeste dato først (sekundært nyest oprettet). */
export async function hentTransaktioner(): Promise<Transaktion[]> {
  return iKoe(async () =>
    (await laesTransaktioner()).sort(
      (a, b) => b.dato.localeCompare(a.dato) || b.ts - a.ts,
    ),
  );
}

/**
 * Tilføj nye posteringer med dedup på fingeraftryk. Firma-posteringer får
 * fortløbende bilagsnummer i DATO-orden (transaktionsspor). Returnerer
 * antal indsatte og antal sprunget-over dubletter.
 */
export async function tilfoejTransaktioner(
  nye: Transaktion[],
): Promise<{ indsat: number; dubletter: number }> {
  return iKoe(async () => {
    const liste = await laesTransaktioner();
    const kendte = new Set(liste.map((t) => t.fingeraftryk));
    let naesteBilag =
      liste.reduce((m, t) => Math.max(m, t.bilagNr ?? 0), 0) + 1;

    const friske = nye.filter((t) => !kendte.has(t.fingeraftryk));
    // Bilagsnumre tildeles i dato-orden inden for importen, så nummerrækken
    // følger tiden så godt som muligt.
    const firmaFriske = friske
      .filter((t) => t.konto === "firma")
      .sort((a, b) => a.dato.localeCompare(b.dato));
    for (const t of firmaFriske) t.bilagNr = naesteBilag++;

    liste.push(...friske);
    if (friske.length > 0) await skrivJson(T_FIL, liste);
    return { indsat: friske.length, dubletter: nye.length - friske.length };
  });
}

/** Opdatér én postering (kategori, moms, fradrag, note, afklaret …). */
export async function opdaterTransaktion(
  id: string,
  patch: Partial<
    Pick<
      Transaktion,
      | "kategori"
      | "afklaret"
      | "momsType"
      | "momsOere"
      | "momsFradragPct"
      | "fradragPct"
      | "skatteRelevant"
      | "note"
      | "laastAf"
    >
  >,
): Promise<Transaktion | null> {
  return iKoe(async () => {
    const liste = await laesTransaktioner();
    const i = liste.findIndex((t) => t.id === id);
    if (i < 0) return null;
    if (liste[i].laastAf && !("laastAf" in patch)) {
      // Posteringen indgår i en indberettet momsperiode — rør den ikke.
      throw new Error("Posteringen er låst af en indberettet momsperiode.");
    }
    liste[i] = { ...liste[i], ...patch };
    await skrivJson(T_FIL, liste);
    return liste[i];
  });
}

/**
 * Slet alle posteringer fra én import (fortryd fejl-import). Låste røres
 * ALDRIG — indeholder importen låste posteringer, slettes intet, og kaldet
 * melder tilbage, så UI'et kan bede brugeren fortryde indberetningen først.
 */
export async function sletImport(
  importId: string,
): Promise<{ slettet: number; laaste: number }> {
  return iKoe(async () => {
    const liste = await laesTransaktioner();
    const laaste = liste.filter(
      (t) => t.importId === importId && t.laastAf,
    ).length;
    if (laaste > 0) return { slettet: 0, laaste };
    const ny = liste.filter((t) => t.importId !== importId);
    const slettet = liste.length - ny.length;
    if (slettet > 0) await skrivJson(T_FIL, ny);
    return { slettet, laaste: 0 };
  });
}

/**
 * Lås alle posteringer op, der er låst af en given indberetning — robust
 * uanset om afregningsperioden siden er ændret (matcher på id, ikke datoer).
 */
export async function oplaasIndberetning(indberetningId: string): Promise<number> {
  return iKoe(async () => {
    const liste = await laesTransaktioner();
    let ramt = 0;
    for (const t of liste) {
      if (t.laastAf === indberetningId) {
        delete t.laastAf;
        ramt++;
      }
    }
    if (ramt > 0) await skrivJson(T_FIL, liste);
    return ramt;
  });
}

// ── Fakturaer ───────────────────────────────────────────────────
//
// Fakturaerne er salgssiden af regnskabet og ligger for sig, fordi de styres
// af FAKTURADATOEN, ikke af hvornår pengene kom ind. Se Faktura i typer.ts.

const F_FIL = "fakturaer.json";

export async function hentFakturaer(): Promise<Faktura[]> {
  return iKoe(async () => {
    const arr = await laesJson<Faktura[]>(F_FIL, []);
    if (!Array.isArray(arr)) throw new Error(`${F_FIL} er ikke et array`);
    return arr.sort((a, b) => a.fakturadato.localeCompare(b.fakturadato));
  });
}

export async function gemFaktura(
  faktura: Omit<Faktura, "id" | "ts"> & { id?: string },
): Promise<Faktura> {
  return iKoe(async () => {
    const arr = await laesJson<Faktura[]>(F_FIL, []);
    if (faktura.id) {
      const i = arr.findIndex((f) => f.id === faktura.id);
      if (i >= 0) {
        const opdateret = { ...arr[i], ...faktura, id: arr[i].id, ts: arr[i].ts };
        arr[i] = opdateret;
        await skrivJson(F_FIL, arr);
        return opdateret;
      }
    }
    // Fakturanummeret skal være entydigt — ellers brydes det fortløbende spor.
    if (arr.some((f) => f.nummer === faktura.nummer)) {
      throw new Error(`Fakturanummer ${faktura.nummer} findes allerede`);
    }
    const ny: Faktura = { ...faktura, id: randomUUID(), ts: Date.now() } as Faktura;
    arr.push(ny);
    await skrivJson(F_FIL, arr);
    return ny;
  });
}

export async function sletFaktura(id: string): Promise<void> {
  return iKoe(async () => {
    const arr = await laesJson<Faktura[]>(F_FIL, []);
    const ny = arr.filter((f) => f.id !== id);
    if (ny.length !== arr.length) await skrivJson(F_FIL, ny);
  });
}

/** Kobler en betaling (transaktions-id) på en faktura. */
export async function knytBetaling(
  fakturaId: string,
  transaktionId: string,
): Promise<Faktura | null> {
  return iKoe(async () => {
    const arr = await laesJson<Faktura[]>(F_FIL, []);
    const i = arr.findIndex((f) => f.id === fakturaId);
    if (i < 0) return null;
    const betalinger = new Set(arr[i].betalinger ?? []);
    betalinger.add(transaktionId);
    arr[i] = { ...arr[i], betalinger: [...betalinger] };
    await skrivJson(F_FIL, arr);
    return arr[i];
  });
}

// ── Kursdifferencer ─────────────────────────────────────────────

const K_FIL = "kursdifferencer.json";

export async function hentKursdifferencer(): Promise<Kursdifference[]> {
  return iKoe(async () => {
    const arr = await laesJson<Kursdifference[]>(K_FIL, []);
    if (!Array.isArray(arr)) throw new Error(`${K_FIL} er ikke et array`);
    return arr;
  });
}

export async function gemKursdifference(
  k: Omit<Kursdifference, "id" | "ts">,
): Promise<Kursdifference> {
  return iKoe(async () => {
    const arr = await laesJson<Kursdifference[]>(K_FIL, []);
    // Én difference pr. faktura — genberegning erstatter den gamle.
    const uden = arr.filter((x) => x.fakturaId !== k.fakturaId);
    const ny: Kursdifference = { ...k, id: randomUUID(), ts: Date.now() };
    uden.push(ny);
    await skrivJson(K_FIL, uden);
    return ny;
  });
}

// ── Lærte regler ────────────────────────────────────────────────

const R_FIL = "regler.json";

export async function hentLaerteRegler(): Promise<Regel[]> {
  return iKoe(async () => {
    const arr = await laesJson<Regel[]>(R_FIL, []);
    if (!Array.isArray(arr)) throw new Error(`${R_FIL} er ikke et array`);
    return arr;
  });
}

export async function gemLaertRegel(
  regel: Omit<Regel, "id" | "kilde" | "ts">,
): Promise<Regel> {
  return iKoe(async () => {
    const arr = await laesJson<Regel[]>(R_FIL, []);
    // Én regel pr. (mønster, konto) — nyeste svar vinder.
    const uden = arr.filter(
      (r) => !(r.moenster === regel.moenster && r.konto === regel.konto),
    );
    const ny: Regel = { ...regel, id: randomUUID(), kilde: "laert", ts: Date.now() };
    uden.push(ny);
    await skrivJson(R_FIL, uden);
    return ny;
  });
}

export async function sletLaertRegel(id: string): Promise<void> {
  return iKoe(async () => {
    const arr = await laesJson<Regel[]>(R_FIL, []);
    const ny = arr.filter((r) => r.id !== id);
    if (ny.length !== arr.length) await skrivJson(R_FIL, ny);
  });
}

// ── Indstillinger ───────────────────────────────────────────────

const I_FIL = "indstillinger.json";

export async function hentIndstillinger(): Promise<Indstillinger> {
  return iKoe(async () => {
    const i = await laesJson<Partial<Indstillinger> | null>(I_FIL, null);
    // Manglende felter falder tilbage på standard — robust mod ældre versioner.
    return { ...STANDARD_INDSTILLINGER, ...(i ?? {}) };
  });
}

export async function gemIndstillinger(
  patch: Partial<Indstillinger>,
): Promise<Indstillinger> {
  return iKoe(async () => {
    const nuvaerende = {
      ...STANDARD_INDSTILLINGER,
      ...((await laesJson<Partial<Indstillinger> | null>(I_FIL, null)) ?? {}),
    };
    const ny = { ...nuvaerende, ...patch };
    await skrivJson(I_FIL, ny);
    return ny;
  });
}

// ── Importlog ───────────────────────────────────────────────────

const L_FIL = "importlog.json";

export async function hentImportLog(): Promise<ImportLog[]> {
  return iKoe(async () => {
    const arr = await laesJson<ImportLog[]>(L_FIL, []);
    if (!Array.isArray(arr)) throw new Error(`${L_FIL} er ikke et array`);
    return arr.sort((a, b) => b.ts - a.ts);
  });
}

export async function gemImportLog(log: ImportLog): Promise<void> {
  return iKoe(async () => {
    const arr = await laesJson<ImportLog[]>(L_FIL, []);
    arr.push(log);
    await skrivJson(L_FIL, arr);
  });
}

export async function fjernImportLog(importId: string): Promise<void> {
  return iKoe(async () => {
    const arr = await laesJson<ImportLog[]>(L_FIL, []);
    const ny = arr.filter((l) => l.id !== importId);
    if (ny.length !== arr.length) await skrivJson(L_FIL, ny);
  });
}

// ── Momsindberetninger ──────────────────────────────────────────

const M_FIL = "indberetninger.json";

export async function hentIndberetninger(): Promise<MomsIndberetning[]> {
  return iKoe(async () => {
    const arr = await laesJson<MomsIndberetning[]>(M_FIL, []);
    if (!Array.isArray(arr)) throw new Error(`${M_FIL} er ikke et array`);
    return arr.sort((a, b) => b.periode.localeCompare(a.periode));
  });
}

/**
 * Markér en momsperiode som indberettet — ATOMART: læs posteringer, beregn
 * øjebliksbilledet, afvis dubletter/overlap og lås posteringerne i SAMME
 * kø-operation, så intet kan ændre sig mellem snapshot og lås (TOCTOU).
 *
 * Overlap-vagten sammenligner datointervaller (rekonstrueret fra periode-
 * nøglerne, som er selvbeskrivende), så et skift af afregningsfrekvens
 * aldrig kan give to indberetninger, der gør krav på samme posteringer.
 */
export async function markerPeriodeIndberettet(
  periode: Periode,
): Promise<MomsIndberetning> {
  return iKoe(async () => {
    const arr = await laesJson<MomsIndberetning[]>(M_FIL, []);
    if (!Array.isArray(arr)) throw new Error(`${M_FIL} er ikke et array`);

    if (arr.some((x) => x.periode === periode.noegle)) {
      throw new Error(`Perioden ${periode.noegle} er allerede markeret som indberettet.`);
    }
    for (const x of arr) {
      const iv = intervalForNoegle(x.periode);
      if (iv && iv.fra <= periode.til && periode.fra <= iv.til) {
        throw new Error(
          `Perioden overlapper den allerede indberettede ${x.periode} — fortryd den først.`,
        );
      }
    }

    const transaktioner = await laesTransaktioner();
    // Læses direkte frem for gennem hentFakturaer(), som selv tager køen.
    const fakturaer = await laesJson<Faktura[]>(F_FIL, []);
    const o = beregnMomsOpgoerelse(transaktioner, periode, [], fakturaer);

    const ny: MomsIndberetning = {
      id: randomUUID(),
      periode: periode.noegle,
      salgsmomsOere: o.salgsmomsOere,
      koebsmomsOere: o.koebsmomsOere,
      ydelseskoebsmomsOere: o.ydelseskoebsmomsOere,
      tilsvarOere: o.tilsvarOere,
      rubrikAOere: o.rubrikAYdelserOere,
      rubrikBOere: o.rubrikBYdelserOere,
      rubrikCOere: o.rubrikCOere,
      ts: Date.now(),
    };

    // Lås periodens firma-posteringer — fremmede låse røres aldrig (efter
    // overlap-vagten bør de ikke findes, men vagt i dybden koster intet).
    let laast = 0;
    for (const t of transaktioner) {
      if (
        t.konto === "firma" &&
        t.dato >= periode.fra &&
        t.dato <= periode.til &&
        !t.laastAf
      ) {
        t.laastAf = ny.id;
        laast++;
      }
    }

    arr.push(ny);
    await skrivJson(M_FIL, arr);
    if (laast > 0) await skrivJson(T_FIL, transaktioner);
    return ny;
  });
}

export async function opdaterIndberetning(
  id: string,
  patch: Partial<Pick<MomsIndberetning, "betalt" | "note">>,
): Promise<void> {
  return iKoe(async () => {
    const arr = await laesJson<MomsIndberetning[]>(M_FIL, []);
    const i = arr.findIndex((x) => x.id === id);
    if (i >= 0) {
      arr[i] = { ...arr[i], ...patch };
      await skrivJson(M_FIL, arr);
    }
  });
}

export async function sletIndberetning(id: string): Promise<MomsIndberetning | null> {
  return iKoe(async () => {
    const arr = await laesJson<MomsIndberetning[]>(M_FIL, []);
    const fundet = arr.find((x) => x.id === id) ?? null;
    if (fundet) {
      await skrivJson(
        M_FIL,
        arr.filter((x) => x.id !== id),
      );
    }
    return fundet;
  });
}
