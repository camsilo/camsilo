/**
 * AetherRings — det ambiente "aether"-baggrundslag fra Odin-kommandocenteret,
 * genbrugt på forsiden i forsidens varme smedje-farver.
 *
 * Rent SVG + CSS (ingen klient-runtime). Et fast lag der følger skærmen ved
 * scroll og ligger bag alt indhold:
 *   • tre koncentriske bærende ringe + to futhark-rune-ringe der roterer
 *     langsomt i hver sin retning (samme astrolabium som admins OdinAether),
 *   • opstigende rune-gnister der svæver op gennem fladen,
 *   • en tynd løbende scanline som admins HUD.
 *
 * Til forskel fra admin er der INGEN mørke panel-kasser og INGEN kold seiðr-tone
 * på gnisterne — alt holdes i forsidens varme ember-palet. Rent dekorativt
 * (aria-hidden) og slukkes ved prefers-reduced-motion via CSS.
 */

// Elder Futhark (24 runer) — gentages langs ringene og bruges til gnisterne.
const FUTHARK = "ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛟᛞ";

// Deterministiske, opstigende rune-gnister (ingen Math.random → stabil SSR).
const MOTES = Array.from({ length: 16 }, (_, i) => ({
  rune: FUTHARK[(i * 7) % FUTHARK.length],
  left: (i * 61) % 100,
  delay: (i % 8) * 2.1,
  dur: 14 + (i % 6) * 3,
  size: 11 + (i % 4) * 4,
}));

export function AetherRings() {
  return (
    <div className="hero-aether" aria-hidden="true">
      {/* Roterende rune-ringe — centreret i skærmen */}
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

        {/* Inder-rune-ring — roterer mod uret */}
        <g className="aether-spin aether-spin-ccw">
          <text className="aether-runes aether-runes-seid">
            <textPath href="#hero-path-inner" startOffset="0">
              {FUTHARK + FUTHARK}
            </textPath>
          </text>
        </g>
      </svg>

      {/* Opstigende rune-gnister — varme (forsidefarver) */}
      <div className="aether-motes">
        {MOTES.map((m, i) => (
          <span
            key={i}
            className="aether-mote"
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

      {/* Tynd løbende scanline — samme HUD-fornemmelse som admin */}
      <div className="aether-scan" />
    </div>
  );
}

export default AetherRings;
