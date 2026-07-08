/**
 * Regnskabets forside — Alfaderens overblik: årets tal, momsstatus,
 * de nærmeste frister og hvad der venter på dit ord.
 * Server-komponent (ren visning).
 */
import Link from "next/link";
import type { Frist } from "@/lib/regnskab/frister";
import { dageTil } from "@/lib/regnskab/frister";
import type { MomsOpgoerelse } from "@/lib/regnskab/moms";
import type { SkatteOpgoerelse } from "@/lib/regnskab/skat";
import type { Indstillinger, Transaktion } from "@/lib/regnskab/typer";
import { kr, krRund } from "@/lib/regnskab/typer";
import { findKategori } from "@/lib/regnskab/kategorier";
import { OdinKpi } from "@/components/admin/OdinKpi";

const fmtDato = new Intl.DateTimeFormat("da-DK", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Europe/Copenhagen",
});

function pænDato(iso: string): string {
  return fmtDato.format(new Date(`${iso}T12:00:00Z`));
}

export function OdinRegnskabOversigt({
  indstillinger,
  skat,
  moms,
  frister,
  idag,
  uafklarede,
  antalTransaktioner,
  transaktioner,
}: {
  indstillinger: Indstillinger;
  skat: SkatteOpgoerelse;
  moms: MomsOpgoerelse | null;
  frister: Frist[];
  idag: string;
  uafklarede: number;
  antalTransaktioner: number;
  transaktioner: Transaktion[];
}) {
  const naeste = frister[0];

  return (
    <>
      {/* Odins hilsen */}
      <section className="hud-panel hud-panel-accent">
        <div className="hud-head">
          <span className="hud-label">
            <span className="hud-rune">ᚠ</span> Alfaderens overblik · {skat.aar}
          </span>
          <span className="hud-meta">{indstillinger.virksomhedsnavn}</span>
        </div>
        <p className="regnskab-orakel">
          {antalTransaktioner === 0 ? (
            <>
              Bøgerne er tomme endnu. Drag til <Link href="/admin/regnskab?del=import">Import</Link>{" "}
              og læg dit første kontoudtog på alteret — så tager jeg det derfra.
            </>
          ) : uafklarede > 0 ? (
            <>
              {uafklarede} postering{uafklarede === 1 ? "" : "er"} venter på dit ord.{" "}
              <Link href="/admin/regnskab?del=odin">Lad mig spørge dig</Link> — hvert svar
              gør din moms og dine fradrag skarpere, og jeg husker dine svar for evigt.
            </>
          ) : (
            <>
              Alle posteringer er afklarede. Bøgerne stemmer, ravnene hviler.
              {naeste && (
                <>
                  {" "}Næste pligt: <strong>{naeste.titel}</strong> om{" "}
                  {dageTil(naeste.dato, idag)} dage.
                </>
              )}
            </>
          )}
        </p>
      </section>

      {/* KPI-stribe: årets firma-tal */}
      <div className="odin-kpis">
        <OdinKpi rune="ᚠ" label="Omsætning (netto)" value={krRund(skat.omsaetningOere)} />
        <OdinKpi rune="ᚢ" label="Fradragsudgifter" value={krRund(skat.udgifterOere)} />
        <OdinKpi rune="ᛟ" label="Resultat før skat" value={krRund(skat.resultatOere)} />
        <OdinKpi
          rune="ᚦ"
          label="Estimeret skat"
          value={krRund(skat.estimeretSkatOere)}
        />
        <OdinKpi
          rune="ᛏ"
          label="Momstilsvar (periode)"
          value={moms ? krRund(moms.tilsvarOere) : "—"}
        />
      </div>

      <div className="odin-grid">
        {/* Nærmeste frister */}
        <div className="col-7">
          <section className="hud-panel" style={{ height: "100%" }}>
            <div className="hud-head">
              <span className="hud-label">
                <span className="hud-rune">ᛉ</span> Vagttårnet — nærmeste frister
              </span>
              <Link className="hud-meta" href="/admin/regnskab?del=frister">
                alle frister →
              </Link>
            </div>
            {frister.length === 0 ? (
              <p className="admin-tom">Ingen kommende frister i vinduet. Freden råder.</p>
            ) : (
              <ul className="regnskab-fristliste">
                {frister.map((f) => {
                  const d = dageTil(f.dato, idag);
                  return (
                    <li key={f.id}>
                      <span
                        className={`regnskab-frist-taeller${d <= 7 ? " haster" : d <= 30 ? " snart" : ""}`}
                      >
                        {d === 0 ? "I DAG" : `${d} dage`}
                      </span>
                      <span className="regnskab-frist-info">
                        <strong>{f.titel}</strong>
                        <span className="hud-meta">{pænDato(f.dato)}</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>

        {/* Momsstatus */}
        <div className="col-5">
          <section className="hud-panel" style={{ height: "100%" }}>
            <div className="hud-head">
              <span className="hud-label">
                <span className="hud-rune">ᛏ</span> Moms — {moms ? moms.periode.label : "…"}
              </span>
              <Link className="hud-meta" href="/admin/regnskab?del=moms">
                momspanel →
              </Link>
            </div>
            {moms ? (
              <dl className="regnskab-noegletal">
                <div>
                  <dt>Salgsmoms</dt>
                  <dd>{kr(moms.salgsmomsOere)}</dd>
                </div>
                <div>
                  <dt>Købsmoms</dt>
                  <dd>{kr(moms.koebsmomsOere)}</dd>
                </div>
                <div>
                  <dt>Moms af udenlandske køb</dt>
                  <dd>{kr(moms.ydelseskoebsmomsOere)}</dd>
                </div>
                <div className="regnskab-total">
                  <dt>{moms.tilsvarOere >= 0 ? "Du skylder Skat" : "Skat skylder dig"}</dt>
                  <dd>{kr(Math.abs(moms.tilsvarOere))}</dd>
                </div>
              </dl>
            ) : (
              <p className="admin-tom">Ingen momsperiode endnu.</p>
            )}
          </section>
        </div>
      </div>

      {/* Seneste posteringer */}
      <section className="hud-panel">
        <div className="hud-head">
          <span className="hud-label">
            <span className="hud-rune">ᛒ</span> Seneste posteringer
          </span>
          <span className="hud-meta">
            <Link href="/admin/regnskab?del=firma">firma</Link>
            {" · "}
            <Link href="/admin/regnskab?del=privat">privat</Link>
          </span>
        </div>
        {transaktioner.length === 0 ? (
          <p className="admin-tom">Ingen posteringer endnu — start med en import.</p>
        ) : (
          <ul className="regnskab-posteringsliste">
            {transaktioner.map((t) => {
              const k = findKategori(t.kategori);
              return (
                <li key={t.id}>
                  <span className="regnskab-post-emoji" aria-hidden="true">
                    {k?.emoji ?? (t.afklaret ? "✅" : "❔")}
                  </span>
                  <span className="regnskab-post-tekst">
                    <strong>{t.tekst}</strong>
                    <span className="hud-meta">
                      {t.dato} · {t.konto === "firma" ? "Firma" : "Privat"}
                      {k ? ` · ${k.navn}` : " · ukategoriseret"}
                    </span>
                  </span>
                  <span
                    className={`regnskab-post-beloeb${t.beloebOere >= 0 ? " plus" : ""}`}
                  >
                    {kr(t.beloebOere)}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </>
  );
}
