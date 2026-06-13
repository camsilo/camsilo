/**
 * Camsilo-mærket: bogstavet "C" smedet som en to-strenget nordisk fletning.
 * To bånd — ét i glødende jern (ember), ét i egetræsbrun (oak) — væver skiftevis
 * over og under hinanden langs en åben C-bue, præcis som fletværket i en valknut
 * eller på en runesten. Hvert bånd har en mørk "casing" under sig, så over/under
 * læses rent som hugget metal; gradienter giver båndene dybde, og to nittehoveder
 * lukker C'ets ender.
 *
 * Båndene er teksturerede som udskåret træ/snoet reb: skrå, indhuggede riller på
 * tværs af hvert bånd (som de carvede vindskeder/gavlbånd på stavkirker, Urnes-
 * stil), og egetræs-strengen har desuden langsgående åre-linjer. Mønsteret følger
 * vævningen, så rillerne forsvinder korrekt dér hvor et bånd går under et andet.
 *
 * Geometrien beregnes parametrisk (rene tal, deterministisk — ingen tilfældighed),
 * så mærket gengives knivskarpt i enhver størrelse, fra 26px nav-mærke til 640px hero.
 */

const CX = 32; // centrum i 64×64-feltet
const R0 = 18.6; // buens grundradius
const AMP = 5.0; // snoningens dybde — hvor langt strengene svinger ud/ind
const TWISTS = 5; // antal halve snoninger → 4 indre kryds
const N = 150; // sample-tæthed
const A0 = 46; // C'ets åbning: bue fra 46° til 314° (gab mod højre)
const A1 = 314;
const WIN = 0.072; // halv bredde (i t) på de lapper der vender vævningen

const W = 5.3; // stregbredde på de farvede bånd
const CASE = W + 3.6; // mørk casing under hvert bånd → rene over/under-gab
const CARVE_N = 26; // antal indhuggede riller pr. fuldt bånd
const CARVE_LEN = W * 0.9; // rillens længde på tværs af båndet
const SLANT = 0.52; // rillernes skævhed (rad) → snoet-reb-udtryk

function pt(aDeg: number, r: number): [number, number] {
  const a = (aDeg * Math.PI) / 180;
  return [CX + r * Math.cos(a), CX + r * Math.sin(a)];
}

// sign = +1 → ydre streng (ember), sign = -1 → indre streng (oak). shift = radial forskydning (åre-linjer).
function band(t: number, sign: number, shift = 0): [number, number] {
  const aDeg = A0 + (A1 - A0) * t;
  const off = AMP * Math.sin(t * TWISTS * Math.PI);
  return pt(aDeg, R0 + sign * off + shift);
}

function path(sign: number, lo = 0, hi = 1, shift = 0): string {
  let d = "";
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    if (t < lo - 1e-9 || t > hi + 1e-9) continue;
    const [x, y] = band(t, sign, shift);
    d += `${d ? "L" : "M"}${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  return d;
}

// Skrå riller på tværs af et bånd over t-intervallet [lo,hi] → carvet/snoet tekstur
function carve(sign: number, lo: number, hi: number, count: number): string {
  let d = "";
  const dt = 0.6 / N;
  const h = CARVE_LEN / 2;
  for (let k = 0; k < count; k++) {
    const t = lo + (hi - lo) * ((k + 0.5) / count);
    const [x, y] = band(t, sign);
    const [ax, ay] = band(Math.max(0, t - dt), sign);
    const [bx, by] = band(Math.min(1, t + dt), sign);
    let tx = bx - ax;
    let ty = by - ay;
    const L = Math.hypot(tx, ty) || 1;
    tx /= L;
    ty /= L;
    const px = -ty; // tangentens normal = på tværs af båndet
    const py = tx;
    const c = Math.cos(SLANT);
    const s = Math.sin(SLANT);
    const dx = px * c + tx * s; // skævvredet → snoning
    const dy = py * c + ty * s;
    d += `M${(x - dx * h).toFixed(2)} ${(y - dy * h).toFixed(2)}L${(x + dx * h).toFixed(2)} ${(y + dy * h).toFixed(2)}`;
  }
  return d;
}

const OAK = path(-1);
const EMBER = path(1);
const OAK_GRAIN_HI = path(-1, 0, 1, 1.25); // langsgående åre-linjer i egetræet
const OAK_GRAIN_LO = path(-1, 0, 1, -1.25);
const OAK_CARVE = carve(-1, 0, 1, CARVE_N);
const EMBER_CARVE = carve(1, 0, 1, CARVE_N);
// Vævningen vendes ved hvert andet kryds (t = 1/5, 3/5): her lægges oak tilbage ovenpå
const FLIP_CS = [1, 3].map((k) => k / TWISTS);
const FLIPS = FLIP_CS.map((c) => path(-1, c - WIN, c + WIN));
const FLIP_CARVES = FLIP_CS.map((c) => carve(-1, c - WIN, c + WIN, 5));
const E0 = band(0, 1); // begge strenge mødes her (off = 0)
const E1 = band(1, 1);

type Props = {
  size?: number;
  uid?: string; // unik nøgle til gradient-/filter-id'er når flere mærker er på siden
  glow?: boolean; // hero-variant: blød glød + smedet højlys-ribbe
  bg?: string; // casing-farve (gabet mellem båndene) — matcher fladen bagved
  className?: string;
};

export function LogoMark({
  size = 34,
  uid = "a",
  glow = false,
  bg = "var(--bg)",
  className = "",
}: Props) {
  const idE = `cam-ember-${uid}`;
  const idO = `cam-oak-${uid}`;
  const idR = `cam-rivet-${uid}`;
  const idG = `cam-glow-${uid}`;

  const s = {
    fill: "none" as const,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  const carveOak = { ...s, stroke: "#33210f", strokeWidth: 1.0, strokeOpacity: 0.55 };
  const carveEmber = {
    ...s,
    stroke: "rgba(255,228,194,0.4)",
    strokeWidth: 0.9,
    strokeOpacity: 1,
  };
  const grain = { ...s, stroke: "#3a2614", strokeWidth: 0.75, strokeOpacity: 0.45 };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className={`logo-mark${glow ? " logo-mark-glow" : ""} ${className}`.trim()}
    >
      <defs>
        <linearGradient id={idE} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--ember-deep)" />
          <stop offset="48%" stopColor="var(--ember)" />
          <stop offset="100%" stopColor="#ffc070" />
        </linearGradient>
        <linearGradient id={idO} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5c3d20" />
          <stop offset="50%" stopColor="var(--oak)" />
          <stop offset="100%" stopColor="#e3a866" />
        </linearGradient>
        <radialGradient id={idR} cx="38%" cy="34%" r="72%">
          <stop offset="0%" stopColor="#ffe6c4" />
          <stop offset="42%" stopColor="var(--ember-light)" />
          <stop offset="100%" stopColor="var(--ember-deep)" />
        </radialGradient>
        {glow && (
          <filter id={idG} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2.1" />
          </filter>
        )}
      </defs>

      {/* blød underglød (kun hero) */}
      {glow && (
        <g filter={`url(#${idG})`} opacity="0.55">
          <path d={EMBER} stroke="var(--ember)" strokeWidth={W + 1} {...s} />
          <path d={OAK} stroke="var(--oak)" strokeWidth={W + 1} {...s} />
        </g>
      )}

      {/* oak (indre) — casing + farve + åre + carvede riller */}
      <path d={OAK} stroke={bg} strokeWidth={CASE} {...s} />
      <path d={OAK} stroke={`url(#${idO})`} strokeWidth={W} {...s} className="logo-strand" />
      <path d={OAK_GRAIN_HI} {...grain} />
      <path d={OAK_GRAIN_LO} {...grain} />
      <path d={OAK_CARVE} {...carveOak} />

      {/* ember (ydre) — casing skærer oak ved alle kryds, derefter farve + riller */}
      <path d={EMBER} stroke={bg} strokeWidth={CASE} {...s} />
      <path d={EMBER} stroke={`url(#${idE})`} strokeWidth={W} {...s} className="logo-strand" />
      {glow && (
        <path d={EMBER} stroke="rgba(255,236,208,0.45)" strokeWidth={W * 0.26} {...s} />
      )}
      <path d={EMBER_CARVE} {...carveEmber} />

      {/* lapper: oak vendes tilbage ovenpå ved hvert andet kryds → korrekt vekslende væv */}
      {FLIPS.map((d, i) => (
        <g key={i}>
          <path d={d} stroke={bg} strokeWidth={CASE} {...s} />
          <path d={d} stroke={`url(#${idO})`} strokeWidth={W} {...s} className="logo-strand" />
          <path d={FLIP_CARVES[i]} {...carveOak} />
        </g>
      ))}

      {/* nittehoveder i C'ets to ender */}
      {[E0, E1].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={4.0} fill={bg} />
          <circle cx={x} cy={y} r={3.5} fill={`url(#${idR})`} />
          <circle cx={x - 0.9} cy={y - 1.0} r={1.05} fill="rgba(255,244,228,0.9)" />
        </g>
      ))}
    </svg>
  );
}

export function LogoLockup({ size = 30, uid = "lock" }: { size?: number; uid?: string }) {
  return (
    <span className="logo-lockup">
      <LogoMark size={size} uid={uid} />
      <span className="logo-word">CAMSILO</span>
    </span>
  );
}
