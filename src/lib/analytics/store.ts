/**
 * Hændelses-lager for first-party analytics — NDJSON-filer pr. dag under
 * DATA_DIR/analytics (default ./data/analytics). Ingen database, ingen
 * IP-adresser. På HostStack uden persistent disk er lageret FLYGTIGT
 * (nulstilles ved redeploy/genstart) — sæt en disk for varig historik.
 */
import { appendFile, mkdir, readdir, readFile } from "fs/promises";
import path from "path";

export type Haendelse = {
  /** hit = sidevisning, ping = aktivitets-puls (synlig fane) */
  t: "hit" | "ping";
  /** sessions-id (tilfældigt uuid fra sessionStorage) */
  s: string;
  /** sti, kun ved hit */
  p?: string;
  /** referrer, kun ved hit */
  r?: string;
  /** browsersprog */
  l?: string;
  /** epoch-ms (sættes på serveren) */
  ts: number;
};

function analyticsDir(): string {
  const base = process.env.DATA_DIR ?? path.join(process.cwd(), "data");
  return path.join(base, "analytics");
}

function filnavnFor(ts: number): string {
  return `events-${new Date(ts).toISOString().slice(0, 10)}.ndjson`;
}

export async function gemHaendelse(h: Haendelse): Promise<void> {
  const dir = analyticsDir();
  await mkdir(dir, { recursive: true });
  await appendFile(path.join(dir, filnavnFor(h.ts)), JSON.stringify(h) + "\n", "utf8");
}

/** Læs alle hændelser med ts i [fra, til]. Filerne er dags-afgrænsede i UTC. */
export async function laesHaendelser(fra: number, til: number): Promise<Haendelse[]> {
  const dir = analyticsDir();
  let filer: string[];
  try {
    filer = await readdir(dir);
  } catch {
    return [];
  }

  const fraDag = new Date(fra).toISOString().slice(0, 10);
  const tilDag = new Date(til).toISOString().slice(0, 10);
  const relevante = filer
    .filter((f) => /^events-\d{4}-\d{2}-\d{2}\.ndjson$/.test(f))
    .filter((f) => {
      const dag = f.slice(7, 17);
      return dag >= fraDag && dag <= tilDag;
    })
    .sort();

  const ud: Haendelse[] = [];
  for (const fil of relevante) {
    let tekst: string;
    try {
      tekst = await readFile(path.join(dir, fil), "utf8");
    } catch {
      continue;
    }
    for (const linje of tekst.split("\n")) {
      if (!linje) continue;
      try {
        const h = JSON.parse(linje) as Haendelse;
        if (
          typeof h.ts === "number" &&
          h.ts >= fra &&
          h.ts <= til &&
          (h.t === "hit" || h.t === "ping") &&
          typeof h.s === "string"
        ) {
          ud.push(h);
        }
      } catch {
        // korrupt linje (fx afbrudt skrivning) — spring over
      }
    }
  }
  return ud;
}
