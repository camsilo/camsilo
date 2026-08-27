"use client";

/**
 * Fakturapanelet — salgssiden af regnskabet.
 *
 * Hvorfor fakturaerne står for sig: en indtægt hører til den dag, den er
 * tjent, ikke den dag pengene lander. Fakturerer du i december og får
 * betalingen i marts, hører omsætningen til december — både i momsangivelsen
 * og på årsopgørelsen. Bogfører man efter bankdatoen, ryger beløbet i det
 * forkerte år, og så bliver både moms og skat forkert.
 *
 * Derfor er det fakturadatoen, der styrer, og betalingerne kobles på bagefter.
 */
import { useState } from "react";
import type { Faktura, Kursdifference } from "@/lib/regnskab/typer";
import { kr } from "@/lib/regnskab/typer";
import { erEuLand } from "@/lib/regnskab/moms";
import { gemFakturaAction, sletFakturaAction } from "@/app/admin/regnskab/actions";

const fmtDato = new Intl.DateTimeFormat("da-DK", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Europe/Copenhagen",
});
const pænDato = (iso: string) => fmtDato.format(new Date(`${iso}T12:00:00Z`));

const RUBRIK_TEKST: Record<string, string> = {
  salgsmoms: "Dansk moms 25 %",
  rubrikB: "Rubrik B — EU, omvendt betalingspligt",
  rubrikC: "Rubrik C — uden for EU",
  momsfri: "Momsfri efter § 13",
};

function Hjaelp({ tekst }: { tekst: string }) {
  const [aaben, setAaben] = useState(false);
  return (
    <>
      <button
        type="button"
        className="regnskab-hjaelp"
        aria-expanded={aaben}
        aria-label="Forklaring"
        onClick={() => setAaben((v) => !v)}
      >
        ?
      </button>
      {aaben && (
        <div className="regnskab-fradrag-forklaring">
          <p>{tekst}</p>
        </div>
      )}
    </>
  );
}

export function OdinFakturaer({
  fakturaer,
  kursdifferencer,
}: {
  fakturaer: Faktura[];
  kursdifferencer: Kursdifference[];
}) {
  const [aabenForm, setAabenForm] = useState(fakturaer.length === 0);
  const [travlt, setTravlt] = useState(false);
  const [fejl, setFejl] = useState("");
  const [kvittering, setKvittering] = useState("");

  async function gem(fd: FormData) {
    setTravlt(true);
    setFejl("");
    setKvittering("");
    const svar = await gemFakturaAction({
      nummer: String(fd.get("nummer") ?? ""),
      kunde: String(fd.get("kunde") ?? ""),
      land: String(fd.get("land") ?? "DK"),
      kundeMomsnr: String(fd.get("kundeMomsnr") ?? ""),
      fakturadato: String(fd.get("fakturadato") ?? ""),
      ydelse: String(fd.get("ydelse") ?? ""),
      valuta: String(fd.get("valuta") ?? "DKK"),
      beloeb: String(fd.get("beloeb") ?? ""),
      moms: String(fd.get("moms") ?? ""),
      manuelKurs: String(fd.get("manuelKurs") ?? ""),
    });
    setTravlt(false);
    if (!svar.ok) {
      setFejl(svar.fejl);
      return;
    }
    const d = svar.data!;
    setKvittering(
      d.kurs === 1
        ? "Fakturaen er gemt."
        : `Fakturaen er gemt. Kurs ${d.kurs.toFixed(4)}${
            d.forskudt
              ? ` (fra ${d.kursdato} — fakturadatoen var ikke en bankdag)`
              : ""
          }.`,
    );
    setAabenForm(false);
  }

  return (
    <section className="hud-panel">
      <div className="hud-head">
        <span className="hud-label">
          <span className="hud-rune">ᛒ</span> Fakturaer
        </span>
        <span className="hud-meta">{fakturaer.length} stk.</span>
      </div>

      <p className="regnskab-orakel">
        Fakturadatoen bestemmer alt. En faktura fra december hører til december
        — også hvis pengene først kommer i marts. Skriver du kun betalingerne
        ind, havner omsætningen i det forkerte år, og både moms og skat bliver
        forkert.
      </p>

      {!aabenForm && (
        <button
          type="button"
          className="regnskab-miniknap"
          onClick={() => setAabenForm(true)}
        >
          + Ny faktura
        </button>
      )}

      {aabenForm && (
        <form action={gem} className="regnskab-import-felter">
          <label>
            Fakturanummer
            <input name="nummer" required placeholder="INV-003" />
          </label>
          <label>
            Fakturadato
            <input name="fakturadato" type="date" required />
          </label>
          <label>
            Kunde
            <input name="kunde" required placeholder="Firmanavn" />
          </label>
          <label>
            Kundens land
            <input name="land" required defaultValue="DK" maxLength={2} placeholder="DK" />
          </label>
          <label>
            Kundens momsnummer
            <input name="kundeMomsnr" placeholder="GB 208411146" />
          </label>
          <label>
            Ydelse
            <input name="ydelse" placeholder="Udviklingsarbejde" />
          </label>
          <label>
            Valuta
            <input name="valuta" defaultValue="DKK" maxLength={3} />
          </label>
          <label>
            Beløb uden moms
            <input name="beloeb" required inputMode="decimal" placeholder="32460,00" />
          </label>
          <label>
            Moms på fakturaen
            <input name="moms" inputMode="decimal" placeholder="0,00" />
          </label>
          <label>
            Kurs, hvis Nationalbanken svigter
            <input name="manuelKurs" inputMode="decimal" placeholder="udfyldes normalt ikke" />
          </label>

          <p className="regnskab-anvisning">
            Kursen hentes automatisk hos Nationalbanken for fakturadatoen. Det er
            den kurs, momsreglerne kræver — ikke den, banken senere vekslede til.
            Momsrubrikken foreslås ud fra kundens land: dansk kunde giver 25 %
            moms, en EU-virksomhed med momsnummer giver rubrik B, og alt uden
            for EU — herunder England — giver rubrik C.
          </p>

          <div className="regnskab-frist-handling">
            <button type="submit" disabled={travlt}>
              {travlt ? "Henter kurs …" : "Gem faktura"}
            </button>
            <button
              type="button"
              className="regnskab-miniknap"
              onClick={() => setAabenForm(false)}
            >
              Fortryd
            </button>
          </div>
        </form>
      )}

      {fejl && <div className="regnskab-advarsel"><p>{fejl}</p></div>}
      {kvittering && <p className="regnskab-anvisning">{kvittering}</p>}

      {fakturaer.length === 0 ? (
        <p className="regnskab-orakel">
          Der er ingen fakturaer endnu. Indtil de er lagt ind, opgøres salget ud
          fra bankposteringerne — og så er periodiseringen kun rigtig, hvis
          betaling og fakturering faldt i samme periode.
        </p>
      ) : (
        <ul className="regnskab-fakturaliste">
          {[...fakturaer].reverse().map((f) => {
            const kd = kursdifferencer.find((k) => k.fakturaId === f.id);
            const fremmed = f.valuta !== "DKK";
            return (
              <li key={f.id} className="regnskab-faktura">
                <div className="regnskab-faktura-hoved">
                  <span>
                    <span className="regnskab-faktura-nr">{f.nummer}</span>{" "}
                    <span className="regnskab-faktura-kunde">{f.kunde}</span>
                  </span>
                  <span className="regnskab-faktura-beloeb">
                    {kr(f.dkkOere + f.momsDkkOere)}
                  </span>
                </div>

                <div className="regnskab-faktura-meta">
                  <span>{pænDato(f.fakturadato)}</span>
                  <span>{f.land}{erEuLand(f.land) ? " · EU" : f.land === "DK" ? "" : " · uden for EU"}</span>
                  <span className="regnskab-faktura-rubrik">
                    {RUBRIK_TEKST[f.rubrik] ?? f.rubrik}
                  </span>
                  {f.kundeMomsnr && <span>{f.kundeMomsnr}</span>}
                </div>

                {fremmed && (
                  <p className="regnskab-faktura-kurs">
                    {(f.beloebOere / 100).toLocaleString("da-DK", {
                      minimumFractionDigits: 2,
                    })}{" "}
                    {f.valuta} × {f.kurs.toFixed(4)} ={" "}
                    <strong>{kr(f.dkkOere)}</strong>
                    {f.kursdato && f.kursdato !== f.fakturadato && (
                      <> — kurs fra {pænDato(f.kursdato)}, da fakturadatoen ikke var bankdag</>
                    )}
                    <Hjaelp
                      tekst={
                        "Beløbet er omregnet med Nationalbankens middelkurs på fakturadatoen. " +
                        "Momsbekendtgørelsen tillader kun Nationalbankens kurs, ECB-kursen eller toldkursen — " +
                        "den kurs, banken eller Wise senere vekslede til, kan ikke bruges. " +
                        "Forskellen mellem de to er i stedet en kursgevinst eller et kurstab, der opgøres for sig."
                      }
                    />
                  </p>
                )}

                {f.momsDkkOere > 0 && (
                  <p className="regnskab-faktura-kurs">
                    Heraf moms: <strong>{kr(f.momsDkkOere)}</strong> — statens penge,
                    ikke dine. Din omsætning på ordren er {kr(f.dkkOere)}.
                  </p>
                )}

                {kd && (
                  <p className="regnskab-faktura-kurs">
                    Kursdifference ved veksling:{" "}
                    <strong>
                      {kd.differenceOere >= 0 ? "+" : ""}
                      {kr(kd.differenceOere)}
                    </strong>{" "}
                    ({kd.differenceOere >= 0 ? "gevinst" : "tab"} i {kd.aar})
                    <Hjaelp
                      tekst={
                        "Fakturaen blev bogført til kursen på fakturadatoen. Da pengene kom ind og blev vekslet, " +
                        "stod valutaen anderledes. Forskellen er en kursgevinst eller et kurstab på fordringen. " +
                        "Er den samlede nettogevinst over 2.000 kr., skal den oplyses som kapitalindkomst i rubrik 39 " +
                        "for det år, vekslingen skete. Under grænsen skal den ikke oplyses."
                      }
                    />
                  </p>
                )}

                <div className="regnskab-frist-handling">
                  <button
                    type="button"
                    className="regnskab-miniknap"
                    onClick={async () => {
                      if (!confirm(`Slet ${f.nummer}? Det kan ikke fortrydes.`)) return;
                      await sletFakturaAction(f.id);
                    }}
                  >
                    Slet
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
