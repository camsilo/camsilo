/**
 * OdinKpi — genbrugeligt KPI-kort til Odin-kommandocenteret.
 *
 * Server-komponent. Viser ét nøgletal som et glødende HUD-panel med rune-label,
 * stort readout, valgfri enhed og en delta-chip mod forrige periode.
 *
 * Delta-fortolkning: en STIGNING er som standard "godt" (grøn). For metrikker
 * hvor en stigning er dårlig (fx afvisningsrate) sættes `opAdvarer` — så vendes
 * farverne, men selve pilen (↑/↓) følger altid den faktiske retning.
 */

export type OdinKpiProps = {
  /** Elder-Futhark-rune som accent i labelen (fx "ᚠ"). */
  rune: string;
  /** Mono-caps-etiket, fx "VISNINGER". */
  label: string;
  /** Forformateret hovedtal som streng (dansk formatering). */
  value: string;
  /** Valgfri enhed under tallet, fx "SEK" eller "%". */
  unit?: string;
  /** Procentvis ændring mod forrige periode; null = ingen sammenligning. */
  delta?: number | null;
  /** Sæt sandt når en stigning er en advarsel (fx afvisningsrate). */
  opAdvarer?: boolean;
};

/** Dansk procent med én decimal og komma, uden fortegn (fortegnet vises som pil). */
function formatDelta(absVaerdi: number): string {
  return absVaerdi.toLocaleString("da-DK", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

export function OdinKpi({
  rune,
  label,
  value,
  unit,
  delta = null,
  opAdvarer = false,
}: OdinKpiProps) {
  // Vælg delta-chippens klasse + symbol ud fra retning og om en stigning advarer.
  let deltaKlasse = "hud-delta hud-delta-nul";
  let deltaTekst = "·";

  if (delta !== null && delta !== 0) {
    const stiger = delta > 0;
    const erGodt = opAdvarer ? !stiger : stiger;
    deltaKlasse = `hud-delta ${erGodt ? "hud-delta-op" : "hud-delta-ned"}`;
    deltaTekst = `${stiger ? "↑" : "↓"} ${formatDelta(Math.abs(delta))}%`;
  }

  return (
    <div
      className="hud-panel"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 14,
        transition: "transform 0.18s ease, box-shadow 0.18s ease",
      }}
    >
      <div className="hud-head" style={{ marginBottom: 0 }}>
        <span className="hud-label">
          <span className="hud-rune" aria-hidden="true">
            {rune}
          </span>
          {label}
        </span>
        <span className={deltaKlasse}>{deltaTekst}</span>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <span className="hud-readout hud-readout-xl">{value}</span>
        {unit ? <span className="hud-unit">{unit}</span> : null}
      </div>
    </div>
  );
}
