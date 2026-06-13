"use client";

import { useMemo, useState } from "react";
import type { Besked } from "@/lib/messages/store";
import {
  saetArkivAction,
  saetLaestAction,
  sletBeskedAction,
  svarBeskedAction,
} from "@/app/admin/actions";

type SvarStatus = "idle" | "sender" | "ok" | "fejl";

type Filter = "nye" | "alle" | "arkiv";

const fmtDato = new Intl.DateTimeFormat("da-DK", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Copenhagen",
});

function flag(land?: string): string {
  if (!land || land.length !== 2) return "";
  const A = 0x1f1e6;
  return String.fromCodePoint(
    A + (land.toUpperCase().charCodeAt(0) - 65),
    A + (land.toUpperCase().charCodeAt(1) - 65),
  );
}

export function AdminBeskeder({ beskeder }: { beskeder: Besked[] }) {
  const [filter, setFilter] = useState<Filter>("nye");
  const [aaben, setAaben] = useState<string | null>(null);
  const [svarId, setSvarId] = useState<string | null>(null);
  const [svarTekst, setSvarTekst] = useState("");
  const [svarStatus, setSvarStatus] = useState<SvarStatus>("idle");
  const [svarFejl, setSvarFejl] = useState("");

  function aabnSvar(b: Besked) {
    setSvarId(b.id);
    setSvarTekst("");
    setSvarStatus("idle");
    setSvarFejl("");
  }

  async function sendSvar(id: string) {
    if (svarStatus === "sender" || !svarTekst.trim()) return;
    setSvarStatus("sender");
    setSvarFejl("");
    const r = await svarBeskedAction(id, svarTekst);
    if (r.ok) {
      setSvarStatus("ok");
    } else {
      setSvarStatus("fejl");
      setSvarFejl(r.fejl ?? "Noget gik galt");
    }
  }

  const tal = useMemo(() => {
    const nye = beskeder.filter((b) => !b.arkiveret && !b.laest).length;
    const alle = beskeder.filter((b) => !b.arkiveret).length;
    const arkiv = beskeder.filter((b) => b.arkiveret).length;
    return { nye, alle, arkiv };
  }, [beskeder]);

  const liste = useMemo(() => {
    if (filter === "arkiv") return beskeder.filter((b) => b.arkiveret);
    if (filter === "nye") return beskeder.filter((b) => !b.arkiveret && !b.laest);
    return beskeder.filter((b) => !b.arkiveret);
  }, [beskeder, filter]);

  const faner: { id: Filter; navn: string; antal: number }[] = [
    { id: "nye", navn: "Nye", antal: tal.nye },
    { id: "alle", navn: "Indbakke", antal: tal.alle },
    { id: "arkiv", navn: "Arkiv", antal: tal.arkiv },
  ];

  return (
    <section className="admin-panel besked-panel">
      <div className="admin-panel-hoved">
        <h2>Beskeder</h2>
        <nav className="besked-faner" aria-label="Filtrér beskeder">
          {faner.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={f.id === filter}
              className={f.id === filter ? "aktiv" : ""}
              onClick={() => setFilter(f.id)}
            >
              {f.navn}
              <span className="besked-faner-antal">{f.antal}</span>
            </button>
          ))}
        </nav>
      </div>

      {liste.length === 0 ? (
        <p className="admin-tom">
          {filter === "nye"
            ? "Ingen nye beskeder — alt er læst. ✦"
            : filter === "arkiv"
              ? "Arkivet er tomt."
              : "Ingen beskeder endnu. De lander her, når nogen bruger formularen."}
        </p>
      ) : (
        <ul className="besked-liste">
          {liste.map((b) => {
            const er = aaben === b.id;
            // Kun adressen før et evt. ?/&/, og url-encodet → ingen mailto-injektion
            const adr = encodeURIComponent(b.email.split(/[?&,\s]/)[0]);
            const svar = `mailto:${adr}?subject=${encodeURIComponent(
              "Re: " + (b.emne || "Din besked til Camsilo"),
            )}`;
            return (
              <li
                key={b.id}
                className={`besked${b.laest ? "" : " besked-ulaest"}${er ? " besked-aaben" : ""}`}
              >
                <button
                  type="button"
                  className="besked-hoved"
                  onClick={() => setAaben(er ? null : b.id)}
                  aria-expanded={er}
                >
                  <span className="besked-prik" aria-hidden="true" />
                  <span className="besked-afsender">
                    <span className="besked-navn">{b.navn}</span>
                    <span className="besked-email">{b.email}</span>
                  </span>
                  <span className="besked-emne">
                    {b.emne || <em>(uden emne)</em>}
                    {!er && <span className="besked-preview"> — {b.besked}</span>}
                  </span>
                  <span className="besked-dato">
                    {flag(b.land) && <span aria-hidden="true">{flag(b.land)} </span>}
                    {fmtDato.format(new Date(b.ts))}
                  </span>
                </button>

                {er && (
                  <div className="besked-krop">
                    <p className="besked-tekst">{b.besked}</p>
                    <div className="besked-meta">
                      {b.besvaret && <span className="besked-besvaret">✓ Besvaret</span>}
                      {b.sprog && <span>Sprog: {b.sprog.toUpperCase()}</span>}
                      {b.land && <span>Land: {b.land}</span>}
                      <span>ID: {b.id.slice(0, 8)}</span>
                    </div>
                    <div className="besked-handlinger">
                      <button
                        type="button"
                        className="admin-knap admin-knap-primaer"
                        onClick={() => aabnSvar(b)}
                      >
                        Svar pr. mail
                      </button>
                      <form
                        action={saetLaestAction.bind(null, b.id, !b.laest)}
                        onSubmit={() => setAaben(null)}
                      >
                        <button className="admin-knap" type="submit">
                          {b.laest ? "Markér ulæst" : "Markér læst"}
                        </button>
                      </form>
                      <form
                        action={saetArkivAction.bind(null, b.id, !b.arkiveret)}
                        onSubmit={() => setAaben(null)}
                      >
                        <button className="admin-knap" type="submit">
                          {b.arkiveret ? "Gendan" : "Arkivér"}
                        </button>
                      </form>
                      <form
                        action={sletBeskedAction.bind(null, b.id)}
                        onSubmit={(e) => {
                          if (!confirm("Slet beskeden permanent?")) e.preventDefault();
                        }}
                      >
                        <button className="admin-knap admin-knap-fare" type="submit">
                          Slet
                        </button>
                      </form>
                    </div>

                    {svarId === b.id &&
                      (svarStatus === "ok" ? (
                        <p className="mail-ok" role="status">
                          ✦ Svar sendt til {b.email} fra din Camsilo-mail.
                        </p>
                      ) : (
                        <div className="besked-svar">
                          <label className="kontakt-felt">
                            <span>Svar til {b.email}</span>
                            <textarea
                              rows={5}
                              value={svarTekst}
                              onChange={(e) => setSvarTekst(e.target.value)}
                              placeholder={`Hej ${b.navn.split(" ")[0]} …`}
                              autoFocus
                            />
                          </label>
                          <div className="kontakt-bund">
                            <button
                              type="button"
                              className="btn-solid kontakt-send"
                              onClick={() => sendSvar(b.id)}
                              disabled={svarStatus === "sender"}
                            >
                              {svarStatus === "sender" ? "Sender …" : "Send svar"}
                            </button>
                            <a className="besked-mailto" href={svar}>
                              eller åbn i mailprogram
                            </a>
                            {svarStatus === "fejl" && (
                              <p className="kontakt-status kontakt-fejl" role="alert">
                                {svarFejl}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
