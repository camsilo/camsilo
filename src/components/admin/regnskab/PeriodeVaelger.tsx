"use client";

/**
 * Fælles periodevælger — fra de seneste timer til hele virksomhedens levetid.
 *
 * Bruges samme sted i alle faner, så et skift af periode betyder det samme
 * overalt. Under knapperne står altid det faktiske datointerval, så et tal
 * aldrig står uden at man kan se, hvad det dækker.
 */
import {
  PERIODEVALG,
  beskrivInterval,
  type Interval,
  type PeriodeValgId,
} from "@/lib/regnskab/perioder";

export function PeriodeVaelger({
  valgt,
  onVaelg,
  interval,
}: {
  valgt: PeriodeValgId;
  onVaelg: (id: PeriodeValgId) => void;
  interval: Interval;
}) {
  return (
    <div className="regnskab-periodevaelger">
      <div className="regnskab-bogvalg" role="group" aria-label="Periode">
        {PERIODEVALG.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`regnskab-kategori${valgt === p.id ? " valgt" : ""}`}
            aria-pressed={valgt === p.id}
            onClick={() => onVaelg(p.id)}
          >
            {p.navn}
          </button>
        ))}
      </div>
      <p className="regnskab-periode-spand">
        {beskrivInterval(interval)}
        {interval.forklaring && (
          <span className="regnskab-periode-note">{interval.forklaring}</span>
        )}
      </p>
    </div>
  );
}
