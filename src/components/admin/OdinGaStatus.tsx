/**
 * OdinGaStatus — "Klar til Google Analytics"-statuspanel til Odin-kommandocenteret.
 *
 * Server-komponent. Viser Odins to målings-kanaler som glødende status-rækker:
 * den cookieløse førstepartsmåling (altid vågen) og GA4-integrationen, der
 * lyser op når den er tilsluttet. Et lille seid-farvet rune-segl signalerer
 * at HUD'en holder vagt. Ingen hooks, ingen klient-runtime.
 */

export type OdinGaStatusProps = {
  /** Sandt når NEXT_PUBLIC_GA_ID (G-…) er sat og GA4 dermed er koblet på. */
  gaKonfigureret: boolean;
};

/** Tre tilstande en målings-kanal kan stå i; styrer prikkens farve + glød. */
type Tilstand = "aktiv" | "afventer";

/** Én status-række: navn, undertekst, tilstand og status-ord. */
type Kanal = {
  rune: string;
  navn: string;
  under: string;
  tilstand: Tilstand;
  status: string;
};

/** Farve pr. tilstand — grøn = aktiv, ember/amber = afventer tilkobling. */
const FARVE: Record<Tilstand, string> = {
  aktiv: "var(--seid)",
  afventer: "var(--ember)",
};

export function OdinGaStatus({ gaKonfigureret }: OdinGaStatusProps) {
  const kanaler: Kanal[] = [
    {
      rune: "ᚺ",
      navn: "Førstepartsmåling (cookieløs)",
      under: "Odins eget øje — måler uden samtykke-mur eller tredjeparts-spor.",
      tilstand: "aktiv",
      status: "Aktiv",
    },
    {
      rune: "ᚷ",
      navn: "Google Analytics 4",
      under: gaKonfigureret
        ? "Ravnene flyver til GA4 — hændelser sendes til din property."
        : "Hvilende — ingen GA4-property koblet til endnu.",
      tilstand: gaKonfigureret ? "aktiv" : "afventer",
      status: gaKonfigureret ? "Tilsluttet" : "Ikke tilsluttet",
    },
  ];

  return (
    <section className="hud-panel">
      <div className="hud-head">
        <span className="hud-label">
          <span className="hud-rune" aria-hidden="true">
            ᚷ
          </span>
          MÅLING / INTEGRATION
        </span>
        <span className="hud-meta">2 KANALER</span>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
          marginTop: 4,
        }}
      >
        {kanaler.map((kanal, i) => {
          const farve = FARVE[kanal.tilstand];
          const erAktiv = kanal.tilstand === "aktiv";

          return (
            <div key={kanal.navn}>
              {i > 0 ? <div className="hud-divider" /> : null}

              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 14,
                  paddingTop: i > 0 ? 14 : 0,
                }}
              >
                {/* Indikator-segl: rune-rammet prik der gløder i kanalens farve. */}
                <span
                  aria-hidden="true"
                  style={{
                    position: "relative",
                    flexShrink: 0,
                    width: 34,
                    height: 34,
                    marginTop: 2,
                    display: "grid",
                    placeItems: "center",
                    fontFamily: "var(--font-mono)",
                    fontSize: 16,
                    lineHeight: 1,
                    color: farve,
                    borderRadius: "50%",
                    border: `1px solid color-mix(in srgb, ${farve} 55%, transparent)`,
                    background: `radial-gradient(circle at 50% 45%, color-mix(in srgb, ${farve} 22%, transparent), transparent 70%)`,
                    boxShadow: erAktiv
                      ? `0 0 12px color-mix(in srgb, ${farve} 45%, transparent)`
                      : "none",
                  }}
                >
                  {kanal.rune}
                  {/* Lille status-prik i seglets nederste hjørne. */}
                  <span
                    style={{
                      position: "absolute",
                      right: -1,
                      bottom: -1,
                      width: 9,
                      height: 9,
                      borderRadius: "50%",
                      background: farve,
                      border: "2px solid var(--bg)",
                      boxShadow: erAktiv
                        ? `0 0 7px ${farve}`
                        : `0 0 3px color-mix(in srgb, ${farve} 50%, transparent)`,
                    }}
                  />
                </span>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      justifyContent: "space-between",
                      gap: 12,
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 15,
                        letterSpacing: "0.01em",
                        color: "var(--ink)",
                      }}
                    >
                      {kanal.navn}
                    </span>

                    {/* Status-ord som mono-caps chip med kanalens farve. */}
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        whiteSpace: "nowrap",
                        color: farve,
                        padding: "3px 9px",
                        borderRadius: 4,
                        border: `1px solid color-mix(in srgb, ${farve} 40%, transparent)`,
                        background: `color-mix(in srgb, ${farve} 12%, transparent)`,
                      }}
                    >
                      {kanal.status}
                    </span>
                  </div>

                  <p
                    style={{
                      margin: "5px 0 0",
                      fontSize: 12.5,
                      lineHeight: 1.5,
                      color: "var(--faint)",
                    }}
                  >
                    {kanal.under}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hjælpelinje når GA4 mangler: hvordan ravnene slippes løs. */}
      {!gaKonfigureret ? (
        <>
          <div className="hud-divider" />
          <p
            className="hud-meta"
            style={{
              margin: 0,
              lineHeight: 1.6,
              color: "var(--dim)",
            }}
          >
            <span style={{ color: "var(--ember-light)" }} aria-hidden="true">
              ᚱ{" "}
            </span>
            Sæt env{" "}
            <code
              style={{
                fontFamily: "var(--font-mono)",
                color: "var(--ink)",
                background: "color-mix(in srgb, var(--ember) 14%, transparent)",
                border: "1px solid color-mix(in srgb, var(--ember) 30%, transparent)",
                borderRadius: 3,
                padding: "1px 5px",
              }}
            >
              NEXT_PUBLIC_GA_ID
            </code>{" "}
            (G-…) på HostStack for at aktivere GA4.
          </p>
        </>
      ) : null}
    </section>
  );
}
