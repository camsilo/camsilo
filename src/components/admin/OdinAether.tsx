/**
 * OdinAether — den magiske baggrundsvæv bag hele Odin-kommandocenteret.
 *
 * Ren server-renderet SVG + CSS (ingen klient-runtime). Lægger et levende
 * "seiðr"-lag bag indholdet: to drivende energi-glød, tre koncentriske
 * futhark-rune-ringe der roterer langsomt i hver sin retning som et nordisk
 * astrolabium/JARVIS-arc, og en håndfuld opstigende rune-gnister. Alt er rent
 * dekorativt (aria-hidden) og slukkes ved prefers-reduced-motion via CSS.
 *
 * Hele laget er pointer-events:none og ligger bag .odin-wrap (z-index), så det
 * aldrig rører læsbarhed eller interaktion.
 */

// Elder Futhark (24 runer) — gentages langs ringene.
const FUTHARK = "ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛟᛞ";

// Deterministiske rune-gnister (ingen Math.random → stabil SSR/hydration).
const MOTES = Array.from({ length: 14 }, (_, i) => ({
  rune: FUTHARK[(i * 7) % FUTHARK.length],
  left: (i * 67) % 100,
  delay: (i % 7) * 2.3,
  dur: 13 + (i % 5) * 3.5,
  size: 11 + (i % 4) * 4,
  seid: i % 3 === 0,
}));

export function OdinAether() {
  return (
    <div className="odin-aether" aria-hidden="true">
      <div className="aether-glow aether-glow-a" />
      <div className="aether-glow aether-glow-b" />

      {/* Roterende rune-ringe — Alfaderens astrolabium */}
      <svg
        className="aether-rings"
        viewBox="0 0 600 600"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Cirkel-stier til rune-teksten (start i top, med uret) */}
          <path id="aether-path-outer" d="M300,52 a248,248 0 1,1 -0.1,0" />
          <path id="aether-path-inner" d="M300,140 a160,160 0 1,1 -0.1,0" />
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
            <textPath href="#aether-path-outer" startOffset="0">
              {FUTHARK + FUTHARK + FUTHARK}
            </textPath>
          </text>
        </g>

        {/* Inder-rune-ring — roterer mod uret, kold seiðr */}
        <g className="aether-spin aether-spin-ccw">
          <text className="aether-runes aether-runes-seid">
            <textPath href="#aether-path-inner" startOffset="0">
              {FUTHARK + FUTHARK}
            </textPath>
          </text>
        </g>
      </svg>

      {/* Opstigende rune-gnister */}
      <div className="aether-motes">
        {MOTES.map((m, i) => (
          <span
            key={i}
            className={`aether-mote${m.seid ? " aether-mote-seid" : ""}`}
            style={{
              left: `${m.left}%`,
              fontSize: `${m.size}px`,
              animationDelay: `${m.delay}s`,
              animationDuration: `${m.dur}s`,
            }}
          >
            {m.rune}
          </span>
        ))}
      </div>
    </div>
  );
}

export default OdinAether;
