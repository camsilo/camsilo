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
import { useRouter } from "next/navigation";

type StartdataKvittering = {
  fakturaerNye: number;
  fakturaerFandtes: number;
  posteringerIndsat: number;
  posteringerDubletter: number;
  kursdifferencer: number;
  advarsler: string[];
};

export function OdinStartdata() {
  const [travlt, setTravlt] = useState(false);
  const [fejl, setFejl] = useState("");
  const [kvit, setKvit] = useState<StartdataKvittering | null>(null);
  const filRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  /**
   * Sendes til en almindelig route frem for en server action.
   *
   * Server actions får et nyt id ved hver udrulning, så en fane, der har
   * stået åben hen over et deploy, fejler med "Failed to find Server Action"
   * — uden at ramme vores egen kode, så fejlen kan ikke fanges pænt. En route
   * har en fast URL og overlever udrulninger. Den slipper samtidig for
   * server actions' 1 MB-grænse på anmodningen.
   */
  async function indlaes() {
    const fil = filRef.current?.files?.[0];
    if (!fil) {
      setFejl("Vælg JSON-filen først.");
      return;
    }
    setTravlt(true);
    setFejl("");
    setKvit(null);
    try {
      const tekst = await fil.text();
      try {
        JSON.parse(tekst);
      } catch {
        setTravlt(false);
        setFejl("Filen er ikke gyldig JSON. Valgte du den rigtige fil?");
        return;
      }

      const r = await fetch("/admin/regnskab/import-data", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: tekst,
      });

      if (r.status === 401) {
        setTravlt(false);
        setFejl("Din session er udløbet. Log ind igen og prøv forfra.");
        return;
      }
      if (!r.ok) {
        const t = await r.text();
        setTravlt(false);
        setFejl(`Serveren svarede ${r.status}. ${t.slice(0, 200)}`);
        return;
      }

      const svar = (await r.json()) as {
        ok?: boolean;
        fejl?: string;
        kvittering?: {
          fakturaer: { nye: number; fandtes: number };
          transaktioner: { indsat: number; dubletter: number };
          kursdifferencer: number;
          advarsler: string[];
        };
      };
      setTravlt(false);
      if (!svar.ok || !svar.kvittering) {
        setFejl(svar.fejl ?? "Indlæsningen fejlede.");
        return;
      }
      const k = svar.kvittering;
      setKvit({
        fakturaerNye: k.fakturaer.nye,
        fakturaerFandtes: k.fakturaer.fandtes,
        posteringerIndsat: k.transaktioner.indsat,
        posteringerDubletter: k.transaktioner.dubletter,
        kursdifferencer: k.kursdifferencer,
        advarsler: k.advarsler,
      });
      if (filRef.current) filRef.current.value = "";
      // Hent siden igen, så de nye tal slår igennem i alle faner.
      router.refresh();
    } catch (e) {
      setTravlt(false);
      setFejl(
        "Filen kunne ikke sendes: " + (e instanceof Error ? e.message : "ukendt fejl"),
      );
    }
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
