"use client";

/**
 * Momspanelet — periodens rubrikker udregnet og klar til at taste ind i
 * TastSelv Erhverv, med Odins forklaring af hver rubrik. Når du har
 * indberettet, markeres perioden — posteringerne låses, og tallene fryses
 * som kvittering.
 */
import { useState } from "react";
import Link from "next/link";
import type { MomsOpgoerelse } from "@/lib/regnskab/moms";
import { momsfristFor } from "@/lib/regnskab/frister";
import type { Indstillinger } from "@/lib/regnskab/typer";
import { kr } from "@/lib/regnskab/typer";
import {
  fortrydIndberetningAction,
  markerIndberettetAction,
  saetIndberetningBetaltAction,
} from "@/app/admin/regnskab/actions";

const fmtDato = new Intl.DateTimeFormat("da-DK", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Europe/Copenhagen",
});

function pænDato(iso: string): string {
  return fmtDato.format(new Date(`${iso}T12:00:00Z`));
}

/** Afrund øre til hele kroner, som de skal tastes i TastSelv. */
function heleKr(oere: number): string {
  return new Intl.NumberFormat("da-DK").format(Math.round(oere / 100));
}

export function OdinMoms({
  indstillinger,
  opgoerelser,
  idag,
}: {
  indstillinger: Indstillinger;
  opgoerelser: MomsOpgoerelse[];
  idag: string;
}) {
  const [travlt, setTravlt] = useState(false);
  const [fejl, setFejl] = useState("");
  const [aaben, setAaben] = useState<string | null>(
    opgoerelser[0]?.periode.noegle ?? null,
  );

  if (!indstillinger.momsregistreret) {
    return (
      <section className="hud-panel">
        <div className="hud-head">
          <span className="hud-label">
            <span className="hud-rune">ᛏ</span> Moms
          </span>
        </div>
        <p className="regnskab-orakel">
          Du har sat virksomheden som IKKE momsregistreret. Husk: rammer din
          momspligtige omsætning 50.000 kr. inden for ét kalenderår, SKAL du
          registreres (fra og med den leverance, der bryder grænsen) — se{" "}
          <Link href="/admin/regnskab?del=viden">viden-basen</Link>. Slå
          momsregistrering til under{" "}
          <Link href="/admin/regnskab?del=opsaetning">Opsætning</Link>, når det
          sker.
        </p>
      </section>
    );
  }

  async function markerIndberettet(noegle: string) {
    if (
      !confirm(
        "Markér perioden som indberettet i TastSelv? Posteringerne låses, og tallene fryses som kvittering.",
      )
    )
      return;
    setTravlt(true);
    setFejl("");
    const r = await markerIndberettetAction(noegle);
    setTravlt(false);
    if (!r.ok) setFejl(r.fejl);
  }

  async function fortryd(id: string) {
    if (!confirm("Fortryd indberetnings-markeringen og lås posteringerne op?")) return;
    setTravlt(true);
    setFejl("");
    const r = await fortrydIndberetningAction(id);
    setTravlt(false);
    if (!r.ok) setFejl(r.fejl);
  }

  async function saetBetalt(id: string, betalt: boolean) {
    if (travlt) return;
    setTravlt(true);
    setFejl("");
    const r = await saetIndberetningBetaltAction(id, betalt);
    setTravlt(false);
    if (!r.ok) setFejl(r.fejl);
  }

  return (
    <>
      {fejl && <p className="admin-fejl">{fejl}</p>}
      {opgoerelser.map((o) => {
        const frist = momsfristFor(o.periode);
        const erAaben = aaben === o.periode.noegle;
        const ind = o.indberetning;
        return (
          <section
            key={o.periode.noegle}
            className={`hud-panel${erAaben ? " hud-panel-accent" : ""}`}
          >
            <div className="hud-head">
              <button
                type="button"
                className="regnskab-periode-knap"
                onClick={() => setAaben(erAaben ? null : o.periode.noegle)}
                aria-expanded={erAaben}
              >
                <span className="hud-label">
                  <span className="hud-rune">ᛏ</span> {o.periode.label}
                </span>
              </button>
              <span className="hud-meta">
                {ind
                  ? `✓ indberettet${ind.betalt ? " · betalt" : ""}`
                  : frist >= idag
                    ? `frist ${pænDato(frist)}`
                    : `⚠ fristen var ${pænDato(frist)}`}
              </span>
            </div>

            {erAaben && (
              <>
                {o.uafklarede > 0 && !ind && (
                  <p className="regnskab-advarsel">
                    ⚠ {o.uafklarede} postering{o.uafklarede === 1 ? "" : "er"} i
                    perioden er stadig uafklaret —{" "}
                    <Link href="/admin/regnskab?del=odin">svar Odin først</Link>,
                    ellers indberetter du forkerte tal.
                  </p>
                )}

                {o.salgUdenFakturagrundlag && !ind && (
                  <div className="regnskab-advarsel">
                    <p>
                      Der er ingen fakturaer med fakturadato i denne periode, så
                      salget er opgjort ud fra bankposteringerne. Det er kun
                      rigtigt, hvis kunden betalte i samme periode, som du
                      fakturerede. Ved udenlandske kunder med lang betalingsfrist
                      holder det sjældent — og så havner omsætningen i den
                      forkerte periode.
                    </p>
                    <p>
                      Læg fakturaerne ind under <strong>Fakturaer</strong>, så
                      periodiseres salget efter fakturadatoen, som momsloven
                      kræver.
                    </p>
                  </div>
                )}

                <div className="regnskab-rubrikker">
                  <div className="regnskab-rubrik">
                    <span className="regnskab-rubrik-navn">
                      Salgsmoms (udgående moms)
                    </span>
                    <span className="regnskab-rubrik-tal">
                      {heleKr(ind?.salgsmomsOere ?? o.salgsmomsOere)} kr.
                    </span>
                    <span className="hud-meta">
                      Moms af dit danske salg i perioden.
                      {o.fakturaer.length > 0 &&
                        ` Opgjort efter fakturadato fra ${o.fakturaer.length} ${
                          o.fakturaer.length === 1 ? "faktura" : "fakturaer"
                        }.`}
                    </span>
                  </div>
                  <div className="regnskab-rubrik">
                    <span className="regnskab-rubrik-navn">
                      Moms af ydelseskøb i udlandet
                    </span>
                    <span className="regnskab-rubrik-tal">
                      {heleKr(ind?.ydelseskoebsmomsOere ?? o.ydelseskoebsmomsOere)} kr.
                    </span>
                    <span className="hud-meta">
                      Beregnet 25 % af udenlandske software-/annonce-køb
                      (omvendt betalingspligt).
                    </span>
                  </div>
                  <div className="regnskab-rubrik">
                    <span className="regnskab-rubrik-navn">
                      Købsmoms (indgående moms)
                    </span>
                    <span className="regnskab-rubrik-tal">
                      {heleKr(ind?.koebsmomsOere ?? o.koebsmomsOere)} kr.
                    </span>
                    <span className="hud-meta">
                      Fradragsberettiget moms af dine køb — inkl. den beregnede
                      udlandsmoms ovenfor.
                    </span>
                  </div>
                  <div className="regnskab-rubrik">
                    <span className="regnskab-rubrik-navn">Rubrik A — ydelser</span>
                    <span className="regnskab-rubrik-tal">
                      {heleKr(ind?.rubrikAOere ?? o.rubrikAYdelserOere)} kr.
                    </span>
                    <span className="hud-meta">
                      Værdien (uden moms) af ydelseskøb i andre EU-LANDE —
                      oplysningsrubrik, ikke penge. Køb uden for EU (GitHub,
                      OpenAI m.fl.) skal IKKE med her og holdes automatisk ude.
                    </span>
                  </div>
                  {(ind?.rubrikBOere ?? o.rubrikBYdelserOere) > 0 && (
                    <div className="regnskab-rubrik">
                      <span className="regnskab-rubrik-navn">Rubrik B — ydelser</span>
                      <span className="regnskab-rubrik-tal">
                        {heleKr(ind?.rubrikBOere ?? o.rubrikBYdelserOere)} kr.
                      </span>
                      <span className="hud-meta">
                        Momsfrit salg af ydelser til EU-virksomheder. HUSK: skal
                        også indberettes særskilt i »EU-salg uden moms«
                        (EU-salgslisten) i TastSelv.
                      </span>
                    </div>
                  )}
                  {(ind?.rubrikCOere ?? o.rubrikCOere) > 0 && (
                    <div className="regnskab-rubrik">
                      <span className="regnskab-rubrik-navn">Rubrik C</span>
                      <span className="regnskab-rubrik-tal">
                        {heleKr(ind?.rubrikCOere ?? o.rubrikCOere)} kr.
                      </span>
                      <span className="hud-meta">
                        Værdien af salg uden dansk moms til kunder UDEN FOR EU —
                        efter Brexit også England. Oplysningsrubrik, ikke penge.
                        Må IKKE indberettes i »EU-salg uden moms«; det system er
                        kun for EU-lande.
                      </span>
                    </div>
                  )}
                  <div className="regnskab-rubrik regnskab-rubrik-total">
                    <span className="regnskab-rubrik-navn">
                      {(ind?.tilsvarOere ?? o.tilsvarOere) >= 0
                        ? "Momstilsvar — du skal betale"
                        : "Negativt tilsvar — du får tilbage"}
                    </span>
                    <span className="regnskab-rubrik-tal">
                      {kr(Math.abs(ind?.tilsvarOere ?? o.tilsvarOere))}
                    </span>
                    <span className="hud-meta">
                      salgsmoms + udlandsmoms − købsmoms
                    </span>
                  </div>
                </div>

                <details className="regnskab-klikguide">
                  <summary>ᚱ Odins klik-guide: sådan taster du det i TastSelv</summary>
                  <ol>
                    <li>
                      Gå til <strong>skat.dk</strong> → <em>Erhverv</em> →{" "}
                      <em>Log på</em> → log ind med <strong>MitID</strong> (vælg
                      din virksomhed, ikke dig som privatperson).
                    </li>
                    <li>
                      Vælg <strong>Moms</strong> → <em>Indberet moms</em> → vælg
                      perioden <strong>{o.periode.label}</strong>.
                    </li>
                    <li>
                      Tast tallene ovenfor i de tilsvarende felter — hele kroner.
                      Rubrikker uden beløb udfyldes med <strong>0</strong>.
                    </li>
                    <li>
                      Har du hverken købt eller solgt i perioden: vælg{" "}
                      <em>nulindberetning</em> — du SKAL indberette alligevel.
                    </li>
                    <li>
                      Godkend og gem kvitteringen. Betal via betalingslinjen på
                      Skattekontoen (eller tilmeld Leverandørservice/Nets, så
                      trækkes det automatisk).
                    </li>
                    <li>
                      Kom tilbage hertil og tryk{" "}
                      <em>„Markér som indberettet”</em> — så låser jeg
                      posteringerne og fryser kvitteringen.
                    </li>
                  </ol>
                  <p className="hud-meta">
                    Fuld guide med alle rubrikker:{" "}
                    <Link href="/admin/regnskab?del=viden">viden-basen → Moms</Link>.
                  </p>
                </details>

                <div className="besked-handlinger">
                  {!ind ? (
                    <button
                      type="button"
                      className="admin-knap admin-knap-primaer"
                      onClick={() => markerIndberettet(o.periode.noegle)}
                      disabled={travlt}
                    >
                      Markér som indberettet ✓
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="admin-knap"
                        onClick={() => saetBetalt(ind.id, !ind.betalt)}
                        disabled={travlt}
                      >
                        {ind.betalt ? "Markér som ubetalt" : "Markér som betalt 💸"}
                      </button>
                      <button
                        type="button"
                        className="admin-knap admin-knap-fare"
                        onClick={() => fortryd(ind.id)}
                        disabled={travlt}
                      >
                        Fortryd indberetning
                      </button>
                    </>
                  )}
                </div>

                <p className="hud-meta">
                  {o.antalPosteringer} posteringer i perioden · nettoomsætning{" "}
                  {kr(o.omsaetningNettoOere)}
                </p>
              </>
            )}
          </section>
        );
      })}
      {opgoerelser.length === 0 && (
        <section className="hud-panel">
          <p className="admin-tom">
            Ingen momsperioder endnu — de starter fra dit første regnskabsår (
            {indstillinger.foersteAar}).
          </p>
        </section>
      )}
    </>
  );
}
