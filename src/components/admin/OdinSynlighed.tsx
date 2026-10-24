import OdinFordeling from "@/components/admin/OdinFordeling";
import { OdinKpi } from "@/components/admin/OdinKpi";
import type { Synlighed } from "@/lib/hoststack";

/**
 * ODIN · Synlighed (24-10-2026): hvordan folk finder camsilo.dk, set fra
 * HostStack — trafik pr. kanal for ALLE besøgende (cookieløst), Google, Bing,
 * SEO-/GEO-auditten og drift set udefra. Server-komponent; data hentes i
 * `@/lib/hoststack`. Mangler en kilde, står årsagen — aldrig et nul.
 */
const fmt = new Intl.NumberFormat("da-DK");
const tal = (n: number | null | undefined) => (typeof n === "number" ? fmt.format(n) : "—");
const tid = (iso: string | null | undefined) =>
  iso
    ? new Date(iso).toLocaleString("da-DK", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Copenhagen" })
    : "—";

const KANALER: Record<string, string> = {
  organic_search: "Organisk søgning",
  ai_assistant: "AI-assistenter",
  direct: "Direkte",
  referral: "Henvisninger",
  social: "Sociale medier",
  email: "E-mail",
  paid_search: "Betalt søgning",
  paid_social: "Betalt socialt",
  paid_other: "Betalt, andet",
};

function Panel({ rune, label, meta, children }: { rune: string; label: string; meta?: string; children: React.ReactNode }) {
  return (
    <section className="hud-panel" style={{ height: "100%" }}>
      <div className="hud-head">
        <span className="hud-label">
          <span className="hud-rune" aria-hidden="true">{rune}</span> {label}
        </span>
        {meta ? <span className="hud-meta">{meta}</span> : null}
      </div>
      <div style={{ padding: "10px 2px 2px", fontSize: 14, lineHeight: 1.6 }}>{children}</div>
    </section>
  );
}

function Mangler({ d, kilde }: { d: Synlighed; kilde: string }) {
  return d.problemer[kilde] ? (
    <p className="hud-meta" style={{ color: "var(--faint)" }}>Kunne ikke hentes: {d.problemer[kilde]}</p>
  ) : null;
}

export function OdinSynlighed({ d }: { d: Synlighed }) {
  const nu = d.oversigt?.summary.current;
  const foer = d.oversigt?.summary.previous;
  const delta = (a?: number, b?: number) => (a !== undefined && b ? Math.round(((a - b) / b) * 100) : null);
  const audit = d.seo?.latest ?? null;
  const aabne = (d.fejl ?? []).filter((f) => f.status === "unresolved");
  const uptime = d.uptime?.check ?? null;

  return (
    <>
      {d.problemer.site ? (
        <section className="hud-panel"><p>{d.problemer.site}</p></section>
      ) : null}

      <div className="odin-kpis">
        <OdinKpi rune="ᛗ" label="Besøgende (alle)" value={tal(nu?.visitors)} delta={delta(nu?.visitors, foer?.visitors)} />
        <OdinKpi rune="ᚠ" label="Sidevisninger (alle)" value={tal(nu?.pageviews)} delta={delta(nu?.pageviews, foer?.pageviews)} />
        <OdinKpi rune="ᛊ" label="Google-klik" value={(d.search?.links.length ?? 0) > 0 ? tal(d.search?.totals.clicks) : "ikke koblet"} />
        <OdinKpi rune="ᛒ" label="Bing-klik" value={(d.bing?.links.length ?? 0) > 0 ? tal(d.bing?.totals.clicks) : "ikke koblet"} />
        <OdinKpi rune="ᛟ" label="Oppe" value={uptime ? (uptime.status === "up" ? `${tal(uptime.lastLatencyMs)} ms` : uptime.status) : "—"} />
      </div>

      <div className="odin-grid">
        <div className="col-6">
          <OdinFordeling
            rune="ᚱ"
            label="Kanaler (alle besøgende)"
            poster={(d.oversigt?.channels ?? []).map((k) => ({ navn: KANALER[k.channel] ?? k.channel, antal: k.visits }))}
            tom={d.problemer.oversigt ? `Kunne ikke hentes: ${d.problemer.oversigt}` : "Ingen besøg i perioden endnu."}
            visTotalAndel
          />
        </div>
        <div className="col-6">
          <OdinFordeling
            rune="ᚷ"
            label="Hvor de kom fra"
            poster={(d.oversigt?.topReferrers ?? []).slice(0, 10).map((r) => ({ navn: r.referrer, antal: r.visits }))}
            tom="Ingen henvisninger endnu."
          />
        </div>
      </div>

      <div className="odin-grid">
        <div className="col-6">
          <OdinFordeling
            rune="ᛊ"
            label="Google-søgninger"
            poster={(d.search?.topQueries ?? []).slice(0, 10).map((q) => ({ navn: q.query ?? "", antal: q.clicks }))}
            tom={(d.search?.links.length ?? 0) > 0 ? "Ingen søgeklik i perioden." : "Search Console er ikke koblet — hoststack analytics gsc connect camsilo.dk"}
          />
        </div>
        <div className="col-6">
          <OdinFordeling
            rune="ᛒ"
            label="Bing-søgninger (også ChatGPT/Copilot)"
            poster={(d.bing?.topQueries ?? []).slice(0, 10).map((q) => ({ navn: q.query ?? "", antal: q.clicks }))}
            tom={(d.bing?.links.length ?? 0) > 0 ? "Ingen søgeklik i perioden." : "Bing er ikke koblet — hoststack analytics bing connect --all"}
          />
        </div>
      </div>

      <div className="odin-grid">
        <div className="col-6">
          <Panel rune="ᛏ" label="SEO- og AI-læsbarhed" meta={audit ? tid(audit.finishedAt) : undefined}>
            {audit ? (
              <>
                <p>
                  SEO {tal(audit.scores.seo)} · GEO {tal(audit.scores.geo)} · Hastighed {tal(audit.scores.speed)} · Tillid{" "}
                  {tal(audit.scores.trust)} · Lighthouse mobil {tal(audit.speed?.performance)}
                </p>
                <ul>
                  {audit.findings
                    .filter((f) => f.status !== "pass")
                    .map((f) => (
                      <li key={f.id}>
                        {f.status === "fail" ? "Fejl" : "Advarsel"}: <code>{f.id}</code>
                        {f.pages?.length ? ` · ${f.pages.slice(0, 4).join(", ")}` : ""}
                      </li>
                    ))}
                </ul>
                <p className="hud-meta">Kører hver tirsdag · nu: hoststack seo audit camsilo.dk</p>
              </>
            ) : (
              <Mangler d={d} kilde="seo" />
            )}
          </Panel>
        </div>
        <div className="col-6">
          <Panel rune="ᚾ" label="Fejl HostStack har grupperet" meta={d.fejl ? `${aabne.length} ÅBNE` : undefined}>
            {d.fejl === null ? (
              <Mangler d={d} kilde="fejl" />
            ) : aabne.length === 0 ? (
              <p>Ingen åbne fejl. Uptime sidst tjekket {tid(uptime?.lastCheckedAt)}.</p>
            ) : (
              <ul>
                {aabne.slice(0, 8).map((f) => (
                  <li key={f.title + f.lastSeenAt}>
                    <code>{f.title}</code> · ×{tal(f.occurrenceCount)} · {tid(f.lastSeenAt)}
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </div>

      <p className="admin-fodnote">
        Fra HostStack: cookieløs måling af alle besøgende (intet på enheden, ingen IP-lagring), Google Search Console og
        Bing via HostStacks koblinger, ugentlig SEO-/GEO-audit og uptime set udefra. Fanen «Kommandocenter» er den egne
        førstepartsmåling.
      </p>
    </>
  );
}
