"use client";

/**
 * OdinOracle — showpiece-headeren i Odin-kommandocenteret.
 *
 * Et JARVIS-agtigt kommandocenter, men i nordisk vikingetema: Alfaderens
 * alvidende udsyn over camsilo.dk. Venstre side bærer brandet "ODIN" med et
 * alvidende øje/valknut-motiv og de to ravne Huginn & Muninn; højre side bærer
 * et levende ur (Europe/Copenhagen) plus en nordisk-stemt rige-status.
 *
 * Uret renderes først efter mount for at undgå hydration-mismatch (server og
 * klient ville ellers vise forskellig tid).
 */

import { useEffect, useState } from "react";

export type OdinOracleProps = {
  /** sjæle aktive i riget netop nu (sidste 5 min) */
  onlineNu: number;
  /** unikke gæster i den valgte periode */
  unikke: number;
  /** sidevisninger i den valgte periode */
  visninger: number;
  /** menneskelæselig periode, fx "24t" eller "7d" */
  periodeLabel: string;
  /** gennemsnitlig besøgslængde i sekunder (kan mangle) */
  gnsBesoegSek: number | null;
};

/** da-DK heltalsformatering med tusindtalsadskillelse. */
const heltal = new Intl.NumberFormat("da-DK");

/** Sekunder → kort nordisk varighed, fx "1 m 12 s" eller "44 s". */
function varighed(sek: number | null): string {
  if (sek === null || !Number.isFinite(sek) || sek <= 0) return "—";
  const s = Math.round(sek);
  if (s < 60) return `${s} s`;
  const m = Math.floor(s / 60);
  const rest = s % 60;
  return rest ? `${m} m ${rest} s` : `${m} m`;
}

const URET_TID = new Intl.DateTimeFormat("da-DK", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  timeZone: "Europe/Copenhagen",
});

const URET_DATO = new Intl.DateTimeFormat("da-DK", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Europe/Copenhagen",
});

/**
 * Valknut + alvidende øje — Odins segl. Rent SVG via currentColor/CSS-vars,
 * responsivt (viewBox + width:100%). De tre sammenflettede trekanter er
 * valknutten; den centrale mandel + iris er det alvidende øje.
 */
function OdinSegl() {
  return (
    <svg
      viewBox="0 0 120 120"
      role="img"
      aria-label="Odins segl — valknut med det alvidende øje"
      style={{ width: "100%", height: "auto", display: "block" }}
    >
      <defs>
        <radialGradient id="odin-iris" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--ember-light)" />
          <stop offset="55%" stopColor="var(--ember)" />
          <stop offset="100%" stopColor="var(--ember-deep)" />
        </radialGradient>
      </defs>

      {/* Ydre rune-ring */}
      <circle
        cx="60"
        cy="60"
        r="56"
        fill="none"
        stroke="var(--seid)"
        strokeOpacity="0.35"
        strokeWidth="1"
      />
      <circle
        cx="60"
        cy="60"
        r="51"
        fill="none"
        stroke="var(--ember)"
        strokeOpacity="0.45"
        strokeWidth="0.75"
        strokeDasharray="2 5"
      />

      {/* Valknut — tre sammenflettede trekanter */}
      <g
        fill="none"
        stroke="var(--ember)"
        strokeWidth="2.4"
        strokeLinejoin="round"
        strokeOpacity="0.9"
      >
        <polygon points="60,16 33,64 87,64" />
        <polygon points="42,30 96,30 69,78" />
        <polygon points="78,30 24,30 51,78" />
      </g>

      {/* Det alvidende øje — mandelform + iris */}
      <path
        d="M30 64 Q60 44 90 64 Q60 84 30 64 Z"
        fill="var(--bg)"
        stroke="var(--seid)"
        strokeWidth="1.4"
        strokeOpacity="0.8"
      />
      <circle cx="60" cy="64" r="11" fill="url(#odin-iris)" />
      <circle cx="60" cy="64" r="4.4" fill="var(--bg)" />
      <circle cx="56.5" cy="60.5" r="1.6" fill="var(--ink)" fillOpacity="0.9" />
    </svg>
  );
}

export default function OdinOracle({
  onlineNu,
  unikke,
  visninger,
  periodeLabel,
  gnsBesoegSek,
}: OdinOracleProps) {
  // Uret sættes først efter mount → server og klient stemmer overens.
  const [tid, setTid] = useState<string>("—");
  const [dato, setDato] = useState<string>("");

  useEffect(() => {
    const opdater = () => {
      const nu = new Date();
      setTid(URET_TID.format(nu));
      setDato(URET_DATO.format(nu));
    };
    opdater();
    const id = window.setInterval(opdater, 1000);
    return () => window.clearInterval(id);
  }, []);

  const sjaele = heltal.format(onlineNu);
  const gaester = heltal.format(unikke);
  const sidevisninger = heltal.format(visninger);

  return (
    <header className="hud-panel hud-panel-accent odin-orakel">
      {/* ── VENSTRE: brand, segl, ravne ─────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "clamp(16px, 2.2vw, 28px)",
          minWidth: 0,
        }}
      >
        {/* Odins segl */}
        <div
          style={{
            width: "clamp(72px, 9vw, 104px)",
            flex: "0 0 auto",
            filter: "drop-shadow(0 0 18px rgba(242, 106, 27, 0.35))",
          }}
        >
          <OdinSegl />
        </div>

        <div style={{ minWidth: 0 }}>
          {/* Hoved-label med rune */}
          <span className="hud-label" style={{ marginBottom: "6px" }}>
            <span className="hud-rune" aria-hidden="true">
              ᚨ
            </span>
            Alfaderens orakel
          </span>

          {/* Brand: ODIN */}
          <h1
            style={{
              fontFamily: "var(--font-display), sans-serif",
              fontWeight: 700,
              fontSize: "clamp(46px, 6.6vw, 88px)",
              lineHeight: 0.9,
              letterSpacing: "0.04em",
              margin: "2px 0 6px",
              color: "var(--ink)",
              textShadow:
                "0 0 26px rgba(242, 106, 27, 0.45), 0 0 70px rgba(242, 106, 27, 0.18)",
            }}
          >
            ODIN
          </h1>

          {/* Undertitel */}
          <p
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: "clamp(11px, 1vw, 13px)",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--dim)",
              margin: 0,
            }}
          >
            Alfaderens udsyn over camsilo.dk
          </p>

          {/* Huginn & Muninn — de to ravne */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              marginTop: "12px",
              fontFamily: "var(--font-mono), monospace",
              fontSize: "11px",
              letterSpacing: "0.12em",
              color: "var(--faint)",
            }}
          >
            <span
              title="Huginn — tanken"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span
                aria-hidden="true"
                style={{ color: "var(--ember)", fontSize: "14px" }}
              >
                ᚺ
              </span>
              <span aria-hidden="true">🜲</span>
              HUGINN
            </span>
            <span style={{ color: "var(--hud-line)", opacity: 0.6 }}>·</span>
            <span
              title="Muninn — mindet"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span
                aria-hidden="true"
                style={{ color: "var(--seid)", fontSize: "14px" }}
              >
                ᛗ
              </span>
              <span aria-hidden="true">🜲</span>
              MUNINN
            </span>
          </div>
        </div>
      </div>

      {/* ── HØJRE: live-ur + rige-status ────────────────────────── */}
      <div
        className="odin-orakel-hoejre"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "14px",
          minWidth: 0,
        }}
      >
        {/* Live-ur */}
        <div>
          <span
            className="hud-meta"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span className="hud-puls" aria-hidden="true" />
            BIVRØST-TID · KØBENHAVN
          </span>
          <div
            className="hud-readout hud-readout-xl"
            style={{
              marginTop: "4px",
              fontVariantNumeric: "tabular-nums",
              color: "var(--ink)",
            }}
          >
            {tid}
          </div>
          <div
            className="hud-meta"
            style={{
              marginTop: "2px",
              textTransform: "capitalize",
              color: "var(--seid)",
              minHeight: "1.2em",
            }}
          >
            {dato || " "}
          </div>
        </div>

        <div className="hud-divider" />

        {/* Rige-status */}
        <p
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: "12.5px",
            lineHeight: 1.6,
            letterSpacing: "0.04em",
            color: "var(--dim)",
            margin: 0,
          }}
        >
          <strong style={{ color: "var(--seid)", fontWeight: 700 }}>
            {sjaele}
          </strong>{" "}
          {onlineNu === 1 ? "sjæl vandrer" : "sjæle vandrer"} i riget nu ·{" "}
          <strong style={{ color: "var(--ember-light)", fontWeight: 700 }}>
            {gaester}
          </strong>{" "}
          {unikke === 1 ? "gæst" : "gæster"} i {periodeLabel}
        </p>

        {/* Små runesten-aflæsninger */}
        <div
          style={{
            display: "flex",
            gap: "clamp(14px, 2vw, 26px)",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              flexDirection: "column",
              gap: "2px",
            }}
          >
            <span className="hud-unit">Syner</span>
            <span
              className="hud-readout"
              style={{ fontSize: "clamp(16px, 1.6vw, 22px)" }}
            >
              {sidevisninger}
            </span>
          </span>
          <span
            style={{
              display: "inline-flex",
              flexDirection: "column",
              gap: "2px",
            }}
          >
            <span className="hud-unit">Gns. ophold</span>
            <span
              className="hud-readout"
              style={{ fontSize: "clamp(16px, 1.6vw, 22px)" }}
            >
              {varighed(gnsBesoegSek)}
            </span>
          </span>
        </div>
      </div>
    </header>
  );
}
