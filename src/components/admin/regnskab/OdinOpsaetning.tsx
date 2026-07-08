"use client";

/**
 * Opsætningen — første gang som Odins onboarding (Alfaderen spørger dig
 * trin for trin), derefter som almindelig indstillings-side. Her bor også
 * Odins lærte regler (hans hukommelse om dine forretninger).
 */
import { useState } from "react";
import type { Indstillinger, Momsperiode, Regel, Virksomhedsform } from "@/lib/regnskab/typer";
import { findKategori } from "@/lib/regnskab/kategorier";
import {
  gemIndstillingerAction,
  sletLaertRegelAction,
} from "@/app/admin/regnskab/actions";

export function OdinOpsaetning({
  indstillinger,
  laerte,
}: {
  indstillinger: Indstillinger;
  laerte: Regel[];
}) {
  const [form, setForm] = useState<Indstillinger>(indstillinger);
  const [trin, setTrin] = useState(0);
  const [travlt, setTravlt] = useState(false);
  const [fejl, setFejl] = useState("");
  const [gemt, setGemt] = useState(false);
  const [glemFejl, setGlemFejl] = useState("");
  const [loenKr, setLoenKr] = useState(
    indstillinger.loenAarOere ? String(Math.round(indstillinger.loenAarOere / 100)) : "",
  );

  async function glemRegel(id: string) {
    if (travlt) return;
    setTravlt(true);
    setGlemFejl("");
    const r = await sletLaertRegelAction(id);
    setTravlt(false);
    if (!r.ok) setGlemFejl(r.fejl);
  }

  const onboarding = !indstillinger.onboardingFaerdig;

  function saet<K extends keyof Indstillinger>(felt: K, vaerdi: Indstillinger[K]) {
    setForm((f) => ({ ...f, [felt]: vaerdi }));
    setGemt(false);
  }

  async function gem(faerdig: boolean) {
    if (travlt) return;
    setTravlt(true);
    setFejl("");
    const loenOere = loenKr.trim()
      ? Math.round(Number(loenKr.replace(/[^\d]/g, "")) || 0) * 100
      : undefined;
    const r = await gemIndstillingerAction({
      ...form,
      ...(loenOere !== undefined ? { loenAarOere: loenOere } : {}),
      ...(faerdig ? { onboardingFaerdig: true } : {}),
    });
    setTravlt(false);
    if (!r.ok) {
      setFejl(r.fejl);
      return;
    }
    setGemt(true);
  }

  // ── Onboarding: Odin spørger trin for trin ────────────────────
  if (onboarding) {
    const TRIN_I_ALT = 4;
    return (
      <section className="hud-panel hud-panel-accent">
        <div className="hud-head">
          <span className="hud-label">
            <span className="hud-rune">ᚨ</span> Odin vågner · trin {trin + 1} af {TRIN_I_ALT}
          </span>
        </div>

        {trin === 0 && (
          <>
            <p className="regnskab-orakel">
              Vel mødt. Jeg er <strong>Odin</strong> — din bogholder, revisor og
              vagttårn i ét. Før jeg kan vogte dine bøger, må jeg kende din
              virksomhed. Fire spørgsmål, så er vi i gang.
            </p>
            <div className="regnskab-avanceret-felter">
              <label className="kontakt-felt">
                <span>Hvad hedder din virksomhed?</span>
                <input
                  type="text"
                  value={form.virksomhedsnavn}
                  onChange={(e) => saet("virksomhedsnavn", e.target.value)}
                />
              </label>
              <label className="kontakt-felt">
                <span>CVR-nummer (8 cifre — lad stå tomt hvis du ikke har et endnu)</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={form.cvr ?? ""}
                  onChange={(e) => saet("cvr", e.target.value.replace(/\D/g, "").slice(0, 8))}
                  placeholder="12345678"
                />
              </label>
              <div className="regnskab-bogvalg" role="group" aria-label="Virksomhedsform">
                {(
                  [
                    ["enkeltmandsvirksomhed", "👤 Enkeltmandsvirksomhed"],
                    ["aps", "🏢 ApS"],
                  ] as [Virksomhedsform, string][]
                ).map(([id, navn]) => (
                  <button
                    key={id}
                    type="button"
                    className={`regnskab-kategori${form.virksomhedsform === id ? " valgt" : ""}`}
                    onClick={() => saet("virksomhedsform", id)}
                  >
                    {navn}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {trin === 1 && (
          <>
            <p className="regnskab-orakel">
              Momsen. Er <strong>{form.virksomhedsnavn}</strong> momsregistreret?
              (Pligt når omsætningen når 50.000 kr. inden for 12 måneder — men
              mange registrerer sig fra dag ét for at kunne trække købsmoms fra.)
            </p>
            <div className="regnskab-bogvalg" role="group" aria-label="Momsregistreret">
              <button
                type="button"
                className={`regnskab-kategori${form.momsregistreret ? " valgt" : ""}`}
                onClick={() => saet("momsregistreret", true)}
              >
                ✓ Ja, momsregistreret
              </button>
              <button
                type="button"
                className={`regnskab-kategori${!form.momsregistreret ? " valgt" : ""}`}
                onClick={() => saet("momsregistreret", false)}
              >
                ✗ Nej, ikke endnu
              </button>
            </div>
            {form.momsregistreret && (
              <>
                <p className="regnskab-orakel">
                  Hvor tit afregner du moms? Nyregistrerede virksomheder sættes
                  altid på <strong>kvartalsvis</strong> afregning (typisk de
                  første ca. 1½ år) — derefter flytter Skat små virksomheder til
                  halvårlig. Det står i dit registreringsbevis på virk.dk.
                </p>
                <div className="regnskab-bogvalg" role="group" aria-label="Momsperiode">
                  {(
                    [
                      ["kvartal", "Kvartalsvist (standard for nye)"],
                      ["halvaar", "Halvårligt (små, efter ca. 1½ år)"],
                      ["maaned", "Månedligt (over 50 mio. kr.)"],
                    ] as [Momsperiode, string][]
                  ).map(([id, navn]) => (
                    <button
                      key={id}
                      type="button"
                      className={`regnskab-kategori${form.momsperiode === id ? " valgt" : ""}`}
                      onClick={() => saet("momsperiode", id)}
                    >
                      {navn}
                    </button>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {trin === 2 && (
          <>
            <p className="regnskab-orakel">
              Skatten. For at mine estimater rammer, må jeg kende din kommuneskat
              og din løn ved siden af virksomheden — overskuddet beskattes nemlig{" "}
              <em>oven på</em> lønnen.
            </p>
            <div className="regnskab-avanceret-felter">
              <label className="kontakt-felt">
                <span>Din kommunale skatteprocent (står på din forskudsopgørelse)</span>
                <input
                  type="number"
                  step="0.01"
                  min={15}
                  max={35}
                  value={form.kommuneskatPct ?? ""}
                  onChange={(e) =>
                    saet(
                      "kommuneskatPct",
                      e.target.value === "" ? undefined : Number(e.target.value),
                    )
                  }
                />
              </label>
              <label className="kontakt-felt">
                <span>Forventet årsløn før skat fra dit lønjob (kr. — cirka er fint)</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={loenKr}
                  onChange={(e) => {
                    setLoenKr(e.target.value);
                    setGemt(false);
                  }}
                  placeholder="fx 420000"
                />
              </label>
              <label className="regnskab-tjek">
                <input
                  type="checkbox"
                  checked={form.kirkeskat ?? false}
                  onChange={(e) => saet("kirkeskat", e.target.checked)}
                />
                Jeg betaler kirkeskat
              </label>
              <label className="regnskab-tjek">
                <input
                  type="checkbox"
                  checked={form.betalerBSkat ?? false}
                  onChange={(e) => saet("betalerBSkat", e.target.checked)}
                />
                Jeg betaler B-skat-rater i øjeblikket (overskud sat på forskudsopgørelsen)
              </label>
            </div>
          </>
        )}

        {trin === 3 && (
          <>
            <p className="regnskab-orakel">
              Sidste spørgsmål: hvilket år er dit <strong>første regnskabsår</strong>{" "}
              i mine bøger? Momsperioder og frister regnes fra det år.
            </p>
            <div className="regnskab-avanceret-felter">
              <label className="kontakt-felt">
                <span>Første regnskabsår</span>
                <input
                  type="number"
                  min={2020}
                  max={2100}
                  value={form.foersteAar}
                  onChange={(e) => saet("foersteAar", Number(e.target.value))}
                />
              </label>
            </div>
            <p className="regnskab-odin-note">
              ᚱ Så er vi klar. Når du trykker, åbner jeg bøgerne — importér
              derefter dine kontoudtog, så tager jeg dig gennem resten,
              postering for postering.
            </p>
          </>
        )}

        {fejl && <p className="admin-fejl">{fejl}</p>}

        <div className="besked-handlinger">
          {trin > 0 && (
            <button type="button" className="admin-knap" onClick={() => setTrin(trin - 1)}>
              ← Tilbage
            </button>
          )}
          {trin < TRIN_I_ALT - 1 ? (
            <button
              type="button"
              className="admin-knap admin-knap-primaer"
              onClick={() => setTrin(trin + 1)}
            >
              Videre →
            </button>
          ) : (
            <button
              type="button"
              className="admin-knap admin-knap-primaer"
              onClick={() => gem(true)}
              disabled={travlt}
            >
              {travlt ? "Åbner bøgerne …" : "Åbn bøgerne ᚠ"}
            </button>
          )}
        </div>
      </section>
    );
  }

  // ── Almindelig indstillings-side ──────────────────────────────
  return (
    <>
      <section className="hud-panel">
        <div className="hud-head">
          <span className="hud-label">
            <span className="hud-rune">ᛟ</span> Virksomhed & skat
          </span>
          {gemt && <span className="hud-meta">✓ gemt</span>}
        </div>
        <div className="regnskab-avanceret-felter">
          <label className="kontakt-felt">
            <span>Virksomhedsnavn</span>
            <input
              type="text"
              value={form.virksomhedsnavn}
              onChange={(e) => saet("virksomhedsnavn", e.target.value)}
            />
          </label>
          <label className="kontakt-felt">
            <span>CVR-nummer</span>
            <input
              type="text"
              inputMode="numeric"
              value={form.cvr ?? ""}
              onChange={(e) => saet("cvr", e.target.value.replace(/\D/g, "").slice(0, 8))}
            />
          </label>
          <label className="kontakt-felt">
            <span>Virksomhedsform</span>
            <select
              value={form.virksomhedsform}
              onChange={(e) => saet("virksomhedsform", e.target.value as Virksomhedsform)}
            >
              <option value="enkeltmandsvirksomhed">Enkeltmandsvirksomhed</option>
              <option value="aps">ApS</option>
            </select>
          </label>
          <label className="regnskab-tjek">
            <input
              type="checkbox"
              checked={form.momsregistreret}
              onChange={(e) => saet("momsregistreret", e.target.checked)}
            />
            Momsregistreret
          </label>
          <label className="kontakt-felt">
            <span>Momsafregning</span>
            <select
              value={form.momsperiode}
              onChange={(e) => saet("momsperiode", e.target.value as Momsperiode)}
            >
              <option value="halvaar">Halvårlig</option>
              <option value="kvartal">Kvartalsvis</option>
              <option value="maaned">Månedlig</option>
            </select>
          </label>
          <label className="kontakt-felt">
            <span>Første regnskabsår</span>
            <input
              type="number"
              min={2020}
              max={2100}
              value={form.foersteAar}
              onChange={(e) => saet("foersteAar", Number(e.target.value))}
            />
          </label>
          <label className="kontakt-felt">
            <span>Kommuneskat (%)</span>
            <input
              type="number"
              step="0.01"
              min={15}
              max={35}
              value={form.kommuneskatPct ?? ""}
              onChange={(e) =>
                saet(
                  "kommuneskatPct",
                  e.target.value === "" ? undefined : Number(e.target.value),
                )
              }
            />
          </label>
          <label className="kontakt-felt">
            <span>Forventet årsløn fra lønjob (kr.)</span>
            <input
              type="text"
              inputMode="numeric"
              value={loenKr}
              onChange={(e) => {
                setLoenKr(e.target.value);
                setGemt(false);
              }}
            />
          </label>
          <label className="regnskab-tjek">
            <input
              type="checkbox"
              checked={form.kirkeskat ?? false}
              onChange={(e) => saet("kirkeskat", e.target.checked)}
            />
            Kirkeskat
          </label>
          <label className="regnskab-tjek">
            <input
              type="checkbox"
              checked={form.betalerBSkat ?? false}
              onChange={(e) => saet("betalerBSkat", e.target.checked)}
            />
            Betaler B-skat-rater (viser B-skat-frister i vagttårnet)
          </label>
        </div>
        {fejl && <p className="admin-fejl">{fejl}</p>}
        <div className="besked-handlinger">
          <button
            type="button"
            className="admin-knap admin-knap-primaer"
            onClick={() => gem(false)}
            disabled={travlt}
          >
            {travlt ? "Gemmer …" : "Gem indstillinger"}
          </button>
        </div>
      </section>

      <section className="hud-panel">
        <div className="hud-head">
          <span className="hud-label">
            <span className="hud-rune">ᛗ</span> Odins hukommelse — lærte regler
          </span>
          <span className="hud-meta">{laerte.length} regler</span>
        </div>
        {glemFejl && <p className="admin-fejl">{glemFejl}</p>}
        {laerte.length === 0 ? (
          <p className="admin-tom">
            Ingen lærte regler endnu. Når du svarer Odin med „husk mit svar”,
            lander reglerne her.
          </p>
        ) : (
          <ul className="regnskab-posteringsliste">
            {laerte
              .slice()
              .sort((a, b) => b.ts - a.ts)
              .map((r) => {
                const k = findKategori(r.kategori);
                return (
                  <li key={r.id}>
                    <span className="regnskab-post-emoji" aria-hidden="true">
                      {k?.emoji ?? "❔"}
                    </span>
                    <span className="regnskab-post-tekst">
                      <strong>„{r.moenster}”</strong>
                      <span className="hud-meta">
                        → {k?.navn ?? r.kategori} ·{" "}
                        {r.konto === "firma" ? "firma-bogen" : "privat-bogen"}
                        {r.momsType ? ` · ${r.momsType}` : ""}
                        {r.fradragPct !== undefined ? ` · ${r.fradragPct} % fradrag` : ""}
                      </span>
                    </span>
                    <button
                      type="button"
                      className="admin-knap admin-knap-fare regnskab-miniknap"
                      onClick={() => glemRegel(r.id)}
                      disabled={travlt}
                      title="Glem reglen"
                    >
                      Glem
                    </button>
                  </li>
                );
              })}
          </ul>
        )}
      </section>
    </>
  );
}
