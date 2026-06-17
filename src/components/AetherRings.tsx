/**
 * AetherRings — de roterende futhark-rune-ringe fra Odin-kommandocenteret,
 * genbrugt som ambient baggrund bag forsidens hero.
 *
 * Rent SVG + CSS (ingen klient-runtime). Tre koncentriske bærende ringe + to
 * rune-ringe der roterer langsomt i hver sin retning som et nordisk astrolabium
 * — nøjagtig samme visuelle sprog som admins `OdinAether`, men centreret bag
 * hero'en frem for pinnet til toppen. Rent dekorativt (aria-hidden) og slukkes
 * ved prefers-reduced-motion via CSS (.aether-spin).
 *
 * Deler stil-klasserne (.aether-circle / .aether-spin / .aether-runes) med
 * OdinAether, så de to steder altid ser ens ud.
 */

// Elder Futhark (24 runer) — gentages langs ringene.
const FUTHARK = "ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛟᛞ";

export function AetherRings() {
  return (
    <div className="hero-rings" aria-hidden="true">
      <svg
        className="hero-rings-svg"
        viewBox="0 0 600 600"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Cirkel-stier til rune-teksten (start i top, med uret) */}
          <path id="hero-path-outer" d="M300,52 a248,248 0 1,1 -0.1,0" />
          <path id="hero-path-inner" d="M300,140 a160,160 0 1,1 -0.1,0" />
        </defs>

        {/* Stille bærende ringe */}
        <circle className="aether-circle aether-circle-ember" cx="300" cy="300" r="266" />
        <circle className="aether-circle aether-circle-seid" cx="300" cy="300" r="208" />
        <circle
          className="aether-circle aether-circle-ember"
          cx="300"
          cy="300"
          r="120"
          strokeDasharray="2 7"
        />

        {/* Yder-rune-ring — roterer med uret */}
        <g className="aether-spin aether-spin-cw">
          <text className="aether-runes aether-runes-ember">
            <textPath href="#hero-path-outer" startOffset="0">
              {FUTHARK + FUTHARK + FUTHARK}
            </textPath>
          </text>
        </g>

        {/* Inder-rune-ring — roterer mod uret, kold seiðr */}
        <g className="aether-spin aether-spin-ccw">
          <text className="aether-runes aether-runes-seid">
            <textPath href="#hero-path-inner" startOffset="0">
              {FUTHARK + FUTHARK}
            </textPath>
          </text>
        </g>
      </svg>
    </div>
  );
}

export default AetherRings;
