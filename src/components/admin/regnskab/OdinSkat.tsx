/**
 * Skattepanelet — årets resultat, AM-bidrag og et ærligt skatte-estimat,
 * plus fradrag pr. kategori og Odins anvisning af, hvad der skal i
 * forskudsopgørelsen. Server-komponent (ren visning).
 */
import Link from "next/link";
import type { SkatteOpgoerelse } from "@/lib/regnskab/skat";
import type { AarsSatser } from "@/lib/regnskab/satser";
import type { Indstillinger } from "@/lib/regnskab/typer";
import { kr, krRund } from "@/lib/regnskab/typer";
import { findKategori } from "@/lib/regnskab/kategorier";
import { OdinKpi } from "@/components/admin/OdinKpi";

export function OdinSkat({
  opgoerelse,
  sidsteAar,
  prKategori,
  satser,
  indstillinger,
}: {
  opgoerelse: SkatteOpgoerelse;
  sidsteAar: SkatteOpgoerelse | null;
  prKategori: { kategori: string; fradragOere: number; bruttoOere: number }[];
  satser: AarsSatser;
  indstillinger: Indstillinger;
}) {
  const o = opgoerelse;
  const maksBrutto = Math.max(1, ...prKategori.map((p) => p.bruttoOere));

  return (
    <>
      <div className="odin-kpis">
        <OdinKpi rune="ᚠ" label={`Omsætning ${o.aar}`} value={krRund(o.omsaetningOere)} />
        <OdinKpi rune="ᚢ" label="Fradragsudgifter" value={krRund(o.udgifterOere)} />
        <OdinKpi rune="ᛟ" label="Skattepligtigt resultat" value={krRund(o.resultatOere)} />
        <OdinKpi rune="ᚦ" label="Estimeret skat + AM" value={krRund(o.estimeretSkatOere)} />
        <OdinKpi
          rune="ᛜ"
          label="Marginal (estimat)"
          value={`${String(o.marginalPct).replace(".", ",")} %`}
        />
      </div>

      <div className="odin-grid">
        <div className="col-7">
          <section className="hud-panel" style={{ height: "100%" }}>
            <div className="hud-head">
              <span className="hud-label">
                <span className="hud-rune">ᚦ</span> Regnestykket — sådan når jeg frem
              </span>
              <span className="hud-meta">{o.aar} · estimat</span>
            </div>
            <dl className="regnskab-noegletal">
              <div>
                <dt>Omsætning (uden moms)</dt>
                <dd>{kr(o.omsaetningOere)}</dd>
              </div>
              <div>
                <dt>− Fradragsberettigede udgifter</dt>
                <dd>{kr(o.udgifterOere)}</dd>
              </div>
              <div className="regnskab-total">
                <dt>= Resultat (overskud af virksomhed)</dt>
                <dd>{kr(o.resultatOere)}</dd>
              </div>
              <div>
                <dt>− AM-bidrag ({satser.amBidragPct} %)</dt>
                <dd>{kr(o.amBidragOere)}</dd>
              </div>
              <div>
                <dt>= Personlig indkomst fra virksomheden</dt>
                <dd>{kr(o.efterAmOere)}</dd>
              </div>
              <div className="regnskab-total">
                <dt>Estimeret samlet skat af overskuddet</dt>
                <dd>{kr(o.estimeretSkatOere)}</dd>
              </div>
            </dl>
            {o.resultatOere < 0 && (
              <p className="regnskab-odin-note">
                ᚱ Underskud: kan som udgangspunkt modregnes i din lønindkomst på
                årsopgørelsen — se viden-basen om underskud, før du oplyser.
              </p>
            )}
            {o.topskatRamt && (
              <p className="regnskab-advarsel">
                ⚠ Med din løn lagt oveni når overskuddet op over mellemskattens
                grænse (
                {new Intl.NumberFormat("da-DK").format(satser.mellemskatGraenseKr)}{" "}
                kr. efter AM) — estimatet medregner 2026-reformens trin
                (mellem-/top-/top-topskat) af den del.
              </p>
            )}
            {o.uafklarede > 0 && (
              <p className="regnskab-advarsel">
                ⚠ {o.uafklarede} uafklarede posteringer i {o.aar} —{" "}
                <Link href="/admin/regnskab?del=odin">svar Odin</Link>, før du
                stoler på tallene.
              </p>
            )}
            <p className="hud-meta">
              Estimatet regner overskuddet som marginal indkomst oven på din løn
              {indstillinger.loenAarOere
                ? ` (${krRund(indstillinger.loenAarOere)}/år)`
                : " (løn ikke angivet under Opsætning)"}
              , med {String(indstillinger.kommuneskatPct ?? satser.kommuneskatGnsPct).replace(".", ",")}{" "}
              % kommuneskat og bundskat {String(satser.bundskatPct).replace(".", ",")} %.
              Personfradraget antages brugt af lønnen. Facit står i din
              forskudsopgørelse.
            </p>
          </section>
        </div>

        <div className="col-5">
          <section className="hud-panel" style={{ height: "100%" }}>
            <div className="hud-head">
              <span className="hud-label">
                <span className="hud-rune">ᚱ</span> Odins anvisning
              </span>
            </div>
            <ul className="regnskab-anvisning">
              <li>
                <strong>Forskudsopgørelsen:</strong> skriv forventet overskud (
                {krRund(Math.max(0, o.resultatOere))} lige nu) i felt{" "}
                <strong>221 „Overskud af virksomhed”</strong> på skat.dk →
                TastSelv → Forskudsopgørelsen. Så opkræves B-skat løbende, og du
                undgår restskat.
              </li>
              <li>
                <strong>Oplysningsskemaet</strong> (efter årets udløb): virksomhedens
                resultat oplyses i virksomhedsrubrikkerne — fuld gennemgang i{" "}
                <Link href="/admin/regnskab?del=viden">viden-basen → Skat</Link>.
              </li>
              <li>
                <strong>Læg til side:</strong> en tommelfingerregel er at
                reservere ~{Math.max(30, Math.min(56, Math.round(o.marginalPct || 40)))}{" "}
                % af overskuddet til skat på en separat konto.
              </li>
              {sidsteAar && sidsteAar.antalPosteringer > 0 && (
                <li>
                  <strong>{sidsteAar.aar}:</strong> resultat{" "}
                  {krRund(sidsteAar.resultatOere)} — husk oplysningsskemaets frist
                  1. juli {sidsteAar.aar + 1}.
                </li>
              )}
            </ul>
          </section>
        </div>
      </div>

      <section className="hud-panel">
        <div className="hud-head">
          <span className="hud-label">
            <span className="hud-rune">ᚢ</span> Fradrag pr. kategori · {o.aar}
          </span>
          <span className="hud-meta">brutto → fradragsberettiget</span>
        </div>
        {prKategori.length === 0 ? (
          <p className="admin-tom">Ingen firma-udgifter registreret i {o.aar} endnu.</p>
        ) : (
          <ul className="hud-bars">
            {prKategori.map((p) => {
              const k = findKategori(
                p.kategori === "(ukategoriseret)" ? undefined : p.kategori,
              );
              return (
                <li key={p.kategori} className="hud-bar">
                  <span
                    className="hud-bar-fill"
                    style={{
                      width: `${Math.max((p.bruttoOere / maksBrutto) * 100, 3)}%`,
                    }}
                    aria-hidden="true"
                  />
                  <span className="hud-bar-navn">
                    {k ? `${k.emoji} ${k.navn}` : "❔ Ukategoriseret"}
                  </span>
                  <span className="hud-bar-tal">
                    {krRund(p.bruttoOere)} → {krRund(p.fradragOere)}
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
