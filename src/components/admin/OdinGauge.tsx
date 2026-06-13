/**
 * OdinGauge — radial bue-måler til Odin-kommandocenteret.
 *
 * Server-komponent (ren SVG i et glødende .hud-panel). Tegner en ~270°
 * bue: en dæmpet baggrundsbue plus en fyldt bue der følger {procent},
 * med blød underglød (feGaussianBlur). I centrum sidder selve procenten
 * som stort .hud-readout, med valgfri dæmpet {undertekst}.
 *
 * Buens farve vælges med {farve}: "ember" (varm glød, default) eller
 * "seid" (kold rune-blågrøn). procent=null viser "—" og en tom bue.
 * Værdien klampes til 0..100.
 */

export type OdinGaugeProps = {
  /** Elder-Futhark-rune som accent i panel-hovedet (fx "ᛟ"). */
  rune: string;
  /** Mono-caps-etiket, fx "ENGAGEMENT". */
  label: string;
  /** Procent 0..100 der skal vises; null = ingen måling ("—"). */
  procent: number | null;
  /** Buens accentfarve. Default "ember". */
  farve?: "ember" | "seid";
  /** Valgfri dæmpet undertekst under tallet, fx "af besøg". */
  undertekst?: string;
};

// Geometri for buen — et kvadratisk lærred med en 270°-bue (gab nedad).
const STR = 240; // SVG-viewBox (kvadratisk)
const CENTER = STR / 2;
const RADIUS = 96; // bue-radius
const STROKE = 16; // bue-tykkelse
const SWEEP = 270; // graders sweep
const START = 135; // startvinkel (nede til venstre), urets retning

/** Punkt på buens cirkel ved en given vinkel (grader, 0° = øst, med uret). */
function polaer(vinkel: number): { x: number; y: number } {
  const rad = (vinkel * Math.PI) / 180;
  return {
    x: CENTER + RADIUS * Math.cos(rad),
    y: CENTER + RADIUS * Math.sin(rad),
  };
}

/**
 * SVG-sti for en bue fra startvinkel henover {grader} (med uret).
 * Tom streng hvis der ikke skal tegnes noget.
 */
function bueSti(startVinkel: number, grader: number): string {
  if (grader <= 0) return "";
  // Undgå at en fuld cirkel kollapser (A-kommandoen kan ikke nå 360° rent).
  const spand = Math.min(grader, 359.999);
  const p0 = polaer(startVinkel);
  const p1 = polaer(startVinkel + spand);
  const storBue = spand > 180 ? 1 : 0;
  return `M ${p0.x} ${p0.y} A ${RADIUS} ${RADIUS} 0 ${storBue} 1 ${p1.x} ${p1.y}`;
}

export function OdinGauge({
  rune,
  label,
  procent,
  farve = "ember",
  undertekst,
}: OdinGaugeProps) {
  const harData = procent !== null && Number.isFinite(procent);
  // Klamp 0..100 så buen aldrig løber over kanten.
  const pct = harData ? Math.max(0, Math.min(100, procent as number)) : 0;

  const accent = farve === "seid" ? "var(--seid)" : "var(--ember)";
  // Unikke id'er pr. farve så to målere på samme side ikke deler filter/gradient.
  const idGlow = `odinGaugeGlow-${farve}`;
  const idFyld = `odinGaugeFyld-${farve}`;

  // Baggrundsbue: hele sweepet. Fyldt bue: andel af sweepet.
  const baggrundSti = bueSti(START, SWEEP);
  const fyldSti = harData ? bueSti(START, (pct / 100) * SWEEP) : "";

  // Læsbart tal — heltal hvis muligt, ellers én decimal med dansk komma.
  const visTal = harData
    ? Number.isInteger(pct)
      ? String(pct)
      : pct.toFixed(1).replace(".", ",")
    : "—";

  return (
    <section
      className="hud-panel"
      style={{ display: "flex", flexDirection: "column", gap: 14 }}
    >
      <div className="hud-head" style={{ marginBottom: 0 }}>
        <span className="hud-label">
          <span className="hud-rune" aria-hidden="true">
            {rune}
          </span>
          {label}
        </span>
        <span className="hud-meta">{harData ? "MÅLT" : "INGEN DATA"}</span>
      </div>

      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 320,
          margin: "0 auto",
        }}
      >
        <svg
          viewBox={`0 0 ${STR} ${STR}`}
          role="img"
          aria-label={`${label}: ${harData ? `${visTal} procent` : "ingen data"}`}
          style={{ width: "100%", height: "auto", display: "block" }}
        >
          <defs>
            {/* Blød underglød til den fyldte bue */}
            <filter id={idGlow} x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="5" result="sløret" />
              <feMerge>
                <feMergeNode in="sløret" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Vinkel-gradient langs buen: fra dyb glød til lys spids */}
            <linearGradient id={idFyld} x1="0" y1="1" x2="1" y2="0">
              <stop
                offset="0%"
                stopColor={
                  farve === "seid" ? "var(--seid)" : "var(--ember-deep)"
                }
              />
              <stop
                offset="100%"
                stopColor={
                  farve === "seid" ? "var(--seid)" : "var(--ember-light)"
                }
              />
            </linearGradient>
          </defs>

          {/* Dæmpet baggrundsbue (hele sweepet) */}
          <path
            d={baggrundSti}
            fill="none"
            stroke={accent}
            strokeOpacity="0.14"
            strokeWidth={STROKE}
            strokeLinecap="round"
          />

          {/* Fyldt bue med glød */}
          {fyldSti ? (
            <path
              d={fyldSti}
              fill="none"
              stroke={`url(#${idFyld})`}
              strokeWidth={STROKE}
              strokeLinecap="round"
              filter={`url(#${idGlow})`}
            />
          ) : null}

          {/* Fin tik-markør ved 0%, 50% og 100% langs sweepet */}
          {[0, 0.5, 1].map((andel) => {
            const v = START + andel * SWEEP;
            const ind = {
              x: CENTER + (RADIUS - STROKE) * Math.cos((v * Math.PI) / 180),
              y: CENTER + (RADIUS - STROKE) * Math.sin((v * Math.PI) / 180),
            };
            const ud = {
              x: CENTER + (RADIUS + STROKE / 2) * Math.cos((v * Math.PI) / 180),
              y: CENTER + (RADIUS + STROKE / 2) * Math.sin((v * Math.PI) / 180),
            };
            return (
              <line
                key={andel}
                x1={ind.x}
                y1={ind.y}
                x2={ud.x}
                y2={ud.y}
                stroke={accent}
                strokeOpacity="0.25"
                strokeWidth="1.5"
              />
            );
          })}
        </svg>

        {/* Centreret aflæsning oven på buen */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            pointerEvents: "none",
          }}
        >
          <span
            className="hud-readout"
            style={{
              fontSize: "clamp(32px, 6vw, 48px)",
              color: harData ? "var(--ink)" : "var(--faint)",
              textShadow: harData
                ? `0 0 26px ${
                    farve === "seid"
                      ? "rgba(116, 227, 210, 0.3)"
                      : "rgba(242, 106, 27, 0.3)"
                  }`
                : "none",
            }}
          >
            {visTal}
            {harData ? (
              <span
                className="hud-unit"
                style={{ marginLeft: 4, verticalAlign: "middle" }}
              >
                %
              </span>
            ) : null}
          </span>

          {undertekst ? (
            <span
              className="hud-meta"
              style={{ color: "var(--faint)", textAlign: "center" }}
            >
              {undertekst}
            </span>
          ) : null}
        </div>
      </div>
    </section>
  );
}
