/**
 * HostStack-API'et, LÆSENDE, til ODINs fane «Synlighed» (24-10-2026).
 *
 * Samme kilde som Discebos /admin/synlighed: cookieløs trafik pr. kanal for
 * alle besøgende, Google Search Console, Bing Webmaster Tools, den ugentlige
 * SEO-/GEO-audit og drift set udefra (uptime, fejl-issues, hukommelse).
 *
 * `HOSTSTACK_API_KEY` er en læse-nøgle (scope «read»), kun som secret på
 * servicen. Uden den — eller hvis HostStack ikke svarer — står kilden som
 * «kunne ikke hentes» med årsagen, aldrig som 0.
 */
const BASE = "https://hoststack.dev";
const DOMAENE = "camsilo.dk";

export type HsPeriode = "24h" | "7d" | "30d" | "90d";

type Hent<T> = { data: T | null; fejl: string | null };

async function hent<T>(sti: string): Promise<Hent<T>> {
  const k = process.env.HOSTSTACK_API_KEY;
  if (!k) return { data: null, fejl: "HOSTSTACK_API_KEY er ikke sat" };
  try {
    const r = await fetch(`${BASE}${sti}`, {
      headers: { authorization: `Bearer ${k}`, accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) return { data: null, fejl: `HostStack svarede ${r.status}` };
    return { data: (await r.json()) as T, fejl: null };
  } catch (e) {
    return { data: null, fejl: e instanceof Error ? e.name : "netværksfejl" };
  }
}

type Linje = { query?: string; page?: string; clicks: number; impressions: number; position: number | null };

export type Synlighed = {
  oversigt: {
    summary: { current: { pageviews: number; visitors: number }; previous: { pageviews: number; visitors: number } };
    channels: { channel: string; visits: number }[];
    topReferrers: { referrer: string; visits: number }[];
    entryPages: { path: string; visits: number }[];
  } | null;
  search: { links: unknown[]; totals: { clicks: number; impressions: number; ctr: number | null; position: number | null }; topQueries: Linje[] } | null;
  bing: { links: unknown[]; totals: { clicks: number; impressions: number }; topQueries: Linje[] } | null;
  seo: {
    latest: {
      finishedAt: string | null;
      scores: Record<string, number>;
      findings: { id: string; status: string; pages?: string[] }[];
      speed: { performance: number | null } | null;
    } | null;
  } | null;
  uptime: { check: { status: string; lastLatencyMs: number | null; lastCheckedAt: string | null } | null } | null;
  fejl: { title: string; culprit: string | null; occurrenceCount: number; lastSeenAt: string; status: string }[] | null;
  problemer: Record<string, string>;
};

let cache: { noegle: string; til: number; data: Synlighed } | null = null;

export async function hentSynlighed(periode: HsPeriode): Promise<Synlighed> {
  const noegle = periode;
  if (cache && cache.noegle === noegle && cache.til > Date.now()) return cache.data;

  const team = process.env.HOSTSTACK_TEAM_ID || "18";
  const problemer: Record<string, string> = {};
  const sites = await hent<{ sites: { id: number; domain: string; serviceId: number | null }[] }>(`/api/analytics/${team}/sites`);
  const site = sites.data?.sites.find((s) => s.domain === DOMAENE);
  if (!site) problemer.site = sites.fejl ?? `${DOMAENE} er ikke tilmeldt HostStack analytics`;
  const q = site ? `?siteIds=${site.id}&range=${periode}` : "";
  const tom = Promise.resolve({ data: null, fejl: null } as Hent<never>);

  const [oversigt, search, bing, seo, uptime, fejl] = await Promise.all([
    site ? hent<Synlighed["oversigt"]>(`/api/analytics/${team}/overview${q}`) : tom,
    site ? hent<Synlighed["search"]>(`/api/analytics/${team}/search-console${q}`) : tom,
    site ? hent<Synlighed["bing"]>(`/api/analytics/${team}/bing${q}`) : tom,
    site ? hent<Synlighed["seo"]>(`/api/analytics/${team}/sites/${site.id}/seo-audit`) : tom,
    site?.serviceId ? hent<Synlighed["uptime"]>(`/api/services/${team}/${site.serviceId}/uptime-check`) : tom,
    site?.serviceId ? hent<{ issues: NonNullable<Synlighed["fejl"]> }>(`/api/errors/${team}/issues?serviceId=${site.serviceId}`) : tom,
  ]);
  for (const [navn, s] of Object.entries({ oversigt, search, bing, seo, uptime, fejl })) if (s.fejl) problemer[navn] = s.fejl;

  const data: Synlighed = {
    oversigt: oversigt.data,
    search: search.data,
    bing: bing.data,
    seo: seo.data,
    uptime: uptime.data,
    fejl: fejl.data?.issues ?? null,
    problemer,
  };
  cache = { noegle, til: Date.now() + 60_000, data };
  return data;
}
