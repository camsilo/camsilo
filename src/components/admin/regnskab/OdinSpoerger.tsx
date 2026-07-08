"use client";

/**
 * Odin spørger — regnskabets hjerte. Alfaderen tager én uafklaret postering
 * ad gangen: "Hvad købte du her? Kan det trækkes fra?" Dit svar sætter
 * kategori, moms og fradrag — og med "husk" lærer Odin forretningen at kende,
 * afklarer alle lignende posteringer og spørger aldrig om den igen.
 */
import { useMemo, useState } from "react";
import type { Forslag } from "@/lib/regnskab/regler";
import { foreslaaMoenster } from "@/lib/regnskab/regler";
import type { MomsType, Transaktion } from "@/lib/regnskab/typer";
import { kr } from "@/lib/regnskab/typer";
import { findKategori, kategorierFor, type Kategori } from "@/lib/regnskab/kategorier";
import { springOverAction, svarOdinAction } from "@/app/admin/regnskab/actions";

export type OdinSpoergsmaal = {
  transaktion: Transaktion;
  forslag: Forslag | null;
};

const MOMS_VALG: { id: MomsType; navn: string }[] = [
  { id: "koebsmoms", navn: "Dansk køb med 25 % moms" },
  { id: "omvendt", navn: "Køb i andet EU-land — omvendt betalingspligt (rubrik A)" },
  { id: "omvendt3land", navn: "Køb uden for EU (fx USA) — omvendt betalingspligt" },
  { id: "salgsmoms", navn: "Dansk salg med 25 % moms" },
  { id: "momsfri", navn: "Momsfrit (forsikring, gebyr, renter …)" },
  { id: "udenfor", navn: "Uden for momsregnskabet" },
];

const fmtDato = new Intl.DateTimeFormat("da-DK", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: "Europe/Copenhagen",
});

export function OdinSpoerger({
  koe,
  iAltUafklarede,
}: {
  koe: OdinSpoergsmaal[];
  iAltUafklarede: number;
}) {
  const [besvarede, setBesvarede] = useState<Set<string>>(new Set());
  const [travlt, setTravlt] = useState(false);
  const [fejl, setFejl] = useState("");
  const [sidsteBesked, setSidsteBesked] = useState("");
  const [svaretIAlt, setSvaretIAlt] = useState(0);

  const tilbage = useMemo(
    () => koe.filter((q) => !besvarede.has(q.transaktion.id)),
    [koe, besvarede],
  );
  const aktuel = tilbage[0];

  // Valg-tilstand for den aktuelle postering
  const [valgtKategori, setValgtKategori] = useState<string | null>(null);
  const [momsType, setMomsType] = useState<MomsType | null>(null);
  const [fradragPct, setFradragPct] = useState<number | null>(null);
  const [momsFradragPct, setMomsFradragPct] = useState<number | null>(null);
  const [visAvanceret, setVisAvanceret] = useState(false);
  const [husk, setHusk] = useState(true);
  const [moenster, setMoenster] = useState<string | null>(null);
  const [aktivtId, setAktivtId] = useState<string | null>(null);

  if (!aktuel) {
    return (
      <section className="hud-panel hud-panel-accent">
        <div className="hud-head">
          <span className="hud-label">
            <span className="hud-rune">ᚨ</span> Odin spørger
          </span>
        </div>
        <p className="regnskab-orakel">
          {iAltUafklarede === 0 && svaretIAlt === 0
            ? "Intet venter på dit ord — alle posteringer er afklarede. Ravnene melder: bøgerne stemmer. ✦"
            : `Vel talt. ${svaretIAlt > 0 ? `${svaretIAlt} svar givet — ` : ""}køen er tom for nu. Importér flere kontoudtog, så spørger jeg igen.`}
        </p>
      </section>
    );
  }

  const t = aktuel.transaktion;

  // Nulstil valg når en ny postering toner frem.
  if (aktivtId !== t.id) {
    setAktivtId(t.id);
    const startKategori = t.kategori ?? aktuel.forslag?.kategori ?? null;
    setValgtKategori(startKategori);
    const k = findKategori(startKategori ?? undefined);
    setMomsType(t.momsType ?? aktuel.forslag?.momsType ?? k?.momsType ?? null);
    setFradragPct(t.fradragPct ?? aktuel.forslag?.fradragPct ?? k?.fradragPct ?? null);
    setMomsFradragPct(
      t.momsFradragPct ?? aktuel.forslag?.momsFradragPct ?? k?.momsFradragPct ?? null,
    );
    setVisAvanceret(false);
    setHusk(true);
    setMoenster(foreslaaMoenster(t.tekst));
    setFejl("");
    return null; // næste render har konsistente valg
  }

  const erUdgift = t.beloebOere < 0;
  const kategorier = kategorierFor(t.konto).filter(
    (k) =>
      k.retning === "begge" || k.retning === (erUdgift ? "udgift" : "indtaegt"),
  );
  const valgt = findKategori(valgtKategori ?? undefined);

  function vaelgKategori(k: Kategori) {
    setValgtKategori(k.id);
    // Kategoriens defaults lægges på — kan justeres under "avanceret".
    setMomsType(k.momsType ?? (erUdgift ? "koebsmoms" : "salgsmoms"));
    setFradragPct(k.fradragPct ?? 100);
    setMomsFradragPct(k.momsFradragPct ?? 100);
  }

  async function bekraeft() {
    if (!valgtKategori || travlt) return;
    setTravlt(true);
    setFejl("");
    const r = await svarOdinAction({
      id: t.id,
      kategori: valgtKategori,
      ...(t.konto === "firma"
        ? {
            momsType: momsType ?? undefined,
            fradragPct: fradragPct ?? undefined,
            momsFradragPct: momsFradragPct ?? undefined,
          }
        : { skatteRelevant: valgt?.skatteRelevant ?? false }),
      husk,
      huskMoenster: husk ? (moenster ?? undefined) : undefined,
    });
    setTravlt(false);
    if (!r.ok) {
      setFejl(r.fejl);
      return;
    }
    const ekstra = r.data?.ogsaaAfklaret ?? 0;
    setSidsteBesked(
      ekstra > 0
        ? `Husket. Jeg afklarede også ${ekstra} lignende postering${ekstra === 1 ? "" : "er"} med samme svar.`
        : "Noteret i bøgerne.",
    );
    setSvaretIAlt((n) => n + 1 + ekstra);
    setBesvarede((s) => new Set(s).add(t.id));
  }

  async function springOver() {
    if (travlt) return;
    setTravlt(true);
    const r = await springOverAction(t.id);
    setTravlt(false);
    if (!r.ok) {
      setFejl(r.fejl);
      return;
    }
    setSidsteBesked("Sprunget over — den står som afklaret uden ændringer.");
    setBesvarede((s) => new Set(s).add(t.id));
  }

  // Antal tilbage — robust både før og efter server-revalidering (lokalt
  // besvarede, der endnu ikke er revalideret væk, trækkes fra prop-tallet).
  const tilbageIAlt = Math.max(
    tilbage.length,
    iAltUafklarede - (koe.length - tilbage.length),
  );

  return (
    <section className="hud-panel hud-panel-accent">
      <div className="hud-head">
        <span className="hud-label">
          <span className="hud-rune">ᚨ</span> Odin spørger · {tilbageIAlt} tilbage
        </span>
        <span className="hud-meta">
          {t.konto === "firma" ? "FIRMA-BOGEN" : "PRIVAT-BOGEN"}
        </span>
      </div>

      {sidsteBesked && (
        <p className="regnskab-odin-kvad" role="status">
          ᛗ {sidsteBesked}
        </p>
      )}

      {/* Posteringen */}
      <div className="regnskab-spoergsmaal">
        <p className="regnskab-orakel">
          {erUdgift ? (
            <>
              Du gav <strong>{kr(Math.abs(t.beloebOere))}</strong> til{" "}
              <strong>«{t.tekst}»</strong>{" "}
              {fmtDato.format(new Date(`${t.dato}T12:00:00Z`))}.
              {t.konto === "firma"
                ? " Hvad var det — og kan det trækkes fra? Vælg, så sætter jeg moms og fradrag."
                : " Hvor hører det hjemme i dit private overblik?"}
            </>
          ) : (
            <>
              Der kom <strong>{kr(t.beloebOere)}</strong> ind:{" "}
              <strong>«{t.tekst}»</strong>{" "}
              {fmtDato.format(new Date(`${t.dato}T12:00:00Z`))}.
              {t.konto === "firma"
                ? " Er det salg med moms — eller noget andet?"
                : " Hvad er det for en indtægt?"}
            </>
          )}
        </p>
        {aktuel.forslag && !t.kategori && (
          <p className="hud-meta">
            Mit bud: {findKategori(aktuel.forslag.kategori)?.emoji}{" "}
            {findKategori(aktuel.forslag.kategori)?.navn} — men du har det sidste ord.
          </p>
        )}
      </div>

      {/* Kategori-valg */}
      <div className="regnskab-kategorigrid" role="group" aria-label="Vælg kategori">
        {kategorier.map((k) => (
          <button
            key={k.id}
            type="button"
            className={`regnskab-kategori${k.id === valgtKategori ? " valgt" : ""}`}
            onClick={() => vaelgKategori(k)}
          >
            <span aria-hidden="true">{k.emoji}</span> {k.navn}
          </button>
        ))}
      </div>

      {/* Odins note om den valgte kategori */}
      {valgt?.odinNote && (
        <p className="regnskab-odin-note">
          <span aria-hidden="true">ᚱ</span> {valgt.odinNote}
        </p>
      )}

      {/* Moms & fradrag (firma) */}
      {t.konto === "firma" && valgtKategori && (
        <div className="regnskab-avanceret">
          <button
            type="button"
            className="admin-knap regnskab-avanceret-knap"
            onClick={() => setVisAvanceret(!visAvanceret)}
            aria-expanded={visAvanceret}
          >
            {visAvanceret ? "▾" : "▸"} Moms & fradrag —{" "}
            {MOMS_VALG.find((m) => m.id === momsType)?.navn ?? "standard"} ·{" "}
            {fradragPct ?? 100} % fradrag
          </button>
          {visAvanceret && (
            <div className="regnskab-avanceret-felter">
              <label className="kontakt-felt">
                <span>Momsbehandling</span>
                <select
                  value={momsType ?? "koebsmoms"}
                  onChange={(e) => setMomsType(e.target.value as MomsType)}
                >
                  {MOMS_VALG.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.navn}
                    </option>
                  ))}
                </select>
              </label>
              <label className="kontakt-felt">
                <span>Skattefradrag (% af udgiften)</span>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={fradragPct ?? 100}
                  onChange={(e) => setFradragPct(Number(e.target.value))}
                />
              </label>
              <label className="kontakt-felt">
                <span>Momsfradrag (% af momsen)</span>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={momsFradragPct ?? 100}
                  onChange={(e) => setMomsFradragPct(Number(e.target.value))}
                />
              </label>
            </div>
          )}
        </div>
      )}

      {/* Husk forretningen */}
      <label className="regnskab-husk">
        <input
          type="checkbox"
          checked={husk}
          onChange={(e) => setHusk(e.target.checked)}
        />
        <span>
          Husk mit svar for alt der matcher{" "}
          <input
            type="text"
            className="regnskab-husk-moenster"
            value={moenster ?? ""}
            onChange={(e) => setMoenster(e.target.value)}
            aria-label="Mønster Odin skal huske"
            disabled={!husk}
          />
        </span>
      </label>

      {fejl && <p className="admin-fejl">{fejl}</p>}

      <div className="besked-handlinger">
        <button
          type="button"
          className="admin-knap admin-knap-primaer"
          onClick={bekraeft}
          disabled={!valgtKategori || travlt}
        >
          {travlt ? "Skriver i bøgerne …" : "Sådan skal det stå ✓"}
        </button>
        <button
          type="button"
          className="admin-knap"
          onClick={springOver}
          disabled={travlt}
        >
          Spring over
        </button>
      </div>
    </section>
  );
}
