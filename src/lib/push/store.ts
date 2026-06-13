/**
 * Lager for Web Push-abonnementer (admins telefon/browser). Én JSON-fil under
 * DATA_DIR/push, skrevet atomart og serialiseret gennem en in-proces-kø — samme
 * mønster som beskeds-lageret. Dedupликeres på endpoint.
 */
import { mkdir, readFile, writeFile, rename } from "fs/promises";
import path from "path";

export type PushAbonnement = {
  endpoint: string;
  expirationTime?: number | null;
  keys: { p256dh: string; auth: string };
  ts: number;
};

function mappe(): string {
  const base = process.env.DATA_DIR ?? path.join(process.cwd(), "data");
  return path.join(base, "push");
}
function fil(): string {
  return path.join(mappe(), "subscriptions.json");
}

let kaede: Promise<unknown> = Promise.resolve();
function iKoe<T>(fn: () => Promise<T>): Promise<T> {
  const naeste = kaede.then(fn, fn);
  kaede = naeste.catch(() => {});
  return naeste;
}

async function laesAlle(): Promise<PushAbonnement[]> {
  try {
    const t = await readFile(fil(), "utf8");
    const arr = JSON.parse(t);
    return Array.isArray(arr) ? (arr as PushAbonnement[]) : [];
  } catch (err) {
    if ((err as NodeJS.ErrnoException)?.code === "ENOENT") return [];
    return []; // push-abonnementer er ikke kritiske — degradér til tomt
  }
}

async function skrivAlle(liste: PushAbonnement[]): Promise<void> {
  await mkdir(mappe(), { recursive: true });
  const tmp = `${fil()}.${process.pid}.tmp`;
  await writeFile(tmp, JSON.stringify(liste), "utf8");
  await rename(tmp, fil());
}

export async function gemAbonnement(
  sub: Omit<PushAbonnement, "ts">,
): Promise<void> {
  return iKoe(async () => {
    const liste = (await laesAlle()).filter((a) => a.endpoint !== sub.endpoint);
    liste.push({ ...sub, ts: Date.now() });
    if (liste.length > 50) liste.splice(0, liste.length - 50);
    await skrivAlle(liste);
  });
}

export async function hentAbonnementer(): Promise<PushAbonnement[]> {
  return iKoe(() => laesAlle());
}

export async function sletAbonnement(endpoint: string): Promise<void> {
  return iKoe(async () => {
    const liste = await laesAlle();
    const ny = liste.filter((a) => a.endpoint !== endpoint);
    if (ny.length !== liste.length) await skrivAlle(ny);
  });
}
