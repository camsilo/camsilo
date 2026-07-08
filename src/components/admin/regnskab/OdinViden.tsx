/**
 * Viden-basen — Odins bibliotek: kildebelagte guides om moms, skat, fradrag,
 * ApS-omdannelse, bogføringslov og frister. Server-komponent; indholdet
 * renderes fra strukturerede datafiler i lib/regnskab/viden.
 */
import { VIDEN_GUIDES } from "@/lib/regnskab/viden";
import type { VidenBlok } from "@/lib/regnskab/viden/typer";

function Blok({ blok }: { blok: VidenBlok }) {
  switch (blok.type) {
    case "tekst":
      return <p className="regnskab-viden-tekst">{blok.tekst}</p>;
    case "liste":
      return (
        <ul className="regnskab-viden-liste">
          {blok.punkter.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      );
    case "trin":
      return (
        <ol className="regnskab-viden-trin">
          {blok.trin.map((t, i) => (
            <li key={i}>
              <strong>{t.titel}</strong>
              <span>{t.tekst}</span>
            </li>
          ))}
        </ol>
      );
    case "tabel":
      return (
        <div className="regnskab-viden-tabelwrap">
          <table className="regnskab-viden-tabel">
            <thead>
              <tr>
                {blok.kolonner.map((k, i) => (
                  <th key={i}>{k}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {blok.raekker.map((r, i) => (
                <tr key={i}>
                  {r.map((c, j) => (
                    <td key={j}>{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "advarsel":
      return <p className="regnskab-advarsel">⚠ {blok.tekst}</p>;
    case "tip":
      return <p className="regnskab-odin-note">ᚱ {blok.tekst}</p>;
  }
}

export function OdinViden() {
  return (
    <>
      <section className="hud-panel hud-panel-accent">
        <div className="hud-head">
          <span className="hud-label">
            <span className="hud-rune">ᛦ</span> Odins bibliotek
          </span>
          <span className="hud-meta">{VIDEN_GUIDES.length} guides</span>
        </div>
        <p className="regnskab-orakel">
          Alt hvad jeg ved om moms, skat, fradrag og vejen til ApS — skrevet ud
          fra Skattestyrelsens og Erhvervsstyrelsens egne kilder, med link til
          hver påstand. Regler ændrer sig: hver guide viser, hvornår den sidst er
          efterprøvet. Er noget markeret usikkert, så tjek kilden, før du handler.
        </p>
      </section>

      {VIDEN_GUIDES.map((g) => (
        <section key={g.id} className="hud-panel" id={`viden-${g.id}`}>
          <div className="hud-head">
            <span className="hud-label">
              <span className="hud-rune">{g.rune}</span> {g.emoji} {g.titel}
            </span>
            <span className="hud-meta">efterprøvet {g.opdateret}</span>
          </div>
          <p className="regnskab-viden-tekst">{g.intro}</p>
          {g.afsnit.map((a) => (
            <details key={a.id} className="regnskab-klikguide">
              <summary>{a.overskrift}</summary>
              {a.blokke.map((b, i) => (
                <Blok key={i} blok={b} />
              ))}
              {a.kilder && a.kilder.length > 0 && (
                <p className="hud-meta regnskab-kilder">
                  Kilder:{" "}
                  {a.kilder.map((k, i) => (
                    <span key={i}>
                      {i > 0 && " · "}
                      <a href={k.url} target="_blank" rel="noopener noreferrer">
                        {k.titel}
                      </a>
                    </span>
                  ))}
                </p>
              )}
            </details>
          ))}
        </section>
      ))}
    </>
  );
}
