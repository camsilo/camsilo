/**
 * Lokalt tilstands-overlay for indgående mails (PostStack leverer selve
 * mailen, men har ingen læst/arkiv-API). Vi gemmer per-mail-id: læst, arkiveret,
 * slettet — i én JSON-fil under DATA_DIR/mail, atomart + serialiseret gennem en
 * in-proces-kø (samme mønster som beskeds-lageret).
 */
import { mkdir, readFile, writeFile, rename } from "fs/promises";
import path from "path";

export type MailTilstand = {
  laest?: boolean;
  arkiveret?: boolean;
  slettet?: boolean;
  ts?: number;
};
export type MailTilstande = Record<string, MailTilstand>;

function mappe(): string {
  const base = process.env.DATA_DIR ?? path.join(process.cwd(), "data");
  return path.join(base, "mail");
}
function fil(): string {
  return path.join(mappe(), "state.json");
}

let kaede: Promise<unknown> = Promise.resolve();
function iKoe<T>(fn: () => Promise<T>): Promise<T> {
  const naeste = kaede.then(fn, fn);
  kaede = naeste.catch(() => {});
  return naeste;
}

async function laesAlle(): Promise<MailTilstande> {
  try {
    const t = await readFile(fil(), "utf8");
    const o = JSON.parse(t);
    return o && typeof o === "object" ? (o as MailTilstande) : {};
  } catch {
    return {};
  }
}

async function skrivAlle(t: MailTilstande): Promise<void> {
  await mkdir(mappe(), { recursive: true });
  const tmp = `${fil()}.${process.pid}.tmp`;
  await writeFile(tmp, JSON.stringify(t), "utf8");
  await rename(tmp, fil());
}

export async function hentMailTilstande(): Promise<MailTilstande> {
  return iKoe(() => laesAlle());
}

export async function saetMailTilstand(
  id: string,
  patch: MailTilstand,
): Promise<void> {
  return iKoe(async () => {
    const alle = await laesAlle();
    alle[id] = { ...alle[id], ...patch, ts: Date.now() };
    // hold filen lille — drop slettede der er meget gamle (PostStack-id'er forsvinder ikke, men loftet beskytter)
    const ider = Object.keys(alle);
    if (ider.length > 5000) {
      for (const k of ider.slice(0, ider.length - 5000)) delete alle[k];
    }
    await skrivAlle(alle);
  });
}
