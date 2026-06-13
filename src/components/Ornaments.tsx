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
  const w = 3.4;
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
 * Valknut — Odins tegn: tre sammenflettede trekanter i borromæisk form (ingen to
 * er direkte låst — fjern én, og de andre falder fra hinanden). Geometrien er
 * overført 1:1 fra Wikimedia Commons' "Valknut-Symbol-borromean.svg" og
 * normaliseret til et 100×100-felt: tre kongruente, opadvendte ligesidede
 * trekanter hvis centre sidder i en triade 120° fra hinanden.
 *
 * Vævningen er ægte over/under. Trekanterne tegnes a→b→c (c øverst overalt),
 * hvorefter to lapper — A's venstre kant og et stykke af B's højre kant — lægges
 * tilbage ovenpå, præcis som original-SVG'en, så krydsene veksler korrekt. I én
 * farve vises over/under via mørke "casings", der skærer et rent gab ved hvert
 * kryds, ligesom i logomærket.
 */
const TRI_A: [number, number][] = [
  [29.0, 77.29],
  [92.01, 77.29],
  [60.5, 22.71],
];
const TRI_B: [number, number][] = [
  [7.99, 89.41],
  [71.0, 89.41],
  [39.5, 34.84],
];
const TRI_C: [number, number][] = [
  [7.99, 65.16],
  [71.0, 65.16],
  [39.5, 10.59],
];
const PATCH_A: [number, number][] = [
  [60.5, 22.71],
  [29.0, 77.29],
]; // A's venstre kant (spids → nederste venstre hjørne)
const PATCH_B: [number, number][] = [
  [39.5, 34.84],
  [51.05, 54.85],
]; // stykke af B's højre kant fra spidsen

const triPath = (p: [number, number][]) =>
  `M${p[0][0]} ${p[0][1]}L${p[1][0]} ${p[1][1]}L${p[2][0]} ${p[2][1]}Z`;
const segPath = (p: [number, number][]) =>
  `M${p[0][0]} ${p[0][1]}L${p[1][0]} ${p[1][1]}`;

export function Valknut({
  size = 220,
  bg = "var(--bg)",
}: {
  size?: number;
  bg?: string;
}) {
  const W = 6; // båndbredde
  const CASE = 9.6; // mørk casing → rent over/under-gab
  const tris = [TRI_A, TRI_B, TRI_C];
  const patches = [PATCH_A, PATCH_B];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
      className="valknut"
    >
      <g strokeLinejoin="miter" strokeMiterlimit={8}>
        {tris.map((p, i) => (
          <g key={i}>
            <path d={triPath(p)} stroke={bg} strokeWidth={CASE} />
            <path d={triPath(p)} stroke="currentColor" strokeWidth={W} />
          </g>
        ))}
        {patches.map((p, i) => (
          <g key={i}>
            <path d={segPath(p)} stroke={bg} strokeWidth={CASE} strokeLinecap="butt" />
            <path d={segPath(p)} stroke="currentColor" strokeWidth={W} strokeLinecap="butt" />
          </g>
        ))}
      </g>
    </svg>
  );
}
