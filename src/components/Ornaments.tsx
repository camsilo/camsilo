/**
 * Nordiske ornamenter — i samme ånd som logomærket: KUN rette linjer.
 * Runer og fletværk blev ristet i sten og træ, ikke tegnet med passer.
 */

/**
 * Kantet fletværks-bånd (knotwork). To zigzag-strenge væver over og under
 * hinanden: streng A tegnes oven på B overalt, hvorefter små lapper lægger
 * B tilbage ovenpå ved hvert andet kryds — så vævningen veksler korrekt.
 * Mønsteret er en 48-bred flise, så det fliser sømløst i fuld bredde.
 */
export function KnotBand() {
  const w = 2.6;
  return (
    <div className="knot-divider" aria-hidden="true">
      <svg className="knot-svg" width="100%" height="24" role="presentation">
        <defs>
          <pattern id="camsilo-plait" width="48" height="24" patternUnits="userSpaceOnUse">
            {/* streng B (under) — fuld */}
            <path d="M0 20 L12 4 L24 20 L36 4 L48 20" fill="none" stroke="currentColor" strokeWidth={w} strokeLinecap="square" />
            {/* streng A (over) — fuld */}
            <path d="M0 4 L12 20 L24 4 L36 20 L48 4" fill="none" stroke="currentColor" strokeWidth={w} strokeLinecap="square" />
            {/* lapper: B lægges oven på A ved kryds x=18 og x=42 → vekslende væv */}
            <path d="M14.5 7.3 L21.5 16.7" fill="none" stroke="currentColor" strokeWidth={w} strokeLinecap="square" />
            <path d="M38.5 7.3 L45.5 16.7" fill="none" stroke="currentColor" strokeWidth={w} strokeLinecap="square" />
          </pattern>
        </defs>
        <rect width="100%" height="24" fill="url(#camsilo-plait)" />
      </svg>
    </div>
  );
}

/**
 * Valknut — Odins tegn: tre sammenflettede trekanter (borromæisk). Tre
 * ligesidede trekanter med spids opad, hvis centre selv danner en lille
 * trekant, så de griber ind i hinanden. Rene rette linjer.
 */
function trekant(cx: number, cy: number, R: number): string {
  const p = (a: number) => {
    const rad = (a * Math.PI) / 180;
    return `${(cx + R * Math.cos(rad)).toFixed(2)} ${(cy + R * Math.sin(rad)).toFixed(2)}`;
  };
  // spidser ved -90° (top), 30° (ned-højre), 150° (ned-venstre)
  return `${p(-90)} ${p(30)} ${p(150)}`;
}

export function Valknut({ size = 220 }: { size?: number }) {
  const R = 32;
  const d = 14; // hvor langt hvert trekant-center sidder fra figurens midte
  const c = (a: number): [number, number] => {
    const rad = (a * Math.PI) / 180;
    return [50 + d * Math.cos(rad), 50 + d * Math.sin(rad)];
  };
  const centres: [number, number][] = [c(-90), c(30), c(150)];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
      className="valknut"
    >
      {centres.map(([cx, cy], i) => (
        <polygon
          key={i}
          points={trekant(cx, cy, R)}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="miter"
        />
      ))}
    </svg>
  );
}
