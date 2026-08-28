"use client";

/**
 * Den private årsopgørelse — rubrik for rubrik, med dine egne tal i felterne.
 *
 * Tanken er, at du kan sidde med skat.dk åben ved siden af og skrive af. Hvert
 * felt siger, om Skattestyrelsen udfylder det selv, om en tredjepart gør det
 * (og dermed hvor fejlen sidder, når feltet står tomt), eller om det er dit
 * eget ansvar — og bag hvert "?" står hvorfor, hvornår og hvad fælden er.
 */
import { useState } from "react";
import {
  AARSRUBRIKKER_2026,
  RET_TRIN,
  kanRettes,
  rettefristFor,
  type AarsRubrik,
} from "@/lib/regnskab/aarsopgoerelse";
import type { FradragsMaaler } from "@/lib/regnskab/fradragslofter";
import type { SkatteOpgoerelse } from "@/lib/regnskab/skat";
import { kr, krRund } from "@/lib/regnskab/typer";

const MAERKE: Record<string, { tekst: string; klasse: string }> = {
  laast: { tekst: "Låst — andre indberetter", klasse: "privat" },
  selv: { tekst: "Du skal selv skrive den", klasse: "usikker" },
  beregnet: { tekst: "Beregnes", klasse: "privat" },
};

function Rubrik({
  r,
  vaerdiOere,
  vaerdiNote,
}: {
  r: AarsRubrik;
  vaerdiOere?: number;
  vaerdiNote?: string;
}) {
  const [aaben, setAaben] = useState(false);
  const m = MAERKE[r.udfylder];

  return (
    <li className="regnskab-fradrag">
      <div className="regnskab-fradrag-hoved">
        <span className="regnskab-fradrag-navn">
          <span className="felt-rubrik-nr">
            Rubrik {r.nr}
            {r.felt && ` · felt ${r.felt}`}
          </span>
          {r.navn}
          <button
            type="button"
            className="regnskab-hjaelp"
            aria-expanded={aaben}
            aria-label={`Forklar rubrik ${r.nr}`}
            onClick={() => setAaben((v) => !v)}
          >
            ?
          </button>
        </span>
        <span className="regnskab-fradrag-tal">
          {vaerdiOere !== undefined ? (
            <strong>{kr(vaerdiOere)}</strong>
          ) : (
            <span className={`regnskab-bilag-maerke ${m.klasse}`}>{m.tekst}</span>
          )}
        </span>
      </div>

      <p className="regnskab-fradrag-kort">
        {r.kort}
        {r.overset && (
          <span className="regnskab-overset"> Her taber folk oftest penge.</span>
        )}
      </p>

      {vaerdiNote && <p className="regnskab-aarsop-note">{vaerdiNote}</p>}

      <p className="regnskab-fradrag-hvor">
        {r.indberetter ? `${r.indberetter} indberetter · ` : ""}
        {r.loftKr && `Loft ${r.loftKr.toLocaleString("da-DK")} kr. · `}
        {r.bundfradragKr &&
          `Bundfradrag ${r.bundfradragKr.toLocaleString("da-DK")} kr. · `}
        {r.hjemmel}
      </p>

      {aaben && (
        <div className="regnskab-fradrag-forklaring">
          <p>{r.forklaring}</p>
        </div>
      )}
    </li>
  );
}

export function OdinAarsopgoerelse({
  skat,
  maalere,
  aar,
  idag,
}: {
  skat: SkatteOpgoerelse;
  maalere: FradragsMaaler[];
  aar: number;
  idag: string;
}) {
  const [visAlle, setVisAlle] = useState(false);

  // Rubrikker, hvor programmet kender tallet.
  const vaerdier: Record<string, { oere: number; note: string }> = {};
  if (skat.resultatOere > 0) {
    vaerdier["111"] = {
      oere: skat.resultatOere,
      note:
        skat.fakturaer.length > 0
          ? `Omsætning ${krRund(skat.omsaetningOere)} fra ${skat.fakturaer.length} ${
              skat.fakturaer.length === 1 ? "faktura" : "fakturaer"
            } med fakturadato i ${aar}, minus ${krRund(skat.udgifterOere)} i erhvervsudgifter.`
          : `Regnet ud fra bankposteringerne — læg fakturaerne ind, så periodiseres det efter fakturadatoen.`,
    };
  } else if (skat.resultatOere < 0) {
    vaerdier["112"] = {
      oere: Math.abs(skat.resultatOere),
      note: "Underskuddet modregnes i din anden indkomst samme år.",
    };
  }
  if (skat.kursgevinstSkalOplyses) {
    vaerdier["39"] = {
      oere: skat.kursgevinstOere,
      note: `Kursgevinst realiseret i ${aar}. Over bagatelgrænsen på 2.000 kr., så hele beløbet skal oplyses.`,
    };
  }

  const ubrugte = maalere.filter(
    (m) => m.tilbageOere !== null && m.tilbageOere > 0 && m.brugtOere === 0,
  );
  const ukendte = maalere.filter(
    (m) => m.brugtOere === null && m.loft.loftOere !== null,
  );
  const potentiale = maalere.reduce((s, m) => s + m.potentialeOere, 0);

  const vigtige = AARSRUBRIKKER_2026.filter(
    (r) => r.overset || vaerdier[r.nr] !== undefined,
  );
  const viste = visAlle ? AARSRUBRIKKER_2026 : vigtige;

  return (
    <>
      <section className="hud-panel hud-panel-accent">
        <div className="hud-head">
          <span className="hud-label">
            <span className="hud-rune">ᛉ</span> Årsopgørelsen {aar}
          </span>
          <span className="hud-meta">
            Kan rettes til{" "}
            {new Date(rettefristFor(aar)).toLocaleDateString("da-DK", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>

        <p className="regnskab-orakel">
          Skattestyrelsen udfylder det meste selv. Men ikke det hele — og det er
          netop de felter, der står tomme, folk taber penge på. Her står hvert
          felt med det, programmet ved, og bag hvert <strong>?</strong> hvorfor,
          hvornår og hvad fælden er.
        </p>

        <div className="regnskab-aarsop-noegle">
          <span>
            <span className="regnskab-bilag-maerke usikker">Du skal selv</span>{" "}
            feltet står tomt, til du udfylder det
          </span>
          <span>
            <span className="regnskab-bilag-maerke privat">Låst</span> en anden
            indberetter — står der 0, mangler indberetningen
          </span>
        </div>
      </section>

      {(ubrugte.length > 0 || ukendte.length > 0) && (
        <section className="hud-panel">
          <div className="hud-head">
            <span className="hud-label">
              <span className="hud-rune">ᚹ</span> Det du ikke har hentet
            </span>
            {potentiale > 0 && (
              <span className="hud-meta">{krRund(potentiale)} uhentet</span>
            )}
          </div>

          {ubrugte.length > 0 && (
            <>
              <p className="regnskab-orakel">
                Disse fradrag står helt ubrugte. Har du haft udgiften, ligger
                pengene og venter — men de forsvinder ved årsskiftet.
              </p>
              <ul className="regnskab-fradragsliste">
                {ubrugte.map((m) => (
                  <li key={m.loft.id} className="regnskab-fradrag">
                    <div className="regnskab-fradrag-hoved">
                      <span className="regnskab-fradrag-navn">{m.loft.navn}</span>
                      <span className="regnskab-fradrag-tal">
                        <strong>{krRund(m.tilbageOere ?? 0)}</strong> at hente
                      </span>
                    </div>
                    <p className="regnskab-fradrag-kort">{m.loft.kort}</p>
                    <p className="regnskab-fradrag-hvor">{m.loft.hvor}</p>
                  </li>
                ))}
              </ul>
            </>
          )}

          {ukendte.length > 0 && (
            <div className="regnskab-advarsel">
              <p>
                <strong>Disse kan programmet ikke se:</strong>{" "}
                {ukendte.map((m) => m.loft.navn).join(", ")}. De indberettes af
                andre — fagforening, a-kasse, pensionsselskab — og bogen her ser
                dem ikke.
              </p>
              <p>
                Slå dem op på årsopgørelsen. Står rubrikken tom, selv om du
                betaler, mangler indberetningen, og fradraget går tabt. Du kan
                ikke selv rette i et låst felt — du skal ringe til dem, der skulle
                have indberettet. Det kan gøres bagudrettet.
              </p>
            </div>
          )}
        </section>
      )}

      <section className="hud-panel">
        <div className="hud-head">
          <span className="hud-label">
            <span className="hud-rune">ᚱ</span> Felt for felt
          </span>
          <button
            type="button"
            className="regnskab-miniknap"
            onClick={() => setVisAlle((v) => !v)}
          >
            {visAlle ? "Vis kun de vigtige" : `Vis alle ${AARSRUBRIKKER_2026.length}`}
          </button>
        </div>

        <ul className="regnskab-fradragsliste">
          {viste.map((r) => (
            <Rubrik
              key={r.nr}
              r={r}
              vaerdiOere={vaerdier[r.nr]?.oere}
              vaerdiNote={vaerdier[r.nr]?.note}
            />
          ))}
        </ul>
      </section>

      <section className="hud-panel">
        <div className="hud-head">
          <span className="hud-label">
            <span className="hud-rune">ᛏ</span> Sådan retter du
          </span>
        </div>

        <ol className="regnskab-trinliste">
          {RET_TRIN.map((t) => (
            <li key={t.titel}>
              <strong>{t.titel}</strong>
              <span>{t.tekst}</span>
            </li>
          ))}
        </ol>

        {kanRettes(aar, idag) ? (
          <p className="regnskab-anvisning">
            {aar} kan rettes frem til{" "}
            <strong>
              {new Date(rettefristFor(aar)).toLocaleDateString("da-DK", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </strong>
            . Opdager du et glemt fradrag flere år tilbage, kan det stadig hentes
            hjem — ordinær genoptagelse løber til 1. maj i det fjerde år efter
            indkomståret.
          </p>
        ) : (
          <div className="regnskab-advarsel">
            <p>
              Fristen for at rette {aar} er passeret. Kun i særlige tilfælde kan
              året genoptages ekstraordinært.
            </p>
          </div>
        )}

        <p className="admin-fodnote">
          Rubriknumre og feltnavne er læst af Skattestyrelsens blanket 04.003 og
          04.076, august 2026. Satser og lofter gælder 2026. Det her er en
          arbejdsopgørelse — ikke autoriseret rådgivning.
        </p>
      </section>
    </>
  );
}
