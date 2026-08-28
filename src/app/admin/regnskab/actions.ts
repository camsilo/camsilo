"use server";

import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { erAdmin } from "@/lib/admin-auth";
import {
  beregnFingeraftryk,
  parseBeloebOere,
  parseKontoudtog,
} from "@/lib/regnskab/csv";
import {
  anvendKategori,
  foreslaaKategori,
  normaliserTekst,
} from "@/lib/regnskab/regler";
import { foreslaaFakturaRubrik, perioderForAar } from "@/lib/regnskab/moms";
import { aflaesBilag } from "@/lib/regnskab/bilag-aflaes";
import {
  hentKurs,
  kursdifferenceOere,
  skalKursgevinstOplyses,
  tilDkkOere,
} from "@/lib/regnskab/valuta";
import {
  fjernImportLog,
  gemBilag,
  gemFaktura,
  gemImportLog,
  gemKursdifference,
  gemIndstillinger,
  gemLaertRegel,
  hentFakturaer,
  hentIndstillinger,
  hentLaerteRegler,
  hentTransaktioner,
  knytBetaling,
  markerPeriodeIndberettet,
  opdaterBilag,
  oplaasIndberetning,
  opdaterIndberetning,
  opdaterTransaktion,
  sletBilag,
  sletFaktura,
  sletImport,
  sletIndberetning,
  sletLaertRegel,
  tilfoejTransaktioner,
} from "@/lib/regnskab/store";
import type {
  Faktura,
  FakturaRubrik,
  Indstillinger,
  Konto,
  MomsType,
  Transaktion,
} from "@/lib/regnskab/typer";

const STI = "/admin/regnskab";

type Svar<T = undefined> =
  | { ok: true; data?: T }
  | { ok: false; fejl: string };

function fejl(f: string): { ok: false; fejl: string } {
  return { ok: false, fejl: f };
}

// ── Import ──────────────────────────────────────────────────────

export type ImportResultat = {
  importId: string;
  indsat: number;
  dubletter: number;
  fejllinjer: number;
  autoKategoriseret: number;
  fra?: string;
  til?: string;
  encoding: string;
  separator: string;
};

const MAKS_FIL_BYTES = 8 * 1024 * 1024; // 8 MB er rigeligt til års-kontoudtog

/** Importér et bank-kontoudtog (CSV) til en af bøgerne. */
export async function importerKontoudtogAction(
  formData: FormData,
): Promise<Svar<ImportResultat>> {
  if (!(await erAdmin())) return fejl("uautoriseret");

  const konto = formData.get("konto");
  if (konto !== "privat" && konto !== "firma") return fejl("vælg en bog");
  const fil = formData.get("fil");
  if (!(fil instanceof File) || fil.size === 0) return fejl("vælg en CSV-fil");
  if (fil.size > MAKS_FIL_BYTES) return fejl("filen er for stor (maks 8 MB)");

  let resultat;
  try {
    resultat = parseKontoudtog(new Uint8Array(await fil.arrayBuffer()));
  } catch (err) {
    console.error("[regnskab] parse fejlede:", err);
    return fejl("kunne ikke læse filen som CSV");
  }
  if (resultat.raekker.length === 0) {
    return fejl(
      `fandt ingen gyldige posteringer (${resultat.fejllinjer} ulæselige linjer) — er det et kontoudtog i CSV-format?`,
    );
  }

  const laerte = await hentLaerteRegler();
  const importId = randomUUID();
  const fingeraftryk = beregnFingeraftryk(konto as Konto, resultat.raekker);

  let autoKategoriseret = 0;
  const nye: Transaktion[] = resultat.raekker.map((r, i) => {
    const t: Transaktion = {
      id: randomUUID(),
      konto: konto as Konto,
      dato: r.dato,
      tekst: r.tekst,
      beloebOere: r.beloebOere,
      saldoOere: r.saldoOere,
      importId,
      fingeraftryk: fingeraftryk[i],
      ts: Date.now(),
    };
    // Odins første blik: foreslå kategori + moms/fradrag. Lærte regler
    // regnes som afklarede (du har svaret én gang); indbyggede er kun forslag.
    const forslag = foreslaaKategori(r.tekst, t.konto, laerte);
    if (forslag) {
      Object.assign(
        t,
        anvendKategori(t, forslag.kategori, forslag),
      );
      if (forslag.kilde === "laert") t.afklaret = true;
      autoKategoriseret++;
    }
    return t;
  });

  const datoer = resultat.raekker.map((r) => r.dato).sort();
  const { indsat, dubletter } = await tilfoejTransaktioner(nye);
  await gemImportLog({
    id: importId,
    konto: konto as Konto,
    filnavn: fil.name,
    nye: indsat,
    dubletter,
    fejllinjer: resultat.fejllinjer,
    fra: datoer[0],
    til: datoer[datoer.length - 1],
    ts: Date.now(),
  });

  revalidatePath(STI);
  return {
    ok: true,
    data: {
      importId,
      indsat,
      dubletter,
      fejllinjer: resultat.fejllinjer,
      autoKategoriseret,
      fra: datoer[0],
      til: datoer[datoer.length - 1],
      encoding: resultat.detekteret.encoding,
      separator:
        resultat.detekteret.separator === "\t"
          ? "tab"
          : resultat.detekteret.separator,
    },
  };
}

/** Fortryd en hel import (sletter dens posteringer — låste blokerer helt). */
export async function fortrydImportAction(importId: string): Promise<Svar> {
  if (!(await erAdmin())) return fejl("uautoriseret");
  const r = await sletImport(importId);
  if (r.laaste > 0) {
    return fejl(
      `importen indeholder ${r.laaste} postering(er) låst af en indberettet momsperiode — fortryd indberetningen først`,
    );
  }
  await fjernImportLog(importId);
  revalidatePath(STI);
  return { ok: true };
}

// ── Odin-svar & kategorisering ──────────────────────────────────

export type OdinSvarInput = {
  id: string;
  kategori: string;
  momsType?: MomsType;
  momsFradragPct?: number;
  fradragPct?: number;
  skatteRelevant?: boolean;
  note?: string;
  /** Husk forretningen: lær en regel og afklar alle matchende posteringer. */
  husk?: boolean;
  huskMoenster?: string;
};

export async function svarOdinAction(
  input: OdinSvarInput,
): Promise<Svar<{ ogsaaAfklaret: number }>> {
  if (!(await erAdmin())) return fejl("uautoriseret");

  const alle = await hentTransaktioner();
  const t = alle.find((x) => x.id === input.id);
  if (!t) return fejl("posteringen findes ikke");
  if (t.laastAf) return fejl("posteringen er låst af en indberettet momsperiode");

  const pct = (v: number | undefined) =>
    v === undefined ? undefined : Math.max(0, Math.min(100, Math.round(v)));

  const patch = {
    ...anvendKategori(t, input.kategori, {
      momsType: input.momsType,
      momsFradragPct: pct(input.momsFradragPct),
      fradragPct: pct(input.fradragPct),
      skatteRelevant: input.skatteRelevant,
    }),
    afklaret: true,
    ...(input.note !== undefined ? { note: input.note.slice(0, 500) } : {}),
  };

  try {
    await opdaterTransaktion(input.id, patch);
  } catch (err) {
    return fejl(err instanceof Error ? err.message : "kunne ikke gemme");
  }

  // Lær + afklar alle andre uafklarede posteringer, der matcher mønstret.
  // Alt for generiske mønstre afvises — de ville auto-afklare vidt
  // forskellige posteringer på ren delstreng og forgifte bøgerne.
  const GENERISKE = new Set([
    "overførsel", "overfoersel", "mobilepay", "betaling", "dankort", "nota",
    "visa", "mastercard", "netbank", "bgs", "fi", "kortkøb", "kortkoeb",
    "indbetaling", "udbetaling", "gebyr", "til", "fra",
  ]);
  let ogsaaAfklaret = 0;
  const moenster = (input.huskMoenster ?? "").trim().toLowerCase().slice(0, 60);
  if (input.husk && GENERISKE.has(moenster)) {
    revalidatePath(STI);
    return {
      ok: true,
      data: { ogsaaAfklaret: 0 },
    };
  }
  if (input.husk && moenster.length >= 3) {
    await gemLaertRegel({
      moenster,
      konto: t.konto,
      kategori: input.kategori,
      momsType: input.momsType,
      momsFradragPct: pct(input.momsFradragPct),
      fradragPct: pct(input.fradragPct),
      skatteRelevant: input.skatteRelevant,
    });
    const matchende = alle.filter(
      (x) =>
        x.id !== t.id &&
        x.konto === t.konto &&
        !x.afklaret &&
        !x.laastAf &&
        normaliserTekst(x.tekst).includes(moenster),
    );
    for (const m of matchende) {
      await opdaterTransaktion(m.id, {
        ...anvendKategori(m, input.kategori, {
          momsType: input.momsType,
          momsFradragPct: pct(input.momsFradragPct),
          fradragPct: pct(input.fradragPct),
          skatteRelevant: input.skatteRelevant,
        }),
        afklaret: true,
      });
      ogsaaAfklaret++;
    }
  }

  revalidatePath(STI);
  return { ok: true, data: { ogsaaAfklaret } };
}

/** Spring en postering over i Odin-køen (markér afklaret uden kategori-ændring). */
export async function springOverAction(id: string): Promise<Svar> {
  if (!(await erAdmin())) return fejl("uautoriseret");
  try {
    await opdaterTransaktion(id, { afklaret: true });
  } catch (err) {
    return fejl(err instanceof Error ? err.message : "kunne ikke gemme");
  }
  revalidatePath(STI);
  return { ok: true };
}

export async function sletLaertRegelAction(id: string): Promise<Svar> {
  if (!(await erAdmin())) return fejl("uautoriseret");
  await sletLaertRegel(id);
  revalidatePath(STI);
  return { ok: true };
}

// ── Moms ────────────────────────────────────────────────────────

/**
 * Markér en momsperiode som indberettet i TastSelv. Selve arbejdet (snapshot,
 * dublet-/overlap-vagt og lås) sker atomart i storens kø, så tallene aldrig
 * kan ændre sig mellem beregning og låsning.
 */
export async function markerIndberettetAction(
  periodeNoegle: string,
): Promise<Svar> {
  if (!(await erAdmin())) return fejl("uautoriseret");

  const indstillinger = await hentIndstillinger();
  const aar = Number(periodeNoegle.slice(0, 4));
  if (!Number.isFinite(aar)) return fejl("ugyldig periode");
  const periode = perioderForAar(aar, indstillinger.momsperiode).find(
    (p) => p.noegle === periodeNoegle,
  );
  if (!periode) return fejl("perioden findes ikke for din afregningsfrekvens");

  try {
    await markerPeriodeIndberettet(periode);
  } catch (err) {
    return fejl(err instanceof Error ? err.message : "kunne ikke gemme");
  }
  revalidatePath(STI);
  return { ok: true };
}

/**
 * Fortryd en indberetnings-markering. Oplåsning sker FØR sletningen og
 * ubetinget (begge trin er idempotente) — så et crash midtvejs aldrig kan
 * efterlade posteringer låst af en slettet indberetning.
 */
export async function fortrydIndberetningAction(id: string): Promise<Svar> {
  if (!(await erAdmin())) return fejl("uautoriseret");
  await oplaasIndberetning(id);
  await sletIndberetning(id);
  revalidatePath(STI);
  return { ok: true };
}

export async function saetIndberetningBetaltAction(
  id: string,
  betalt: boolean,
): Promise<Svar> {
  if (!(await erAdmin())) return fejl("uautoriseret");
  await opdaterIndberetning(id, { betalt });
  revalidatePath(STI);
  return { ok: true };
}

// ── Indstillinger (Odins onboarding) ────────────────────────────

export async function gemIndstillingerAction(
  patch: Partial<Indstillinger>,
): Promise<Svar> {
  if (!(await erAdmin())) return fejl("uautoriseret");

  // Angivne men ugyldige værdier AFVISES med fejl — de må aldrig kasseres i
  // stilhed, mens UI'et viser "gemt".
  const rens: Partial<Indstillinger> = {};
  if (patch.virksomhedsnavn !== undefined)
    rens.virksomhedsnavn = String(patch.virksomhedsnavn).slice(0, 80);
  if (patch.cvr !== undefined)
    rens.cvr = String(patch.cvr).replace(/\D/g, "").slice(0, 8) || undefined;
  if (patch.virksomhedsform !== undefined) {
    if (patch.virksomhedsform !== "enkeltmandsvirksomhed" && patch.virksomhedsform !== "aps")
      return fejl("ugyldig virksomhedsform");
    rens.virksomhedsform = patch.virksomhedsform;
  }
  if (typeof patch.momsregistreret === "boolean")
    rens.momsregistreret = patch.momsregistreret;
  if (patch.momsperiode !== undefined) {
    if (
      patch.momsperiode !== "halvaar" &&
      patch.momsperiode !== "kvartal" &&
      patch.momsperiode !== "maaned"
    )
      return fejl("ugyldig momsperiode");
    rens.momsperiode = patch.momsperiode;
  }
  if (patch.foersteAar !== undefined) {
    if (
      typeof patch.foersteAar !== "number" ||
      !Number.isFinite(patch.foersteAar) ||
      patch.foersteAar < 2020 ||
      patch.foersteAar > 2100
    )
      return fejl("første regnskabsår skal være mellem 2020 og 2100");
    rens.foersteAar = Math.round(patch.foersteAar);
  }
  if (patch.kommuneskatPct !== undefined) {
    if (
      typeof patch.kommuneskatPct !== "number" ||
      !Number.isFinite(patch.kommuneskatPct) ||
      patch.kommuneskatPct < 15 ||
      patch.kommuneskatPct > 35
    )
      return fejl("kommuneskatten skal være mellem 15 og 35 % — tjek din forskudsopgørelse");
    rens.kommuneskatPct = Math.round(patch.kommuneskatPct * 100) / 100;
  }
  if (typeof patch.kirkeskat === "boolean") rens.kirkeskat = patch.kirkeskat;
  if (typeof patch.betalerBSkat === "boolean") rens.betalerBSkat = patch.betalerBSkat;
  if (patch.loenAarOere !== undefined) {
    if (
      typeof patch.loenAarOere !== "number" ||
      !Number.isFinite(patch.loenAarOere) ||
      patch.loenAarOere < 0
    )
      return fejl("ugyldig årsløn");
    rens.loenAarOere = Math.round(patch.loenAarOere);
  }
  if (typeof patch.onboardingFaerdig === "boolean")
    rens.onboardingFaerdig = patch.onboardingFaerdig;

  await gemIndstillinger(rens);
  revalidatePath(STI);
  return { ok: true };
}

// ── Transaktions-småting ────────────────────────────────────────

export async function saetNoteAction(id: string, note: string): Promise<Svar> {
  if (!(await erAdmin())) return fejl("uautoriseret");
  try {
    await opdaterTransaktion(id, { note: note.slice(0, 500) });
  } catch (err) {
    return fejl(err instanceof Error ? err.message : "kunne ikke gemme");
  }
  revalidatePath(STI);
  return { ok: true };
}

/** Genåbn en afklaret postering, så Odin spørger igen. */
export async function genaabnAction(id: string): Promise<Svar> {
  if (!(await erAdmin())) return fejl("uautoriseret");
  try {
    await opdaterTransaktion(id, { afklaret: false });
  } catch (err) {
    return fejl(err instanceof Error ? err.message : "kunne ikke gemme");
  }
  revalidatePath(STI);
  return { ok: true };
}

// ── Fakturaer ───────────────────────────────────────────────────
//
// En faktura er salgssidens sandhed. Den periodiseres efter FAKTURADATOEN,
// og fremmed valuta omregnes med Nationalbankens kurs på samme dato — ikke
// med den kurs, banken tilfældigvis vekslede til måneder senere.

export type FakturaInput = {
  id?: string;
  nummer: string;
  kunde: string;
  land: string;
  kundeMomsnr?: string;
  fakturadato: string;
  forfaldsdato?: string;
  ydelse?: string;
  valuta: string;
  /** Beløb ekskl. moms, som det står på fakturaen (fx "32460,00"). */
  beloeb: string;
  /** Momsbeløb, som det står på fakturaen. Tom eller "0" ved salg uden moms. */
  moms?: string;
  /** Manuel kurs, hvis Nationalbanken ikke kunne nås. DKK pr. 1 enhed. */
  manuelKurs?: string;
  rubrik?: FakturaRubrik;
  note?: string;
};

function tilOere(raa: string): number | null {
  const n = parseBeloebOere(raa ?? "", "dk");
  return n;
}

/** Opret eller opdatér en faktura. Henter selv kursen fra Nationalbanken. */
export async function gemFakturaAction(
  input: FakturaInput,
): Promise<Svar<{ id: string; kurs: number; kursdato?: string; forskudt: boolean }>> {
  if (!(await erAdmin())) return fejl("uautoriseret");

  const nummer = input.nummer.trim();
  if (!nummer) return fejl("Fakturanummer mangler.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.fakturadato)) {
    return fejl("Fakturadatoen skal være på formen ÅÅÅÅ-MM-DD.");
  }
  const beloebOere = tilOere(input.beloeb);
  if (beloebOere === null || beloebOere <= 0) return fejl("Beløbet kunne ikke læses.");
  const momsOere = input.moms?.trim() ? (tilOere(input.moms) ?? 0) : 0;

  const valuta = (input.valuta || "DKK").toUpperCase().trim();

  // Kurs: Nationalbanken på fakturadatoen — ellers den manuelt indtastede.
  let kurs = 1;
  let kursdato: string | undefined = input.fakturadato;
  let kurskilde = "DKK";
  let forskudt = false;
  if (valuta !== "DKK") {
    const opslag = await hentKurs(valuta, input.fakturadato);
    if (opslag) {
      kurs = opslag.kurs;
      kursdato = opslag.kursdato;
      kurskilde = opslag.kilde;
      forskudt = opslag.forskudt;
    } else {
      const manuel = Number((input.manuelKurs ?? "").replace(",", "."));
      if (!Number.isFinite(manuel) || manuel <= 0) {
        return fejl(
          `Kursen for ${valuta} den ${input.fakturadato} kunne ikke hentes fra Nationalbanken. Indtast den manuelt.`,
        );
      }
      kurs = manuel;
      kurskilde = "manuelt indtastet";
    }
  }

  const rubrik =
    input.rubrik ?? foreslaaFakturaRubrik(input.land, input.kundeMomsnr);

  try {
    const gemt = await gemFaktura({
      id: input.id,
      nummer,
      kunde: input.kunde.trim(),
      land: (input.land || "DK").toUpperCase().trim(),
      kundeMomsnr: input.kundeMomsnr?.trim() || undefined,
      fakturadato: input.fakturadato,
      forfaldsdato: input.forfaldsdato || undefined,
      ydelse: input.ydelse?.trim() || undefined,
      valuta,
      beloebOere,
      momsOere,
      kurs,
      kursdato,
      kurskilde,
      dkkOere: tilDkkOere(beloebOere, kurs),
      momsDkkOere: tilDkkOere(momsOere, kurs),
      rubrik,
      note: input.note?.trim() || undefined,
    });
    revalidatePath(STI);
    return { ok: true, data: { id: gemt.id, kurs, kursdato, forskudt } };
  } catch (err) {
    return fejl(err instanceof Error ? err.message : "kunne ikke gemme fakturaen");
  }
}

export async function sletFakturaAction(id: string): Promise<Svar> {
  if (!(await erAdmin())) return fejl("uautoriseret");
  try {
    await sletFaktura(id);
  } catch (err) {
    return fejl(err instanceof Error ? err.message : "kunne ikke slette");
  }
  revalidatePath(STI);
  return { ok: true };
}

/**
 * Kobl en bankpostering på en faktura som betaling, og opgør kursdifferencen.
 *
 * Når alle betalinger er knyttet på, kan forskellen mellem det bogførte beløb
 * (fakturadatoens kurs) og det faktisk modtagne opgøres. Er nettoen over
 * bagatelgrænsen, skal den oplyses som kapitalindkomst i det år, pengene blev
 * vekslet.
 */
export async function knytBetalingAction(
  fakturaId: string,
  transaktionId: string,
): Promise<Svar<{ differenceOere: number; skalOplyses: boolean }>> {
  if (!(await erAdmin())) return fejl("uautoriseret");
  try {
    const faktura = await knytBetaling(fakturaId, transaktionId);
    if (!faktura) return fejl("Fakturaen findes ikke.");

    const alle = await hentTransaktioner();
    const betalinger = alle.filter((t) => faktura.betalinger?.includes(t.id));
    const modtagetOere = betalinger.reduce((sum, t) => sum + Math.abs(t.beloebOere), 0);
    const bogfoert = faktura.dkkOere + faktura.momsDkkOere;
    const difference = kursdifferenceOere(bogfoert, modtagetOere);

    // Differencen realiseres i det år, den seneste betaling faldt.
    const sidsteDato = betalinger.map((t) => t.dato).sort().pop() ?? faktura.fakturadato;

    await gemKursdifference({
      fakturaId,
      aar: Number(sidsteDato.slice(0, 4)),
      bogfoertOere: bogfoert,
      modtagetOere,
      differenceOere: difference,
    });

    revalidatePath(STI);
    return {
      ok: true,
      data: { differenceOere: difference, skalOplyses: skalKursgevinstOplyses(difference) },
    };
  } catch (err) {
    return fejl(err instanceof Error ? err.message : "kunne ikke knytte betalingen");
  }
}

// ── Bilag ───────────────────────────────────────────────────────
//
// Et foto af en kvittering er nok som dokumentation — momsbekendtgørelsens
// § 92, stk. 5 tillader udtrykkeligt elektronisk opbevaring, uanset om
// fakturaen oprindeligt kom på papir. Papiret må altså gerne smides ud,
// når billedet er tydeligt.

const MAKS_BILAG_BYTES = 12 * 1024 * 1024;

export type BilagResultat = {
  id: string;
  leverandoer?: string;
  beloebOere?: number;
  fejl?: string;
};

/** Læg et bilag ind og lad det aflæse automatisk. */
export async function uploadBilagAction(
  formData: FormData,
): Promise<Svar<BilagResultat>> {
  if (!(await erAdmin())) return fejl("uautoriseret");

  const fil = formData.get("fil");
  if (!(fil instanceof File) || fil.size === 0) return fejl("Vælg en fil først.");
  if (fil.size > MAKS_BILAG_BYTES) {
    return fejl(
      `Filen fylder ${(fil.size / 1024 / 1024).toFixed(1)} MB. Grænsen er 12 MB.`,
    );
  }

  const mediaType = fil.type || "application/octet-stream";
  const bytes = Buffer.from(await fil.arrayBuffer());

  const aflaest = await aflaesBilag(bytes, mediaType);

  try {
    const gemt = await gemBilag(bytes, {
      originaltNavn: fil.name || "bilag",
      mediaType,
      aflaest,
      transaktionId: (formData.get("transaktionId") as string) || undefined,
      fakturaId: (formData.get("fakturaId") as string) || undefined,
    });
    revalidatePath(STI);
    return {
      ok: true,
      data: {
        id: gemt.id,
        leverandoer: aflaest.leverandoer,
        beloebOere: aflaest.beloebOere,
        fejl: aflaest.fejl,
      },
    };
  } catch (err) {
    return fejl(err instanceof Error ? err.message : "kunne ikke gemme bilaget");
  }
}

export async function sletBilagAction(id: string): Promise<Svar> {
  if (!(await erAdmin())) return fejl("uautoriseret");
  try {
    await sletBilag(id);
  } catch (err) {
    return fejl(err instanceof Error ? err.message : "kunne ikke slette");
  }
  revalidatePath(STI);
  return { ok: true };
}

/** Markér et bilag som gennemgået, eller knyt det til en postering. */
export async function opdaterBilagAction(
  id: string,
  aendring: { godkendt?: boolean; note?: string; transaktionId?: string },
): Promise<Svar> {
  if (!(await erAdmin())) return fejl("uautoriseret");
  try {
    await opdaterBilag(id, {
      ...aendring,
      note: aendring.note?.slice(0, 500),
    });
  } catch (err) {
    return fejl(err instanceof Error ? err.message : "kunne ikke gemme");
  }
  revalidatePath(STI);
  return { ok: true };
}
