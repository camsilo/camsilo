/**
 * Hændelses-lager for first-party analytics — NDJSON-filer pr. dag under
 * DATA_DIR/analytics (default ./data/analytics). Ingen database, ingen
 * IP-adresser. På HostStack uden persistent disk er lageret FLYGTIGT
 * (nulstilles ved redeploy/genstart) — sæt en disk for varig historik.
 */
import { appendFile, mkdir, readdir, readFile, unlink } from "fs/promises";
import path from "path";

const OPBEVARING_DAGE = 120; // hold ~4 mdr. (90d-perioden er den længste visning)
let sidstRyddet = 0;

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
  /** landekode (ISO-3166-1 alpha-2), udledt på serveren fra geo-header — aldrig IP */
  c?: string;
  /** enhedstype (Computer/Mobil/Tablet) — udledt af User-Agent på serveren */
  dv?: string;
  /** browser — udledt af User-Agent */
  br?: string;
  /** styresystem — udledt af User-Agent */
  os?: string;
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

/** Slet dags-filer ældre end OPBEVARING_DAGE — throttlet til højst hver 6. time. */
async function maaskeRyd(): Promise<void> {
  const nu = Date.now();
  if (nu - sidstRyddet < 6 * 3_600_000) return;
  sidstRyddet = nu;
  try {
    const dir = analyticsDir();
    const graense = new Date(nu - OPBEVARING_DAGE * 86_400_000)
      .toISOString()
      .slice(0, 10);
    for (const f of await readdir(dir)) {
      const m = f.match(/^events-(\d{4}-\d{2}-\d{2})\.ndjson$/);
      if (m && m[1] < graense) {
        await unlink(path.join(dir, f)).catch(() => {});
      }
    }
  } catch {
    // oprydning er ikke kritisk
  }
}

export async function gemHaendelse(h: Haendelse): Promise<void> {
  const dir = analyticsDir();
  await mkdir(dir, { recursive: true });
  await appendFile(path.join(dir, filnavnFor(h.ts)), JSON.stringify(h) + "\n", "utf8");
  void maaskeRyd();
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
