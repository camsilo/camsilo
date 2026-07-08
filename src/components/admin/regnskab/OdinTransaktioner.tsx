"use client";

/**
 * Posteringslisten for én bog — søg, filtrér på kategori/status, se måned
 * for måned med sumlinjer. Herfra kan en postering genåbnes, så Odin
 * spørger igen (fx hvis et svar fortrydes).
 */
import { useMemo, useState } from "react";
import type { Konto, Transaktion } from "@/lib/regnskab/typer";
import { kr } from "@/lib/regnskab/typer";
import { findKategori, kategorierFor } from "@/lib/regnskab/kategorier";
import { genaabnAction } from "@/app/admin/regnskab/actions";

const MD_NAVNE = [
  "Januar", "Februar", "Marts", "April", "Maj", "Juni",
  "Juli", "August", "September", "Oktober", "November", "December",
];

const MOMS_KORT: Record<string, string> = {
  salgsmoms: "salgsmoms",
  koebsmoms: "købsmoms",
  omvendt: "omvendt betalingspligt (EU)",
  omvendt3land: "omvendt betalingspligt (uden for EU)",
  momsfri: "momsfri",
  udenfor: "uden for moms",
};

export function OdinTransaktioner({
  konto,
  transaktioner,
}: {
  konto: Konto;
  transaktioner: Transaktion[];
}) {
  const [soeg, setSoeg] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState("");
  const [kunUafklarede, setKunUafklarede] = useState(false);
  const [travltId, setTravltId] = useState<string | null>(null);

  const kategorier = kategorierFor(konto);

  const filtrerede = useMemo(() => {
    const s = soeg.trim().toLowerCase();
    return transaktioner.filter((t) => {
      if (kunUafklarede && t.afklaret) return false;
      if (kategoriFilter && t.kategori !== kategoriFilter) return false;
      if (s && !t.tekst.toLowerCase().includes(s) && !t.dato.includes(s))
        return false;
      return true;
    });
  }, [transaktioner, soeg, kategoriFilter, kunUafklarede]);

  // Gruppér pr. måned (nyeste først — listen er allerede sorteret).
  const grupper = useMemo(() => {
    const m = new Map<string, Transaktion[]>();
    for (const t of filtrerede) {
      const noegle = t.dato.slice(0, 7);
      const liste = m.get(noegle) ?? [];
      liste.push(t);
      m.set(noegle, liste);
    }
    return [...m.entries()];
  }, [filtrerede]);

  const sumInd = filtrerede.reduce(
    (a, t) => a + (t.beloebOere > 0 ? t.beloebOere : 0),
    0,
  );
  const sumUd = filtrerede.reduce(
    (a, t) => a + (t.beloebOere < 0 ? -t.beloebOere : 0),
    0,
  );

  async function genaabn(id: string) {
    setTravltId(id);
    await genaabnAction(id);
    setTravltId(null);
  }

  return (
    <section className="hud-panel">
      <div className="hud-head">
        <span className="hud-label">
          <span className="hud-rune">{konto === "firma" ? "ᚠ" : "ᛖ"}</span>{" "}
          {konto === "firma" ? "Firma-bogen" : "Privat-bogen"}
        </span>
        <span className="hud-meta">
          {filtrerede.length} posteringer · ind {kr(sumInd)} · ud {kr(sumUd)}
        </span>
      </div>

      <div className="regnskab-filterbjaelke">
        <input
          type="search"
          className="admin-felt"
          placeholder="Søg i tekst eller dato …"
          value={soeg}
          onChange={(e) => setSoeg(e.target.value)}
          aria-label="Søg i posteringer"
        />
        <select
          className="admin-felt"
          value={kategoriFilter}
          onChange={(e) => setKategoriFilter(e.target.value)}
          aria-label="Filtrér på kategori"
        >
          <option value="">Alle kategorier</option>
          {kategorier.map((k) => (
            <option key={k.id} value={k.id}>
              {k.emoji} {k.navn}
            </option>
          ))}
        </select>
        <label className="regnskab-tjek">
          <input
            type="checkbox"
            checked={kunUafklarede}
            onChange={(e) => setKunUafklarede(e.target.checked)}
          />
          Kun uafklarede
        </label>
      </div>

      {grupper.length === 0 ? (
        <p className="admin-tom">
          {transaktioner.length === 0
            ? "Bogen er tom — importér et kontoudtog først."
            : "Ingen posteringer matcher filteret."}
        </p>
      ) : (
        grupper.map(([maaned, liste]) => {
          const ud = liste.reduce(
            (a, t) => a + (t.beloebOere < 0 ? -t.beloebOere : 0),
            0,
          );
          const ind = liste.reduce(
            (a, t) => a + (t.beloebOere > 0 ? t.beloebOere : 0),
            0,
          );
          return (
            <div key={maaned} className="regnskab-maaned">
              <div className="regnskab-maaned-hoved">
                <strong>
                  {MD_NAVNE[Number(maaned.slice(5, 7)) - 1]} {maaned.slice(0, 4)}
                </strong>
                <span className="hud-meta">
                  ind {kr(ind)} · ud {kr(ud)}
                </span>
              </div>
              <ul className="regnskab-posteringsliste">
                {liste.map((t) => {
                  const k = findKategori(t.kategori);
                  return (
                    <li key={t.id} className={t.afklaret ? "" : "uafklaret"}>
                      <span className="regnskab-post-emoji" aria-hidden="true">
                        {k?.emoji ?? "❔"}
                      </span>
                      <span className="regnskab-post-tekst">
                        <strong>{t.tekst}</strong>
                        <span className="hud-meta">
                          {t.dato}
                          {k ? ` · ${k.navn}` : " · ukategoriseret"}
                          {t.konto === "firma" && t.momsType && (
                            <>
                              {" · "}
                              {MOMS_KORT[t.momsType]}
                              {(t.momsOere ?? 0) > 0 &&
                                ` (${kr(t.momsOere ?? 0)})`}
                            </>
                          )}
                          {t.konto === "firma" &&
                            t.beloebOere < 0 &&
                            t.fradragPct !== undefined &&
                            t.fradragPct !== 100 &&
                            ` · ${t.fradragPct} % fradrag`}
                          {t.bilagNr !== undefined && ` · bilag #${t.bilagNr}`}
                          {t.skatteRelevant && " · ★ skatterelevant"}
                          {t.laastAf && " · 🔒 indberettet"}
                          {t.note && ` · “${t.note}”`}
                        </span>
                      </span>
                      <span
                        className={`regnskab-post-beloeb${t.beloebOere >= 0 ? " plus" : ""}`}
                      >
                        {kr(t.beloebOere)}
                      </span>
                      {t.afklaret && !t.laastAf && (
                        <button
                          type="button"
                          className="admin-knap regnskab-miniknap"
                          onClick={() => genaabn(t.id)}
                          disabled={travltId === t.id}
                          title="Genåbn — lad Odin spørge igen"
                        >
                          ↺
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })
      )}
    </section>
  );
}
