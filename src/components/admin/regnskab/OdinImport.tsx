"use client";

/**
 * Import-panelet — læg et CSV-kontoudtog fra netbanken på alteret, vælg
 * hvilken bog det hører til, og Odin æder det: encoding, separator og
 * kolonner detekteres automatisk, dubletter sorteres fra, og kendte
 * forretninger kategoriseres med det samme.
 */
import { useRef, useState } from "react";
import type { ImportLog, Konto } from "@/lib/regnskab/typer";
import {
  fortrydImportAction,
  importerKontoudtogAction,
  type ImportResultat,
} from "@/app/admin/regnskab/actions";

const fmtDato = new Intl.DateTimeFormat("da-DK", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Copenhagen",
});

export function OdinImport({ importLog }: { importLog: ImportLog[] }) {
  const [konto, setKonto] = useState<Konto>("firma");
  const [travlt, setTravlt] = useState(false);
  const [resultat, setResultat] = useState<ImportResultat | null>(null);
  const [fejl, setFejl] = useState("");
  const filRef = useRef<HTMLInputElement>(null);

  async function importer() {
    const fil = filRef.current?.files?.[0];
    if (!fil || travlt) return;
    setTravlt(true);
    setFejl("");
    setResultat(null);
    const fd = new FormData();
    fd.set("konto", konto);
    fd.set("fil", fil);
    const r = await importerKontoudtogAction(fd);
    setTravlt(false);
    if (!r.ok) {
      setFejl(r.fejl);
      return;
    }
    setResultat(r.data ?? null);
    if (filRef.current) filRef.current.value = "";
  }

  async function fortryd(importId: string) {
    if (!confirm("Fortryd importen og slet dens posteringer?")) return;
    setFejl("");
    const r = await fortrydImportAction(importId);
    if (!r.ok) {
      setFejl(r.fejl);
      return;
    }
    if (resultat?.importId === importId) setResultat(null);
  }

  return (
    <>
      <section className="hud-panel hud-panel-accent">
        <div className="hud-head">
          <span className="hud-label">
            <span className="hud-rune">ᛒ</span> Importér kontoudtog
          </span>
          <span className="hud-meta">CSV fra netbanken</span>
        </div>

        <p className="regnskab-orakel">
          Eksportér dine posteringer som CSV fra netbanken (Danske Bank, Nordea,
          Lunar, Revolut …) og læg filen her. Jeg finder selv kolonnerne, læser
          danske beløb og datoer, springer dubletter over — og genkender de
          forretninger, jeg allerede kender.
        </p>

        <div className="regnskab-import-felter">
          <div className="regnskab-bogvalg" role="group" aria-label="Vælg bog">
            <button
              type="button"
              className={`regnskab-kategori${konto === "firma" ? " valgt" : ""}`}
              onClick={() => setKonto("firma")}
            >
              🏢 Firma-bogen (Camsilo)
            </button>
            <button
              type="button"
              className={`regnskab-kategori${konto === "privat" ? " valgt" : ""}`}
              onClick={() => setKonto("privat")}
            >
              🏠 Privat-bogen (din egen konto)
            </button>
          </div>

          <input
            ref={filRef}
            type="file"
            accept=".csv,text/csv,text/plain"
            className="regnskab-filvalg"
            aria-label="CSV-fil med kontoudtog"
          />

          <button
            type="button"
            className="admin-knap admin-knap-primaer"
            onClick={importer}
            disabled={travlt}
          >
            {travlt ? "Læser runerne …" : "Importér til " + (konto === "firma" ? "firma-bogen" : "privat-bogen")}
          </button>
        </div>

        {fejl && <p className="admin-fejl">{fejl}</p>}

        {resultat && (
          <div className="regnskab-import-kvittering" role="status">
            <p>
              ᛗ <strong>{resultat.indsat}</strong> nye posteringer skrevet i bøgerne
              {resultat.dubletter > 0 && (
                <> · {resultat.dubletter} dubletter sprunget over</>
              )}
              {resultat.fejllinjer > 0 && (
                <> · {resultat.fejllinjer} ulæselige linjer</>
              )}
              {resultat.autoKategoriseret > 0 && (
                <>
                  {" "}· {resultat.autoKategoriseret} genkendt og kategoriseret
                </>
              )}
            </p>
            <p className="hud-meta">
              {resultat.fra} – {resultat.til} · {resultat.encoding} · separator&nbsp;„
              {resultat.separator}”
            </p>
            {resultat.indsat > 0 && (
              <p>
                <a href="/admin/regnskab?del=odin">
                  → Lad Odin spørge om det, han ikke kender
                </a>
              </p>
            )}
          </div>
        )}
      </section>

      <section className="hud-panel">
        <div className="hud-head">
          <span className="hud-label">
            <span className="hud-rune">ᛜ</span> Import-historik
          </span>
        </div>
        {importLog.length === 0 ? (
          <p className="admin-tom">Ingen importer endnu.</p>
        ) : (
          <ul className="regnskab-importlog">
            {importLog.map((l) => (
              <li key={l.id}>
                <span className="regnskab-post-emoji" aria-hidden="true">
                  {l.konto === "firma" ? "🏢" : "🏠"}
                </span>
                <span className="regnskab-post-tekst">
                  <strong>{l.filnavn}</strong>
                  <span className="hud-meta">
                    {fmtDato.format(new Date(l.ts))} · {l.nye} nye · {l.dubletter}{" "}
                    dubletter{l.fejllinjer > 0 ? ` · ${l.fejllinjer} fejl` : ""}
                    {l.fra ? ` · ${l.fra} – ${l.til}` : ""}
                  </span>
                </span>
                <button
                  type="button"
                  className="admin-knap admin-knap-fare"
                  onClick={() => fortryd(l.id)}
                >
                  Fortryd
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
