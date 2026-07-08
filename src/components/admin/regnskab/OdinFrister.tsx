"use client";

/**
 * Vagttårnet — alle frister med levende nedtælling. Den nærmeste frist får
 * et stort ur (dage : timer : minutter), resten står som liste i tidsorden.
 * Uret tikker i dansk tid; motoren bag ligger i lib/regnskab/frister.ts.
 */
import { useEffect, useState } from "react";
import type { Frist } from "@/lib/regnskab/frister";
import { dageTil } from "@/lib/regnskab/frister";

const KATEGORI_EMOJI: Record<Frist["kategori"], string> = {
  moms: "🏛️",
  "b-skat": "💸",
  oplysningsskema: "🧾",
  forskud: "🔮",
  aarsrapport: "📊",
};

const fmtDato = new Intl.DateTimeFormat("da-DK", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Europe/Copenhagen",
});

function pænDato(iso: string): string {
  return fmtDato.format(new Date(`${iso}T12:00:00Z`));
}

/** Millisekunder til midnat efter fristdagen i dansk tid (ca. — DST-tolerant). */
function msTilFrist(iso: string, nu: number): number {
  // Fristen udløber ved døgnets udgang dansk tid; +22:59 UTC dækker sommertid.
  return new Date(`${iso}T21:59:00Z`).getTime() - nu;
}

export function OdinFrister({ frister, idag }: { frister: Frist[]; idag: string }) {
  const [nu, setNu] = useState<number | null>(null);
  useEffect(() => {
    setNu(Date.now());
    const t = setInterval(() => setNu(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);

  const kommende = frister.filter((f) => !f.udfoert && dageTil(f.dato, idag) >= 0);
  const naeste = kommende[0];
  const resten = kommende.slice(1);
  const overstaaede = frister.filter(
    (f) => f.udfoert || dageTil(f.dato, idag) < 0,
  );

  return (
    <>
      {naeste ? (
        <section className="hud-panel hud-panel-accent">
          <div className="hud-head">
            <span className="hud-label">
              <span className="hud-rune">ᛉ</span> Næste pligt
            </span>
            <span className="hud-meta">{pænDato(naeste.dato)}</span>
          </div>
          <h2 className="regnskab-frist-titel">
            {KATEGORI_EMOJI[naeste.kategori]} {naeste.titel}
          </h2>
          {nu !== null && (
            <Nedtaelling ms={msTilFrist(naeste.dato, nu)} />
          )}
          <p className="regnskab-orakel">{naeste.beskrivelse}</p>
          <p className="regnskab-odin-note">ᚱ {naeste.handling}</p>
        </section>
      ) : (
        <section className="hud-panel">
          <p className="admin-tom">
            Ingen kommende frister i vagttårnets vindue. Freden råder — for nu.
          </p>
        </section>
      )}

      {resten.length > 0 && (
        <section className="hud-panel">
          <div className="hud-head">
            <span className="hud-label">
              <span className="hud-rune">ᛃ</span> Derefter
            </span>
          </div>
          <ul className="regnskab-fristliste">
            {resten.map((f) => {
              const d = dageTil(f.dato, idag);
              return (
                <li key={f.id}>
                  <span
                    className={`regnskab-frist-taeller${d <= 7 ? " haster" : d <= 30 ? " snart" : ""}`}
                  >
                    {d === 0 ? "I DAG" : `${d} dage`}
                  </span>
                  <span className="regnskab-frist-info">
                    <strong>
                      {KATEGORI_EMOJI[f.kategori]} {f.titel}
                    </strong>
                    <span className="hud-meta">
                      {pænDato(f.dato)} — {f.beskrivelse}
                    </span>
                    <span className="hud-meta regnskab-frist-handling">
                      ᚱ {f.handling}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {overstaaede.length > 0 && (
        <section className="hud-panel">
          <div className="hud-head">
            <span className="hud-label">
              <span className="hud-rune">ᛖ</span> Overståede & udførte
            </span>
          </div>
          <ul className="regnskab-fristliste daempet">
            {overstaaede.map((f) => (
              <li key={f.id}>
                <span className="regnskab-frist-taeller udfoert">
                  {f.udfoert ? "✓ udført" : "⚠ passeret"}
                </span>
                <span className="regnskab-frist-info">
                  <strong>
                    {KATEGORI_EMOJI[f.kategori]} {f.titel}
                  </strong>
                  <span className="hud-meta">{pænDato(f.dato)}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

function Nedtaelling({ ms }: { ms: number }) {
  if (ms <= 0) {
    return <p className="regnskab-nedtaelling haster">FRISTEN ER I DAG</p>;
  }
  const dage = Math.floor(ms / 86_400_000);
  const timer = Math.floor((ms % 86_400_000) / 3_600_000);
  const minutter = Math.floor((ms % 3_600_000) / 60_000);
  return (
    <p
      className={`regnskab-nedtaelling${dage <= 7 ? " haster" : dage <= 30 ? " snart" : ""}`}
      aria-label={`${dage} dage, ${timer} timer og ${minutter} minutter til fristen`}
    >
      <span>
        <strong>{dage}</strong> dage
      </span>
      <span className="regnskab-ned-sep">:</span>
      <span>
        <strong>{String(timer).padStart(2, "0")}</strong> timer
      </span>
      <span className="regnskab-ned-sep">:</span>
      <span>
        <strong>{String(minutter).padStart(2, "0")}</strong> min
      </span>
    </p>
  );
}
