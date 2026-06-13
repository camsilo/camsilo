/**
 * Lager for kontaktbeskeder fra forsidens formular. Ingen database — én JSON-fil
 * (et array) under DATA_DIR/messages, skrevet atomart (temp + rename) og
 * serialiseret gennem en in-proces-kø, så samtidige skrivninger ikke kolliderer.
 * Samme flygtige-FS-forbehold som analytics: uden persistent disk nulstilles
 * lageret ved redeploy/genstart — sæt en disk + DATA_DIR for varig historik.
 */
import { mkdir, readFile, writeFile, rename } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

export type Besked = {
  id: string;
  navn: string;
  email: string;
  emne?: string;
  besked: string;
  laest: boolean;
  arkiveret: boolean;
  /** sprog formularen blev sendt på (da/en) */
  sprog?: string;
  /** landekode udledt af hostens geo-header (aldrig IP) */
  land?: string;
  /** modtaget — epoch-ms */
  ts: number;
};

const MAKS = 5000; // nødbremse mod ubegrænset vækst

function mappe(): string {
  const base = process.env.DATA_DIR ?? path.join(process.cwd(), "data");
  return path.join(base, "messages");
}
function fil(): string {
  return path.join(mappe(), "messages.json");
}

// Serialisér alle læs/skriv gennem én kæde (single-instance lås)
let kaede: Promise<unknown> = Promise.resolve();
function iKoe<T>(fn: () => Promise<T>): Promise<T> {
  const naeste = kaede.then(fn, fn);
  kaede = naeste.catch(() => {});
  return naeste;
}

async function laesAlle(): Promise<Besked[]> {
  let t: string;
  try {
    t = await readFile(fil(), "utf8");
  } catch (err) {
    // Filen mangler endnu = tom indbakke. Andre I/O-fejl skal IKKE skjules.
    if ((err as NodeJS.ErrnoException)?.code === "ENOENT") return [];
    throw err;
  }
  // En korrupt/uparselig fil må ALDRIG læses som [] — så ville næste skrivning
  // overskrive (recoverbar) data med kun den nye besked og udslette historikken.
  const arr = JSON.parse(t);
  if (!Array.isArray(arr)) throw new Error("messages.json er ikke et array");
  return arr as Besked[];
}

async function skrivAlle(liste: Besked[]): Promise<void> {
  await mkdir(mappe(), { recursive: true });
  // Unik temp pr. skrivning → ingen delt-.tmp-interleave hvis flere processer
  // nogensinde deler DATA_DIR; publiceres atomart via rename.
  const tmp = `${fil()}.${process.pid}.${randomUUID()}.tmp`;
  await writeFile(tmp, JSON.stringify(liste), "utf8");
  await rename(tmp, fil());
}

export async function gemBesked(input: {
  navn: string;
  email: string;
  emne?: string;
  besked: string;
  sprog?: string;
  land?: string;
}): Promise<Besked> {
  return iKoe(async () => {
    const liste = await laesAlle();
    const b: Besked = {
      id: randomUUID(),
      navn: input.navn,
      email: input.email,
      emne: input.emne,
      besked: input.besked,
      sprog: input.sprog,
      land: input.land,
      laest: false,
      arkiveret: false,
      ts: Date.now(),
    };
    liste.push(b);
    if (liste.length > MAKS) liste.splice(0, liste.length - MAKS);
    await skrivAlle(liste);
    return b;
  });
}

/** Alle beskeder, nyeste først. Læses gennem køen, så den serialiseres med skrivninger. */
export async function hentBeskeder(): Promise<Besked[]> {
  return iKoe(async () => (await laesAlle()).sort((a, b) => b.ts - a.ts));
}

export async function opdaterBesked(
  id: string,
  patch: Partial<Pick<Besked, "laest" | "arkiveret">>,
): Promise<void> {
  return iKoe(async () => {
    const liste = await laesAlle();
    const i = liste.findIndex((b) => b.id === id);
    if (i >= 0) {
      liste[i] = { ...liste[i], ...patch };
      await skrivAlle(liste);
    }
  });
}

export async function sletBesked(id: string): Promise<void> {
  return iKoe(async () => {
    const liste = await laesAlle();
    const ny = liste.filter((b) => b.id !== id);
    if (ny.length !== liste.length) await skrivAlle(ny);
  });
}
