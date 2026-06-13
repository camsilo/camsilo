/**
 * Modtager tracking-beacons fra <Sporing/>. Gemmer ALDRIG IP-adresser —
 * IP bruges kun flygtigt i hukommelsen til rate-limiting.
 */
import { gemHaendelse } from "@/lib/analytics/store";
import { klientIp } from "@/lib/klient-ip";
import { tolkUa } from "@/lib/ua";

export const runtime = "nodejs";

const VINDUE_MS = 60_000;
const MAKS_PR_VINDUE = 120; // pr. IP
const MAKS_GLOBALT = 2000; // backstop på tværs af alle IP'er pr. vindue
const MAKS_KROP = 4 * 1024; // 4 KB — et beacon-body er <1 KB
const taeller = new Map<string, { n: number; start: number }>();
let globalt = { n: 0, start: 0 };

/**
 * Landekode fra en geo-header, hvis platformen leverer en. Vi læser KUN den
 * færdige 2-bogstavs landekode (proxyen udleder den af IP'en ved kanten) —
 * selve IP'en gemmes aldrig. Tom hvis hosten ikke beriger med geo.
 */
const GEO_HEADERE = [
  "cf-ipcountry", // Cloudflare
  "x-vercel-ip-country", // Vercel
  "x-geo-country",
  "x-country-code",
  "fastly-geo-country",
  "x-appengine-country",
];

function landekode(req: Request): string | undefined {
  for (const h of GEO_HEADERE) {
    const v = req.headers.get(h)?.trim().toUpperCase();
    if (v && /^[A-Z]{2}$/.test(v) && v !== "XX" && v !== "T1") return v;
  }
  return undefined;
}

function rateLimited(noegle: string): boolean {
  const nu = Date.now();
  const post = taeller.get(noegle);
  if (!post || nu - post.start > VINDUE_MS) {
    taeller.set(noegle, { n: 1, start: nu });
    return false;
  }
  post.n++;
  if (taeller.size > 10_000) taeller.clear(); // nødbremse mod hukommelsesvækst
  return post.n > MAKS_PR_VINDUE;
}

function globaltOverskredet(): boolean {
  const nu = Date.now();
  if (nu - globalt.start > VINDUE_MS) {
    globalt = { n: 1, start: nu };
    return false;
  }
  globalt.n++;
  return globalt.n > MAKS_GLOBALT;
}

export async function POST(req: Request): Promise<Response> {
  // Robust IP — ikke den spoofbare venstre-mest XFF-hop (se lib/klient-ip)
  const ip = klientIp(req.headers);
  if (rateLimited(ip) || globaltOverskredet()) {
    return new Response(null, { status: 429 });
  }

  // Body-loft FØR parse
  const len = Number(req.headers.get("content-length"));
  if (Number.isFinite(len) && len > MAKS_KROP) {
    return new Response(null, { status: 413 });
  }
  let krop: unknown;
  try {
    const raw = await req.text();
    if (raw.length > MAKS_KROP) return new Response(null, { status: 413 });
    krop = JSON.parse(raw);
  } catch {
    return new Response(null, { status: 400 });
  }
  if (!krop || typeof krop !== "object") return new Response(null, { status: 400 });

  const o = krop as Record<string, unknown>;
  const t = o.t === "ping" ? "ping" : o.t === "hit" ? "hit" : null;
  const s = typeof o.s === "string" ? o.s.slice(0, 64) : null;
  if (!t || !s) return new Response(null, { status: 400 });

  const p =
    typeof o.p === "string" && o.p.startsWith("/") ? o.p.slice(0, 200) : undefined;
  const r = typeof o.r === "string" ? o.r.slice(0, 300) : undefined;
  const l = typeof o.l === "string" ? o.l.slice(0, 16) : undefined;

  // Admin-sider spores ikke
  if (p?.startsWith("/admin")) return new Response(null, { status: 204 });

  const c = landekode(req);
  // Enhed/browser/OS udledes af User-Agent — kun på hits (pings er bare pulser)
  const ua = t === "hit" ? tolkUa(req.headers.get("user-agent")) : null;

  try {
    await gemHaendelse({
      t,
      s,
      p,
      r: r || undefined,
      l,
      c,
      dv: ua?.enhed,
      br: ua?.browser,
      os: ua?.os,
      ts: Date.now(),
    });
  } catch (err) {
    console.error("[analytics] kunne ikke gemme hændelse:", err);
    return new Response(null, { status: 500 });
  }
  return new Response(null, { status: 204 });
}
