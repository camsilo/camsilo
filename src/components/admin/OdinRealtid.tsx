"use client";

import { useEffect, useState } from "react";
import type { RealtidsHit } from "@/lib/analytics/aggregate";

/**
 * Odin — live aktivitets-feed til kommandocenteret.
 *
 * Et glødende .hud-panel der viser de seneste sidevisninger i realtid, nyeste
 * først. Panel-hovedet har en pulserende seid-prik (.hud-puls) + "online nu".
 * Hver linje viser relativ tid ("nu", "3m", "1t"), sti, evt. land (flag+navn)
 * og enhed.
 *
 * Hydration: serveren kender ikke "nu", så de relative tider beregnes FØRST
 * efter mount (useState starter tomt, useEffect sætter et tids-anker). Inden
 * mount viser hver linje "·" som neutral pladsholder, så server- og første
 * klient-render matcher. Tiderne friskes hvert 15. sekund.
 */
export type OdinRealtidProps = {
  realtid: RealtidsHit[];
  onlineNu: number;
};

/** Elder Futhark-runer brugt som diskrete accenter. */
const RUNE_PANEL = "ᛟ"; // Othala — panel-rune
const RUNE_HIT = "ᛉ"; // Algiz — linje-markør

/** Pæn relativ tid på dansk: "nu" / "Xs" / "Xm" / "Xt" / "Xd". */
function relativTid(ts: number, nu: number): string {
  const diff = Math.max(0, nu - ts);
  const sek = Math.floor(diff / 1000);
  if (sek < 5) return "nu";
  if (sek < 60) return `${sek}s`;
  const min = Math.floor(sek / 60);
  if (min < 60) return `${min}m`;
  const timer = Math.floor(min / 60);
  if (timer < 24) return `${timer}t`;
  const dage = Math.floor(timer / 24);
  return `${dage}d`;
}

export function OdinRealtid({ realtid, onlineNu }: OdinRealtidProps) {
  // nuAnker er null indtil mount → ingen hydration-mismatch på relative tider.
  const [nuAnker, setNuAnker] = useState<number | null>(null);
  // monteret styrer en ENKELT diskret indglidning via CSS-transition (ingen
  // keyframes, ingen <style>-tag). Brugeren respekteres: en CSS-transition på
  // opacity/transform er let nok til at være acceptabel, og den udløses kun
  // én gang ved mount.
  const [monteret, setMonteret] = useState(false);

  useEffect(() => {
    setNuAnker(Date.now());
    // Næste frame: udløs indglidningen så transitionen faktisk animerer.
    const raf = requestAnimationFrame(() => setMonteret(true));
    // Frisk de relative tider hvert 15. sekund (diskret, kræver ingen data-hentning).
    const id = setInterval(() => setNuAnker(Date.now()), 15_000);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(id);
    };
  }, []);

  const harHits = realtid.length > 0;

  return (
    <section className="hud-panel" aria-live="polite">
      <div className="hud-head">
        <span className="hud-label">
          <span className="hud-rune" aria-hidden="true">
            {RUNE_PANEL}
          </span>
          REALTID
        </span>

        {/* Live-indikator: pulserende seid-prik + antal online */}
        <span
          className="hud-meta"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            color: "var(--seid)",
          }}
        >
          <span className="hud-puls" aria-hidden="true" />
          <span style={{ fontVariantNumeric: "tabular-nums" }}>
            {onlineNu.toLocaleString("da-DK")} i live
          </span>
        </span>
      </div>

      {!harHits ? (
        <p
          className="hud-meta"
          style={{
            color: "var(--faint)",
            padding: "14px 2px 4px",
            textAlign: "center",
          }}
        >
          Ingen aktivitet endnu
        </p>
      ) : (
        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {realtid.map((hit, i) => {
            // Diskret indglidning via transition: før mount sidder de øverste
            // (nyeste) linjer let forskudt + svage; ved mount glider de på plads.
            const venterIndglid = !monteret && i < 6;
            return (
              <li
                key={`${hit.ts}-${hit.sti}-${i}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto 1fr auto",
                  alignItems: "center",
                  columnGap: 12,
                  padding: "9px 2px",
                  borderTop:
                    i === 0
                      ? "none"
                      : "1px solid var(--hud-line, rgba(242,106,27,0.12))",
                  opacity: venterIndglid ? 0 : 1,
                  transform: venterIndglid ? "translateY(-4px)" : "translateY(0)",
                  transition: "opacity 420ms ease-out, transform 420ms ease-out",
                  transitionDelay: `${Math.min(i, 6) * 45}ms`,
                }}
              >
                {/* Relativ tid — mono, seid-tonet, fast bredde så stierne flugter */}
                <span
                  style={{
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: 11,
                    letterSpacing: "0.08em",
                    color: "var(--seid)",
                    fontVariantNumeric: "tabular-nums",
                    textAlign: "right",
                    minWidth: 34,
                    opacity: 0.92,
                  }}
                >
                  {nuAnker === null ? "·" : relativTid(hit.ts, nuAnker)}
                </span>

                {/* Sti — primær linje med rune-markør */}
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "baseline",
                    gap: 8,
                    minWidth: 0,
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      color: "var(--ember)",
                      fontSize: 11,
                      lineHeight: 1,
                      opacity: 0.85,
                      flexShrink: 0,
                    }}
                  >
                    {RUNE_HIT}
                  </span>
                  <span
                    title={hit.sti}
                    style={{
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: 12.5,
                      color: "var(--ink)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {hit.sti}
                  </span>
                </span>

                {/* Meta: land (flag+navn) · enhed */}
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: 10.5,
                    letterSpacing: "0.06em",
                    color: "var(--faint)",
                    whiteSpace: "nowrap",
                    justifySelf: "end",
                  }}
                >
                  {hit.land ? (
                    <span style={{ color: "var(--dim)" }} title={hit.land}>
                      {hit.land}
                    </span>
                  ) : null}
                  {hit.land && hit.enhed ? (
                    <span aria-hidden="true" style={{ opacity: 0.4 }}>
                      ·
                    </span>
                  ) : null}
                  {hit.enhed ? <span>{hit.enhed}</span> : null}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
