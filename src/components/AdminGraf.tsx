import type { Punkt } from "@/lib/analytics/aggregate";

/**
 * Områdegraf over tidsserien — to serier (sidevisninger = blå, unikke = is),
 * glattet med kvadratiske bezier-midtpunkter. Ren server-renderet SVG.
 */
export function AdminGraf({ serie }: { serie: Punkt[] }) {
  const B = 1000;
  const H = 320;
  const PAD_V = 46;
  const PAD_H = 16;
  const PAD_T = 14;
  const PAD_B = 34;

  const indreB = B - PAD_V - PAD_H;
  const indreH = H - PAD_T - PAD_B;

  const maksRaa = Math.max(1, ...serie.map((p) => Math.max(p.visninger, p.unikke)));
  // "pænt" loft: 4, 8, 12 … så gitterlinjerne lander på heltal
  const maks = Math.max(4, Math.ceil(maksRaa / 4) * 4);

  const x = (i: number) =>
    PAD_V + (serie.length <= 1 ? indreB / 2 : (i / (serie.length - 1)) * indreB);
  const y = (v: number) => PAD_T + indreH - (v / maks) * indreH;

  function glatSti(vaerdier: number[]): string {
    if (vaerdier.length === 0) return "";
    const pkt = vaerdier.map((v, i) => ({ x: x(i), y: y(v) }));
    if (pkt.length === 1) return `M ${pkt[0].x} ${pkt[0].y}`;
    let d = `M ${pkt[0].x} ${pkt[0].y}`;
    for (let i = 1; i < pkt.length - 1; i++) {
      const mx = (pkt[i].x + pkt[i + 1].x) / 2;
      const my = (pkt[i].y + pkt[i + 1].y) / 2;
      d += ` Q ${pkt[i].x} ${pkt[i].y} ${mx} ${my}`;
    }
    const sidste = pkt[pkt.length - 1];
    d += ` L ${sidste.x} ${sidste.y}`;
    return d;
  }

  function omraade(vaerdier: number[]): string {
    const linje = glatSti(vaerdier);
    if (!linje) return "";
    const bund = PAD_T + indreH;
    return `${linje} L ${x(vaerdier.length - 1)} ${bund} L ${x(0)} ${bund} Z`;
  }

  const gitter = [0, 0.25, 0.5, 0.75, 1].map((andel) => ({
    y: PAD_T + indreH - andel * indreH,
    vaerdi: Math.round(andel * maks),
  }));

  // Maks ~6 x-labels så de ikke klumper
  const labelHver = Math.max(1, Math.ceil(serie.length / 6));

  return (
    <svg
      viewBox={`0 0 ${B} ${H}`}
      role="img"
      aria-label="Graf over sidevisninger og unikke besøgende"
      style={{ width: "100%", height: "auto", display: "block" }}
    >
      <defs>
        <linearGradient id="fyldVisninger" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c98a4a" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#c98a4a" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="fyldUnikke" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f26a1b" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#f26a1b" stopOpacity="0" />
        </linearGradient>
      </defs>

      {gitter.map((g) => (
        <g key={g.y}>
          <line
            x1={PAD_V}
            x2={B - PAD_H}
            y1={g.y}
            y2={g.y}
            stroke="rgba(224,172,120,0.12)"
            strokeWidth="1"
          />
          <text
            x={PAD_V - 8}
            y={g.y + 4}
            textAnchor="end"
            fontSize="12"
            fill="#9b8c7c"
            fontFamily="var(--font-mono), monospace"
          >
            {g.vaerdi}
          </text>
        </g>
      ))}

      <path d={omraade(serie.map((p) => p.visninger))} fill="url(#fyldVisninger)" />
      <path d={omraade(serie.map((p) => p.unikke))} fill="url(#fyldUnikke)" />
      <path
        d={glatSti(serie.map((p) => p.visninger))}
        fill="none"
        stroke="#c98a4a"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d={glatSti(serie.map((p) => p.unikke))}
        fill="none"
        stroke="#f26a1b"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {serie.map((p, i) =>
        i % labelHver === 0 ? (
          <text
            key={i}
            x={x(i)}
            y={H - 10}
            textAnchor="middle"
            fontSize="12"
            fill="#9b8c7c"
            fontFamily="var(--font-mono), monospace"
          >
            {p.label}
          </text>
        ) : null,
      )}
    </svg>
  );
}
