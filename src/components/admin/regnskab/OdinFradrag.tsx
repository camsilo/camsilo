"use client";

/**
 * Fradragspanelet — hvert fradrag med et loft vises som en måler, så det
 * kan ses, hvor mange kroner der stadig er tilbage at hente i år.
 *
 * Et fradrag med et årsloft, du ikke bruger, er tabt ved årsskiftet. Derfor
 * er "tilbage" det tal, der står stort — ikke "brugt".
 */
import { useState } from "react";
import type { FradragsMaaler } from "@/lib/regnskab/fradragslofter";
import { kr, krRund } from "@/lib/regnskab/typer";

function Maaler({ m }: { m: FradragsMaaler }) {
  const [aaben, setAaben] = useState(false);
  const { loft, brugtOere, tilbageOere, pct } = m;

  // Farvetone efter hvor meget der er tilbage: opbrugt → dæmpet.
  const tone = pct >= 100 ? "opbrugt" : pct >= 60 ? "delvist" : "aaben";

  let hoejre: string;
  if (loft.loftOere === null) hoejre = "intet loft";
  else if (brugtOere === null) hoejre = `loft ${krRund(loft.loftOere)}`;
  else hoejre = `${krRund(tilbageOere ?? 0)} tilbage`;

  let barTekst: string;
  if (loft.loftOere === null) {
    barTekst = "Der er ingen øvre grænse — hver krone tæller.";
  } else if (brugtOere === null) {
    barTekst = "Programmet ved ikke, om du bruger det — tjek din årsopgørelse.";
  } else if (brugtOere === 0) {
    barTekst = `Helt ubrugt — der er ${krRund(loft.loftOere)} at hente.`;
  } else {
    barTekst = `Brugt ${krRund(brugtOere)} af ${krRund(loft.loftOere)}.`;
  }

  return (
    <li className={`regnskab-fradrag regnskab-fradrag-${tone}`}>
      <div className="regnskab-fradrag-hoved">
        <span className="regnskab-fradrag-navn">
          {loft.navn}
          <button
            type="button"
            className="regnskab-hjaelp"
            aria-expanded={aaben}
            aria-label={`Forklar ${loft.navn}`}
            onClick={() => setAaben((v) => !v)}
          >
            ?
          </button>
        </span>
        <span className="regnskab-fradrag-tal">{hoejre}</span>
      </div>

      <div className="regnskab-fradrag-bar" role="img" aria-label={barTekst}>
        {pct > 0 && (
          <span
            className="regnskab-fradrag-fill"
            style={{ width: `${Math.min(100, pct)}%` }}
          />
        )}
        <span className="regnskab-fradrag-bartekst">{barTekst}</span>
      </div>

      <p className="regnskab-fradrag-kort">{loft.kort}</p>
      <p className="regnskab-fradrag-hvor">
        {loft.hvor} · {loft.hjemmel}
      </p>

      {aaben && (
        <div className="regnskab-fradrag-forklaring">
          <p>{loft.forklaring}</p>
          {m.potentialeOere > 0 && (
            <p className="regnskab-fradrag-vaerdi">
              Bruger du resten, sparer det dig omkring{" "}
              <strong>{krRund(m.potentialeOere)}</strong> i skat
              {loft.momsFradrag && " — og momsen oveni"}.
            </p>
          )}
        </div>
      )}
    </li>
  );
}

export function OdinFradrag({
  maalere,
  aar,
}: {
  maalere: FradragsMaaler[];
  aar: number;
}) {
  const potentiale = maalere.reduce((s, m) => s + m.potentialeOere, 0);
  const ukendte = maalere.filter((m) => m.brugtOere === null && m.loft.loftOere !== null);

  return (
    <section className="hud-panel">
      <div className="hud-head">
        <span className="hud-label">
          <span className="hud-rune">ᚠ</span> Fradrag {aar}
        </span>
        {potentiale > 0 && (
          <span className="hud-meta">{krRund(potentiale)} uhentet</span>
        )}
      </div>

      <p className="regnskab-orakel">
        Hvert fradrag med et årsloft, du ikke bruger, forsvinder ved årsskiftet.
        Måleren viser, hvor mange kroner der stadig er tilbage. Tryk på{" "}
        <strong>?</strong> for at se, hvor og hvornår du kan bruge det.
      </p>

      <ul className="regnskab-fradragsliste">
        {maalere.map((m) => (
          <Maaler key={m.loft.id} m={m} />
        ))}
      </ul>

      {potentiale > 0 && (
        <p className="regnskab-anvisning">
          Der ligger omkring <strong>{krRund(potentiale)}</strong> i skattelettelser,
          du endnu ikke har hentet. Det betyder ikke, at du skal ud og bruge penge
          for at spare skat — du sparer altid mindre, end du bruger. Men har du{" "}
          <em>allerede</em> haft udgiften, ligger pengene og venter.
        </p>
      )}

      {ukendte.length > 0 && (
        <div className="regnskab-advarsel">
          <p>
            Programmet kan ikke se, om du bruger disse{" "}
            {ukendte.length === 1 ? "fradrag" : `${ukendte.length} fradrag`}:{" "}
            {ukendte.map((m) => m.loft.navn).join(", ")}. De indberettes af andre —
            fagforening, a-kasse, pensionsselskab — og bogen her ser dem ikke.
          </p>
          <p>
            Tjek dem på din årsopgørelse. Står rubrikken tom, selv om du betaler,
            mangler indberetningen, og fradraget går tabt. Det er en af de
            hyppigste fejl på danske årsopgørelser.
          </p>
        </div>
      )}
    </section>
  );
}
