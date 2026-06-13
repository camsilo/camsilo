import type { Punkt } from "@/lib/analytics/aggregate";

/**
 * Odin — opgraderet trafik-graf til kommandocenteret.
 *
 * To serier glattet med kvadratiske bezier-midtpunkter:
 *   • visninger → ember-glød (var(--ember))
 *   • unikke    → kold seid-rune (var(--seid))
 *
 * Hver streg får en blød underglød (feGaussianBlur), et faldende gradient-fyld
 * og en lille glødende slut-prik. Fine gitterlinjer med mono y-labels og ~6
 * x-labels fra punkternes label. Ren server-renderet SVG — siden lægger selv
 * graffen i et .hud-panel og tegner legenden. Returnerer KUN <svg>.
 */
export type OdinTrafikGrafProps = { serie: Punkt[] };

export function OdinTrafikGraf({ serie }: OdinTrafikGrafProps) {
  const B = 1000;
  const H = 320;
  const PAD_V = 50; // venstre (plads til y-labels)
  const PAD_H = 22; // højre (plads til slut-prik + glød)
  const PAD_T = 18;
  const PAD_B = 36;

  const indreB = B - PAD_V - PAD_H;
  const indreH = H - PAD_T - PAD_B;
  const bund = PAD_T + indreH;

  const visninger = serie.map((p) => p.visninger);
  const unikke = serie.map((p) => p.unikke);

  const maksRaa = Math.max(1, ...visninger, ...unikke);
  // "pænt" loft i trin af 4 så gitterlinjerne lander på heltal
  const maks = Math.max(4, Math.ceil(maksRaa / 4) * 4);

  const x = (i: number): number =>
    PAD_V + (serie.length <= 1 ? indreB / 2 : (i / (serie.length - 1)) * indreB);
  const y = (v: number): number => PAD_T + indreH - (v / maks) * indreH;

  // Glattet linjesti via kvadratiske beziers gennem nabo-midtpunkter.
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
    return `${linje} L ${x(vaerdier.length - 1)} ${bund} L ${x(0)} ${bund} Z`;
  }

  const gitter = [0, 0.25, 0.5, 0.75, 1].map((andel) => ({
    y: PAD_T + indreH - andel * indreH,
    vaerdi: Math.round(andel * maks),
  }));

  // Maks ~6 x-labels så de ikke klumper sammen.
  const labelHver = Math.max(1, Math.ceil(serie.length / 6));

  // Slut-koordinater til de glødende prikker (kun når der findes punkter).
  const sidstIdx = serie.length - 1;
  const harData = serie.length > 0;
  const slutVisninger = harData
    ? { x: x(sidstIdx), y: y(visninger[sidstIdx]) }
    : null;
  const slutUnikke = harData
    ? { x: x(sidstIdx), y: y(unikke[sidstIdx]) }
    : null;

  const stiVisninger = glatSti(visninger);
  const stiUnikke = glatSti(unikke);

  return (
    <svg
      viewBox={`0 0 ${B} ${H}`}
      role="img"
      aria-label="Trafik-graf over sidevisninger og unikke besøgende"
      style={{ width: "100%", height: "auto", display: "block" }}
    >
      <defs>
        {/* Faldende fyld under hver serie */}
        <linearGradient id="odinFyldVisninger" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--ember)" stopOpacity="0.28" />
          <stop offset="55%" stopColor="var(--ember)" stopOpacity="0.08" />
          <stop offset="100%" stopColor="var(--ember)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="odinFyldUnikke" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--seid)" stopOpacity="0.22" />
          <stop offset="55%" stopColor="var(--seid)" stopOpacity="0.06" />
          <stop offset="100%" stopColor="var(--seid)" stopOpacity="0" />
        </linearGradient>

        {/* Blød underglød til stregerne */}
        <filter id="odinGlow" x="-20%" y="-40%" width="140%" height="180%">
          <feGaussianBlur stdDeviation="4.5" result="sløret" />
          <feMerge>
            <feMergeNode in="sløret" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Tæt radial-glød til slut-prikkerne */}
        <radialGradient id="odinPrikEmber" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--ember-light)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="var(--ember)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="odinPrikSeid" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--seid)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="var(--seid)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Gitterlinjer + y-labels */}
      {gitter.map((g) => (
        <g key={g.y}>
          <line
            x1={PAD_V}
            x2={B - PAD_H}
            y1={g.y}
            y2={g.y}
            stroke="var(--ember)"
            strokeOpacity={g.vaerdi === 0 ? 0.22 : 0.1}
            strokeWidth="1"
          />
          <text
            x={PAD_V - 10}
            y={g.y + 4}
            textAnchor="end"
            fontSize="12"
            fill="var(--faint)"
            fontFamily="var(--font-mono), monospace"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {g.vaerdi}
          </text>
        </g>
      ))}

      {/* Gradient-fyld */}
      <path d={omraade(visninger)} fill="url(#odinFyldVisninger)" />
      <path d={omraade(unikke)} fill="url(#odinFyldUnikke)" />

      {/* Glødende underlag + skarp streg — unikke (seid) under visninger (ember) */}
      <g filter="url(#odinGlow)">
        <path
          d={stiUnikke}
          fill="none"
          stroke="var(--seid)"
          strokeOpacity="0.85"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={stiVisninger}
          fill="none"
          stroke="var(--ember)"
          strokeWidth="2.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* Glødende slut-prikker */}
      {slutUnikke && (
        <g>
          <circle
            cx={slutUnikke.x}
            cy={slutUnikke.y}
            r="13"
            fill="url(#odinPrikSeid)"
          />
          <circle
            cx={slutUnikke.x}
            cy={slutUnikke.y}
            r="3.5"
            fill="var(--seid)"
            stroke="var(--bg)"
            strokeWidth="1.5"
          />
        </g>
      )}
      {slutVisninger && (
        <g>
          <circle
            cx={slutVisninger.x}
            cy={slutVisninger.y}
            r="14"
            fill="url(#odinPrikEmber)"
          />
          <circle
            cx={slutVisninger.x}
            cy={slutVisninger.y}
            r="3.5"
            fill="var(--ember-light)"
            stroke="var(--bg)"
            strokeWidth="1.5"
          />
        </g>
      )}

      {/* x-labels (~6 stk) */}
      {serie.map((p, i) =>
        i % labelHver === 0 || i === sidstIdx ? (
          <text
            key={i}
            x={x(i)}
            y={H - 12}
            textAnchor={i === sidstIdx && serie.length > 1 ? "end" : "middle"}
            fontSize="12"
            fill="var(--faint)"
            fontFamily="var(--font-mono), monospace"
          >
            {p.label}
          </text>
        ) : null,
      )}
    </svg>
  );
}
