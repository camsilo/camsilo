"use client";

/**
 * Indlæsning af startdata — engangsgrundstenen under regnskabet.
 *
 * Filen er bygget ud fra kontoudtog, fakturaer og Nationalbankens kurser og
 * indeholder personoplysninger. Den ligger derfor aldrig i repoet, men vælges
 * fra din egen maskine og sendes direkte hertil.
 *
 * Kan køres igen uden risiko: fakturaer dedupes på fakturanummer og
 * posteringer på fingeraftryk, så intet bliver lagt ind to gange.
 */
import { useRef, useState } from "react";
import {
  importerStartdataAction,
  type StartdataKvittering,
} from "@/app/admin/regnskab/actions";

export function OdinStartdata() {
  const [travlt, setTravlt] = useState(false);
  const [fejl, setFejl] = useState("");
  const [kvit, setKvit] = useState<StartdataKvittering | null>(null);
  const filRef = useRef<HTMLInputElement>(null);

  async function indlaes() {
    const fil = filRef.current?.files?.[0];
    if (!fil) {
      setFejl("Vælg JSON-filen først.");
      return;
    }
    setTravlt(true);
    setFejl("");
    setKvit(null);
    const fd = new FormData();
    fd.set("fil", fil);
    const svar = await importerStartdataAction(fd);
    setTravlt(false);
    if (!svar.ok) {
      setFejl(svar.fejl);
      return;
    }
    setKvit(svar.data!);
    if (filRef.current) filRef.current.value = "";
  }

  return (
    <section className="hud-panel">
      <div className="hud-head">
        <span className="hud-label">
          <span className="hud-rune">ᛟ</span> Startdata
        </span>
      </div>

      <p className="regnskab-orakel">
        Grundstenen under regnskabet: fakturaer, posteringer fra begge bøger,
        kursdifferencer og opsætning i én fil. Den er bygget ud fra dine
        kontoudtog og Nationalbankens kurser.
      </p>

      <div className="regnskab-import-felter">
        <label>
          JSON-fil med startdata
          <input ref={filRef} type="file" accept="application/json,.json" />
        </label>
        <div className="regnskab-frist-handling">
          <button type="button" onClick={indlaes} disabled={travlt}>
            {travlt ? "Indlæser …" : "Indlæs startdata"}
          </button>
        </div>
      </div>

      <p className="regnskab-anvisning">
        Du kan trygt trykke igen: fakturaer genkendes på fakturanummer og
        posteringer på et fingeraftryk, så intet lægges ind to gange. Posteringer,
        der er låst af en indberettet momsperiode, røres aldrig.
      </p>

      {fejl && (
        <div className="regnskab-advarsel">
          <p>{fejl}</p>
        </div>
      )}

      {kvit && (
        <div className="regnskab-import-kvittering">
          <h3>Lagt ind</h3>
          <ul>
            <li>
              <strong>{kvit.fakturaerNye}</strong> nye fakturaer
              {kvit.fakturaerFandtes > 0 &&
                ` · ${kvit.fakturaerFandtes} fandtes allerede`}
            </li>
            <li>
              <strong>{kvit.posteringerIndsat}</strong> posteringer
              {kvit.posteringerDubletter > 0 &&
                ` · ${kvit.posteringerDubletter} dubletter sprunget over`}
            </li>
            {kvit.kursdifferencer > 0 && (
              <li>
                <strong>{kvit.kursdifferencer}</strong> kursdifference
                {kvit.kursdifferencer === 1 ? "" : "r"} opgjort
              </li>
            )}
          </ul>
          {kvit.advarsler.length > 0 && (
            <div className="regnskab-advarsel">
              <p>
                <strong>Noget gik ikke igennem:</strong>
              </p>
              <p>{kvit.advarsler.join(" · ")}</p>
            </div>
          )}
          <p className="regnskab-anvisning">
            Gå til <strong>Moms</strong> og se 2. kvartal 2026 — salgsmomsen fra
            AMU SYD skulle nu stå der, og rubrik C skulle vise det engelske salg
            under 4. kvartal 2025.
          </p>
        </div>
      )}
    </section>
  );
}
