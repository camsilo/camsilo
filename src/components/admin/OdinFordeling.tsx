import type { Andel } from "@/lib/analytics/aggregate";

/**
 * Genbrugeligt fordelings-panel til Odin-kommandocenteret.
 * Bruges til top-lister, enheder, browsere, OS, ind-/udgangssider,
 * sprog og lande. Renderer en glødende .hud-panel med en liste af
 * fordelings-bjælker (.hud-bars), hvor hver bjælkes bredde afspejler
 * dens andel af det største antal i listen.
 */
export type OdinFordelingProps = {
  /** Elder Futhark-rune som visuel accent i panel-hovedet (fx "ᚠ"). */
  rune: string;
  /** Panel-overskrift (dansk, mono-caps). */
  label: string;
  /** Posterne der skal vises som bjælker. */
  poster: Andel[];
  /** Tekst der vises når listen er tom. */
  tom: string;
  /** Vis også andel i procent af summen i parentes ud for antallet. */
  visTotalAndel?: boolean;
};

export default function OdinFordeling({
  rune,
  label,
  poster,
  tom,
  visTotalAndel = false,
}: OdinFordelingProps) {
  // Største antal styrer bjælke-skaleringen; summen bruges til procent-andele.
  const maxAntal = poster.reduce((m, p) => (p.antal > m ? p.antal : m), 0);
  const sum = poster.reduce((s, p) => s + p.antal, 0);

  return (
    <section className="hud-panel">
      <div className="hud-head">
        <span className="hud-label">
          <span className="hud-rune" aria-hidden="true">
            {rune}
          </span>
          {label}
        </span>
        {poster.length > 0 ? (
          <span className="hud-meta">{poster.length} RÆKKER</span>
        ) : null}
      </div>

      {poster.length === 0 ? (
        <p
          className="hud-meta"
          style={{ color: "var(--faint)", padding: "10px 2px 2px" }}
        >
          {tom}
        </p>
      ) : (
        <ul className="hud-bars">
          {poster.map((post, i) => {
            // Bredde relativt til det største antal (min. en synlig flig).
            const bredde =
              maxAntal > 0 ? Math.max((post.antal / maxAntal) * 100, 3) : 0;
            // Procent-andel af den samlede sum (kun ved visTotalAndel).
            const andelPct = sum > 0 ? (post.antal / sum) * 100 : 0;

            return (
              <li className="hud-bar" key={`${post.navn}-${i}`}>
                <span
                  className="hud-bar-fill"
                  style={{ width: `${bredde}%` }}
                  aria-hidden="true"
                />
                <span className="hud-bar-navn" title={post.navn}>
                  {post.navn}
                </span>
                <span className="hud-bar-tal">
                  {post.antal.toLocaleString("da-DK")}
                  {visTotalAndel ? (
                    <span style={{ color: "var(--faint)", marginLeft: 6 }}>
                      ({andelPct.toFixed(1).replace(".", ",")}%)
                    </span>
                  ) : null}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
