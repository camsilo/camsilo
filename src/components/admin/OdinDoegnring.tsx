import type { Punkt } from "@/lib/analytics/aggregate";

/**
 * Odin — "Døgnringen": et nordisk astrolabium der viser aktivitet pr.
 * time-på-døgnet (UTC). Ren server-renderet SVG.
 *
 * 24 glødende ember-eger stråler ud fra centrum i en cirkel — midnat i toppen,
 * med uret rundt om døgnet. Hver eges LÆNGDE og GLØD/OPACITET styres af timens
 * aktivitet (timer[h]), maks-normaliseret så den travleste time fylder ringen.
 * En tynd kold seid-yderring med 0/6/12/18-markører rammer skiven ind, og i
 * centrum står døgnets travleste time som "HH–HH" med en lille mono-label.
 *
 * Bemærk: typen Punkt importeres ikke direkte her, men datakontrakten lever i
 * samme modul — props er det rå time-array. Returnerer KUN <svg>; siden lægger
 * selv ringen i et .hud-panel.
 */
export type OdinDoegnringProps = { timer: number[] };

// Hold typen Punkt "i brug" så modulets datakontrakt er eksplicit refereret
// (selve ringen arbejder kun på time-arrayet).
type _Datakontrakt = Punkt;

export function OdinDoegnring({ timer }: OdinDoegnringProps) {
  // --- Geometri -----------------------------------------------------------
  const S = 240; // viewBox-kant (kvadratisk)
  const C = S / 2; // centrum
  const rYder = 110; // seid-yderringens radius
  const rInder = 44; // egernes inderste fodpunkt (frilægger center-skiven)
  const rMaks = 104; // egernes maksimale spids (lige inden for yderringen)

  // Normaliser til 24 tal — defensivt mod manglende/skæve input.
  const t: number[] = Array.from({ length: 24 }, (_, i) =>
    Math.max(0, Number(timer?.[i]) || 0),
  );
  const maks = Math.max(1, ...t);
  const total = t.reduce((s, v) => s + v, 0);

  // Travleste time → label "HH–HH" (UTC). Ved helt tom data vises "—".
  const travlIdx = t.reduce((bedst, v, i) => (v > t[bedst] ? i : bedst), 0);
  const harData = total > 0;
  const pad = (n: number) => String(((n % 24) + 24) % 24).padStart(2, "0");
  const travlLabel = harData ? `${pad(travlIdx)}–${pad(travlIdx + 1)}` : "—";

  // Vinkel for time h: midnat (h=0) i toppen, med uret. -90° flytter til top.
  const vinkel = (h: number): number => ((h / 24) * 360 - 90) * (Math.PI / 180);
  const punkt = (h: number, r: number) => ({
    x: C + Math.cos(vinkel(h)) * r,
    y: C + Math.sin(vinkel(h)) * r,
  });

  // Hver eges spids skaleret efter timens andel af maks (kort min-flig så
  // selv stille timer antydes som svage gnister på skiven).
  const eger = t.map((v, h) => {
    const andel = v / maks;
    const rSpids = rInder + (rMaks - rInder) * Math.max(andel, v > 0 ? 0.06 : 0);
    const fod = punkt(h, rInder);
    const spids = punkt(h, rSpids);
    // Glød/opacitet følger andelen, men aldrig helt usynlig på aktive timer.
    const styrke = v > 0 ? 0.35 + andel * 0.65 : 0.12;
    const erTravl = h === travlIdx && harData;
    return { h, v, andel, fod, spids, styrke, erTravl };
  });

  // Tids-markører ved 0/6/12/18 (UTC) — kvartererne på astrolabiet.
  const markorer = [0, 6, 12, 18].map((h) => {
    const ind = punkt(h, rYder - 9);
    const ud = punkt(h, rYder);
    const tekst = punkt(h, rYder + 12);
    return { h, ind, ud, tekst };
  });

  return (
    <svg
      viewBox={`0 0 ${S} ${S}`}
      role="img"
      aria-label="Døgnring: aktivitet fordelt på time-på-døgnet (UTC)"
      style={{ width: "100%", height: "auto", display: "block" }}
    >
      <defs>
        {/* Blød underglød til ember-egerne */}
        <filter id="odinRingGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.4" result="sløret" />
          <feMerge>
            <feMergeNode in="sløret" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Ember-forløb langs egen: mørk glød ved foden, lys gnist i spidsen */}
        <linearGradient id="odinEge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--ember-light)" />
          <stop offset="60%" stopColor="var(--ember)" />
          <stop offset="100%" stopColor="var(--ember-deep)" />
        </linearGradient>

        {/* Svag varme bag center-skiven */}
        <radialGradient id="odinNav" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--ember)" stopOpacity="0.22" />
          <stop offset="70%" stopColor="var(--ember)" stopOpacity="0.05" />
          <stop offset="100%" stopColor="var(--ember)" stopOpacity="0" />
        </radialGradient>

        {/* Tæt gnist til spidserne */}
        <radialGradient id="odinGnist" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--ember-light)" stopOpacity="0.95" />
          <stop offset="100%" stopColor="var(--ember)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Kold seid-yderring */}
      <circle
        cx={C}
        cy={C}
        r={rYder}
        fill="none"
        stroke="var(--seid)"
        strokeOpacity="0.45"
        strokeWidth="1"
      />
      <circle
        cx={C}
        cy={C}
        r={rYder - 4}
        fill="none"
        stroke="var(--seid)"
        strokeOpacity="0.12"
        strokeWidth="0.75"
      />

      {/* Indre rune-skive bag egerne */}
      <circle cx={C} cy={C} r={rMaks} fill="url(#odinNav)" />
      <circle
        cx={C}
        cy={C}
        r={rInder}
        fill="none"
        stroke="var(--oak)"
        strokeOpacity="0.35"
        strokeWidth="1"
      />

      {/* Fine spoke-spor for alle 24 timer (svagt gitter på skiven) */}
      {eger.map((e) => {
        const ud = punkt(e.h, rMaks);
        return (
          <line
            key={`spor-${e.h}`}
            x1={e.fod.x}
            y1={e.fod.y}
            x2={ud.x}
            y2={ud.y}
            stroke="var(--ember)"
            strokeOpacity={e.h % 6 === 0 ? 0.16 : 0.06}
            strokeWidth={e.h % 6 === 0 ? 0.9 : 0.6}
          />
        );
      })}

      {/* Glødende ember-eger — længde + opacitet = timens aktivitet */}
      <g filter="url(#odinRingGlow)">
        {eger.map((e) => (
          <g key={`ege-${e.h}`}>
            <line
              x1={e.fod.x}
              y1={e.fod.y}
              x2={e.spids.x}
              y2={e.spids.y}
              stroke={e.erTravl ? "var(--ember-light)" : "url(#odinEge)"}
              strokeOpacity={e.styrke}
              strokeWidth={e.erTravl ? 3.4 : 2.4}
              strokeLinecap="round"
            />
            {/* Gnist i spidsen på de mere aktive timer */}
            {e.andel > 0.18 ? (
              <circle
                cx={e.spids.x}
                cy={e.spids.y}
                r={e.erTravl ? 4.6 : 3}
                fill="url(#odinGnist)"
              />
            ) : null}
          </g>
        ))}
      </g>

      {/* 0/6/12/18-markører på yderringen */}
      {markorer.map((m) => (
        <g key={`mark-${m.h}`}>
          <line
            x1={m.ind.x}
            y1={m.ind.y}
            x2={m.ud.x}
            y2={m.ud.y}
            stroke="var(--seid)"
            strokeOpacity="0.7"
            strokeWidth="1.4"
          />
          <text
            x={m.tekst.x}
            y={m.tekst.y + 3.5}
            textAnchor="middle"
            fontSize="9"
            fill="var(--faint)"
            fontFamily="var(--font-mono), monospace"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {pad(m.h)}
          </text>
        </g>
      ))}

      {/* Center-nav: travleste time + label */}
      <circle
        cx={C}
        cy={C}
        r={rInder - 3}
        fill="var(--bg)"
        stroke="var(--ember)"
        strokeOpacity="0.35"
        strokeWidth="0.75"
      />
      <text
        x={C}
        y={C - 1}
        textAnchor="middle"
        fontSize="17"
        fill="var(--ember-light)"
        fontFamily="var(--font-mono), monospace"
        style={{ fontVariantNumeric: "tabular-nums", letterSpacing: "0.5px" }}
      >
        {travlLabel}
      </text>
      <text
        x={C}
        y={C + 13}
        textAnchor="middle"
        fontSize="7"
        fill="var(--faint)"
        fontFamily="var(--font-mono), monospace"
        style={{ letterSpacing: "1.5px" }}
      >
        TRAVLEST (UTC)
      </text>
    </svg>
  );
}
