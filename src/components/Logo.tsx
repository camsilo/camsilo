/**
 * Camsilo-mærket: bogstavet "C" flettet som en nordisk to-strenget snoning.
 * To strenge — én i glødende jern-orange, én i egetræsbrun — væver over og
 * under hinanden langs en åben C-bue, præcis som fletværket i en valknut eller
 * på en runesten. Enderne lukkes af to nittehoveder i orange. Smedet håndværk
 * og kode i ét tegn.
 */

const C = 32; // centrum i 64×64-feltet
const R0 = 19; // buens grundradius
const A = 4.2; // hvor langt strengene svinger ud/ind = snoningens dybde
const NTW = 4; // antal halve snoninger → 3 indre kryds
const N = 96; // sample-tæthed
const A_START = 42; // C'ets åbning: bue fra 42° til 318° (gab mod højre)
const A_END = 318;

function punkt(aDeg: number, r: number): [number, number] {
  const a = (aDeg * Math.PI) / 180;
  return [C + r * Math.cos(a), C + r * Math.sin(a)];
}

function sample(t: number) {
  const aDeg = A_START + (A_END - A_START) * t;
  const off = A * Math.sin(t * NTW * Math.PI);
  return { ydre: punkt(aDeg, R0 + off), indre: punkt(aDeg, R0 - off) };
}

function bane(vælg: (s: ReturnType<typeof sample>) => [number, number], lo = 0, hi = 1): string {
  const stykker: string[] = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    if (t < lo || t > hi) continue;
    const [x, y] = vælg(sample(t));
    stykker.push(`${stykker.length ? "L" : "M"}${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  return stykker.join(" ");
}

export function LogoMark({ size = 34 }: { size?: number }) {
  const w = 4.6;
  const under = bane((s) => s.indre);
  const over = bane((s) => s.ydre);
  // Lapper: blæk-strengen lægges oven på is-strengen ved hvert andet kryds (t≈¼, ¾)
  const lap1 = bane((s) => s.indre, 0.25 - 0.07, 0.25 + 0.07);
  const lap2 = bane((s) => s.indre, 0.75 - 0.07, 0.75 + 0.07);
  const [e0, e1] = [sample(0).indre, sample(1).indre];

  const fælles = {
    fill: "none" as const,
    strokeWidth: w,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className="logo-mark"
    >
      {/* blæk-streng (under) */}
      <path d={under} stroke="var(--oak)" {...fælles} className="logo-strand-ink" />
      {/* is-streng (over) */}
      <path d={over} stroke="var(--ember)" {...fælles} className="logo-strand-ice" />
      {/* blæk-strengen vævet tilbage ovenpå ved skiftende kryds */}
      <path d={lap1} stroke="var(--oak)" {...fælles} className="logo-strand-ink" />
      <path d={lap2} stroke="var(--oak)" {...fælles} className="logo-strand-ink" />
      {/* nittehoveder i C'ets to ender */}
      <circle cx={e0[0]} cy={e0[1]} r={3.2} fill="var(--ember)" />
      <circle cx={e1[0]} cy={e1[1]} r={3.2} fill="var(--ember)" />
    </svg>
  );
}

export function LogoLockup({ size = 30 }: { size?: number }) {
  return (
    <span className="logo-lockup">
      <LogoMark size={size} />
      <span className="logo-word">CAMSILO</span>
    </span>
  );
}
