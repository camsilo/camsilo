"use client";

/**
 * Statistik-fanen — Odins ravneblik på pengestrømmen: hvad der er brugt,
 * på hvad, hos hvem, måned for måned — plus detektoren for faste
 * abonnementer. Alle tal beregnes lokalt af lib/regnskab/statistik.ts;
 * overførsler (hævninger, skat, opsparing) holdes ude af forbruget.
 */
import { useMemo, useState } from "react";
import type { Transaktion } from "@/lib/regnskab/typer";
import { kr, krRund } from "@/lib/regnskab/typer";
import {
  beregnStatistik,
  kategoriEtiket,
  type StatKonto,
} from "@/lib/regnskab/statistik";
import { OdinKpi } from "@/components/admin/OdinKpi";
import { PeriodeVaelger } from "@/components/admin/regnskab/PeriodeVaelger";
import { intervalFor, type PeriodeValgId } from "@/lib/regnskab/perioder";

const MD_KORT = [
  "jan", "feb", "mar", "apr", "maj", "jun",
  "jul", "aug", "sep", "okt", "nov", "dec",
];

export function OdinStatistik({
  transaktioner,
  idag,
  foersteFakturadato,
}: {
  transaktioner: Transaktion[];
  idag: string;
  foersteFakturadato?: string;
}) {
  const [konto, setKonto] = useState<StatKonto>("begge");
  const [periode, setPeriode] = useState<PeriodeValgId>("iaar");

  const aeldste = useMemo(
    () => transaktioner.reduce((m, t) => (t.dato < m ? t.dato : m), idag),
    [transaktioner, idag],
  );

  const interval = useMemo(
    () => intervalFor(periode, idag, aeldste, foersteFakturadato),
    [periode, idag, aeldste, foersteFakturadato],
  );

  const stat = useMemo(() => {
    // 12-timers-valget skærer på importtidspunkt, fordi bankposteringer
    // ikke bærer et klokkeslæt. De øvrige valg skærer på bogføringsdato.
    const grundlag = interval.fraTs
      ? transaktioner.filter((t) => t.ts >= interval.fraTs!)
      : transaktioner;
    return beregnStatistik(grundlag, konto, interval.fra, interval.til);
  }, [transaktioner, konto, interval]);

  const maksKategori = Math.max(1, ...stat.kategorier.map((k) => k.udOere));
  const maksForretning = Math.max(1, ...stat.forretninger.map((f) => f.udOere));
  const abonnementSum = stat.abonnementer.reduce((a, x) => a + x.prMaanedOere, 0);

  return (
    <>
      {/* Filtre */}
      <section className="hud-panel">
        <div className="regnskab-filterbjaelke">
          <div className="regnskab-bogvalg" role="group" aria-label="Bog">
            {(
              [
                ["begge", "🔱 Begge bøger"],
                ["privat", "🏠 Privat"],
                ["firma", "🏢 Firma"],
              ] as [StatKonto, string][]
            ).map(([id, navn]) => (
              <button
                key={id}
                type="button"
                className={`regnskab-kategori${konto === id ? " valgt" : ""}`}
                onClick={() => setKonto(id)}
              >
                {navn}
              </button>
            ))}
          </div>
          <PeriodeVaelger valgt={periode} onVaelg={setPeriode} interval={interval} />
        </div>
      </section>

      {stat.antalPosteringer === 0 ? (
        <section className="hud-panel">
          <p className="admin-tom">
            Ingen posteringer i perioden — importér et kontoudtog, så tegner
            ravnene billedet.
          </p>
        </section>
      ) : (
        <>
          {/* KPI-stribe */}
          <div className="odin-kpis">
            <OdinKpi rune="ᚢ" label="Forbrug i perioden" value={krRund(stat.forbrugOere)} />
            <OdinKpi rune="ᚠ" label="Indtægter" value={krRund(stat.indtaegterOere)} />
            <OdinKpi rune="ᛃ" label="Forbrug pr. aktiv måned" value={krRund(stat.gnsPrMaanedOere)} />
            <OdinKpi
              rune="ᛜ"
              label="Faste abonnementer"
              value={`${krRund(abonnementSum)}/md.`}
            />
            <OdinKpi
              rune="ᚦ"
              label="Største enkeltudgift"
              value={stat.stoersteUdgift ? krRund(-stat.stoersteUdgift.beloebOere) : "—"}
            />
          </div>

          {/* Måned for måned */}
          <section className="hud-panel">
            <div className="hud-head">
              <span className="hud-label">
                <span className="hud-rune">ᛉ</span> Måned for måned
              </span>
              <span className="hud-meta odin-legende">
                <i className="odin-prik odin-prik-ember" /> Forbrug
                <i className="odin-prik odin-prik-seid" /> Indtægter
              </span>
            </div>
            <MaanedsGraf maaneder={stat.maaneder} />
          </section>

          <div className="odin-grid">
            {/* Kategorier */}
            <div className="col-7">
              <section className="hud-panel" style={{ height: "100%" }}>
                <div className="hud-head">
                  <span className="hud-label">
                    <span className="hud-rune">ᚢ</span> Hvad pengene gik til
                  </span>
                  <span className="hud-meta">{stat.kategorier.length} kategorier</span>
                </div>
                {stat.kategorier.length === 0 ? (
                  <p className="admin-tom">Ingen udgifter i perioden.</p>
                ) : (
                  <ul className="hud-bars">
                    {stat.kategorier.map((k) => (
                      <li key={k.kategori} className="hud-bar">
                        <span
                          className="hud-bar-fill"
                          style={{
                            width: `${Math.max((k.udOere / maksKategori) * 100, 3)}%`,
                          }}
                          aria-hidden="true"
                        />
                        <span className="hud-bar-navn" title={kategoriEtiket(k.kategori)}>
                          {kategoriEtiket(k.kategori)}
                        </span>
                        <span className="hud-bar-tal">
                          {krRund(k.udOere)}
                          <span style={{ color: "var(--faint)", marginLeft: 6 }}>
                            ({String(k.andelPct).replace(".", ",")} % · {k.antal} stk.)
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                {stat.overfoerslerUdOere > 0 && (
                  <p className="hud-meta" style={{ marginTop: 10 }}>
                    Dertil {kr(stat.overfoerslerUdOere)} i overførsler
                    (hævninger, skat, opsparing …) — flyttet, ikke forbrugt.
                  </p>
                )}
              </section>
            </div>

            {/* Top-forretninger */}
            <div className="col-5">
              <section className="hud-panel" style={{ height: "100%" }}>
                <div className="hud-head">
                  <span className="hud-label">
                    <span className="hud-rune">ᛗ</span> Hvor pengene endte
                  </span>
                  <span className="hud-meta">top {stat.forretninger.length}</span>
                </div>
                {stat.forretninger.length === 0 ? (
                  <p className="admin-tom">Ingen udgifter i perioden.</p>
                ) : (
                  <ul className="hud-bars">
                    {stat.forretninger.map((f) => (
                      <li key={f.navn} className="hud-bar">
                        <span
                          className="hud-bar-fill"
                          style={{
                            width: `${Math.max((f.udOere / maksForretning) * 100, 3)}%`,
                          }}
                          aria-hidden="true"
                        />
                        <span className="hud-bar-navn" title={f.navn}>
                          {f.navn}
                        </span>
                        <span className="hud-bar-tal">
                          {krRund(f.udOere)}
                          <span style={{ color: "var(--faint)", marginLeft: 6 }}>
                            ({f.antal})
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>
          </div>

          {/* Abonnementer */}
          <section className="hud-panel">
            <div className="hud-head">
              <span className="hud-label">
                <span className="hud-rune">ᛜ</span> Faste abonnementer — ravnene har
                spottet mønstre
              </span>
              {stat.abonnementer.length > 0 && (
                <span className="hud-meta">
                  {krRund(abonnementSum)}/md. ≈ {krRund(abonnementSum * 12)}/år
                </span>
              )}
            </div>
            {stat.abonnementer.length === 0 ? (
              <p className="admin-tom">
                Ingen tilbagevendende træk fundet endnu — der skal mindst tre
                måneders historik til, før mønstret træder frem.
              </p>
            ) : (
              <>
                <ul className="regnskab-posteringsliste">
                  {stat.abonnementer.map((a) => (
                    <li key={a.navn}>
                      <span className="regnskab-post-emoji" aria-hidden="true">
                        🔁
                      </span>
                      <span className="regnskab-post-tekst">
                        <strong>{a.navn}</strong>
                        <span className="hud-meta">
                          {a.antal} træk over {a.maaneder} måneder · senest {a.senest}
                          {a.kategori ? ` · ${kategoriEtiket(a.kategori)}` : ""}
                        </span>
                      </span>
                      <span className="regnskab-post-beloeb">
                        {kr(a.prMaanedOere)}/md.
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="regnskab-odin-note">
                  ᚱ Årsprisen for dine faste træk er ca.{" "}
                  {krRund(abonnementSum * 12)}. Løb listen igennem én gang i
                  kvartalet — abonnementer, ingen husker, er drauger, der æder
                  af kisten.
                </p>
              </>
            )}
          </section>
        </>
      )}
    </>
  );
}

/** Kompakt søjlediagram: forbrug (ember) og indtægter (seid) pr. måned. */
function MaanedsGraf({
  maaneder,
}: {
  maaneder: { maaned: string; indOere: number; udOere: number }[];
}) {
  // Vis højst de seneste 24 måneder, så søjlerne ikke bliver hårfine.
  const vis = maaneder.slice(-24);
  const maks = Math.max(1, ...vis.flatMap((m) => [m.indOere, m.udOere]));
  const B = 900; // viewBox-bredde
  const H = 190;
  const bund = 22;
  const top = 8;
  const grafH = H - bund - top;
  const kolonne = B / Math.max(vis.length, 1);
  const soejle = Math.min(kolonne * 0.32, 26);
  const labelHver = vis.length > 14 ? Math.ceil(vis.length / 12) : 1;

  return (
    <div className="regnskab-graf-wrap">
      <svg
        viewBox={`0 0 ${B} ${H}`}
        className="regnskab-graf"
        role="img"
        aria-label="Forbrug og indtægter pr. måned"
      >
        {/* bundlinje */}
        <line
          x1={0}
          y1={H - bund}
          x2={B}
          y2={H - bund}
          stroke="var(--hud-line-soft)"
          strokeWidth={1}
        />
        {vis.map((m, i) => {
          const cx = i * kolonne + kolonne / 2;
          const udH = (m.udOere / maks) * grafH;
          const indH = (m.indOere / maks) * grafH;
          const mdNr = Number(m.maaned.slice(5, 7)) - 1;
          return (
            <g key={m.maaned}>
              <rect
                x={cx - soejle - 1.5}
                y={H - bund - udH}
                width={soejle}
                height={Math.max(udH, m.udOere > 0 ? 2 : 0)}
                fill="var(--ember)"
                opacity={0.85}
                rx={1.5}
              >
                <title>{`${MD_KORT[mdNr]} ${m.maaned.slice(0, 4)}: forbrug ${kr(m.udOere)}`}</title>
              </rect>
              <rect
                x={cx + 1.5}
                y={H - bund - indH}
                width={soejle}
                height={Math.max(indH, m.indOere > 0 ? 2 : 0)}
                fill="var(--seid)"
                opacity={0.75}
                rx={1.5}
              >
                <title>{`${MD_KORT[mdNr]} ${m.maaned.slice(0, 4)}: indtægter ${kr(m.indOere)}`}</title>
              </rect>
              {i % labelHver === 0 && (
                <text
                  x={cx}
                  y={H - 6}
                  textAnchor="middle"
                  className="regnskab-graf-label"
                >
                  {MD_KORT[mdNr]}
                  {mdNr === 0 ? ` ${m.maaned.slice(2, 4)}` : ""}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
