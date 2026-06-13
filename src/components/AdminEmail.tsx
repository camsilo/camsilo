"use client";

import { useMemo, useRef, useState } from "react";
import type { Afsender, IndgaaendeMail } from "@/lib/poststack";
import { hentMailAction, sendMailAction } from "@/app/admin/actions";

type Props = {
  mails: IndgaaendeMail[];
  konfigureret: boolean;
  fejl?: string;
  adresser: Afsender[];
};

const fmtDato = new Intl.DateTimeFormat("da-DK", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Copenhagen",
});

function datoTekst(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : fmtDato.format(d);
}

/** "Navn <a@b.dk>" → "a@b.dk". */
function bareEmail(s: string): string {
  const m = s.match(/<([^>]+)>/);
  return (m ? m[1] : s).trim();
}

/** Ren, sikker tekst af en mail — aldrig rå HTML (anti-XSS i admin). */
function brodtekst(m: IndgaaendeMail): string {
  if (m.textBody && m.textBody.trim()) return m.textBody;
  if (m.htmlBody) {
    return m.htmlBody
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/[ \t]+/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }
  return "(tom besked)";
}

type SendStatus = "idle" | "sender" | "ok" | "fejl";

export function AdminEmail({ mails, konfigureret, fejl, adresser }: Props) {
  const [aaben, setAaben] = useState<string | null>(null);
  const [kroppe, setKroppe] = useState<Record<string, IndgaaendeMail | "henter" | null>>({});

  const [visSkriv, setVisSkriv] = useState(false);
  const [fra, setFra] = useState(adresser[0]?.email ?? "");
  const [til, setTil] = useState("");
  const [emne, setEmne] = useState("");
  const [tekst, setTekst] = useState("");
  const [status, setStatus] = useState<SendStatus>("idle");
  const [sendFejl, setSendFejl] = useState("");
  const [postkasse, setPostkasse] = useState<string>("alle");
  const skrivRef = useRef<HTMLDivElement>(null);

  const synlige = useMemo(() => {
    if (postkasse === "alle") return mails;
    const p = postkasse.toLowerCase();
    return mails.filter((m) => (m.toAddress ?? "").toLowerCase().includes(p));
  }, [mails, postkasse]);

  async function aabnMail(m: IndgaaendeMail) {
    const er = aaben === m.id;
    setAaben(er ? null : m.id);
    if (!er && kroppe[m.id] === undefined) {
      setKroppe((k) => ({ ...k, [m.id]: "henter" }));
      const fuld = await hentMailAction(m.id);
      setKroppe((k) => ({ ...k, [m.id]: fuld ?? m }));
    }
  }

  function svarPaa(m: IndgaaendeMail) {
    setTil(bareEmail(m.fromAddress));
    setEmne(m.subject.startsWith("Re:") ? m.subject : `Re: ${m.subject}`);
    // svar fra den adresse mailen kom ind til, hvis vi kender den
    const modtog = adresser.find((a) => (m.toAddress ?? "").includes(a.email));
    if (modtog) setFra(modtog.email);
    setTekst("");
    setStatus("idle");
    setVisSkriv(true);
    requestAnimationFrame(() =>
      skrivRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }),
    );
  }

  async function send() {
    if (status === "sender") return;
    setStatus("sender");
    setSendFejl("");
    const r = await sendMailAction({ til, emne, tekst, fra });
    if (r.ok) {
      setStatus("ok");
      setTil("");
      setEmne("");
      setTekst("");
    } else {
      setStatus("fejl");
      setSendFejl(r.fejl ?? "Noget gik galt");
    }
  }

  const primaer = adresser[0]?.email ?? "kontakt@camsilo.dk";

  if (!konfigureret) {
    return (
      <section className="hud-panel">
        <div className="hud-head">
          <span className="hud-label">
            <span className="hud-rune">ᛗ</span> E-mail
          </span>
        </div>
        <p className="admin-tom">
          PostStack er ikke konfigureret endnu. Sæt <code>POSTSTACK_API_KEY</code>{" "}
          (og evt. <code>MAIL_ADDRESSES</code>) for at modtage og sende mails fra{" "}
          {primaer}.
        </p>
      </section>
    );
  }

  return (
    <div className="odin-stak">
      {/* Skriv / svar */}
      <section className="hud-panel" ref={skrivRef}>
        <div className="hud-head">
          <span className="hud-label">
            <span className="hud-rune">ᛗ</span> Skriv besked
          </span>
          <button
            type="button"
            className="admin-knap"
            onClick={() => setVisSkriv((v) => !v)}
          >
            {visSkriv ? "Skjul" : "Ny besked"}
          </button>
        </div>

        {visSkriv &&
          (status === "ok" ? (
            <p className="mail-ok" role="status">
              ✦ Sendt fra {fra}.
            </p>
          ) : (
            <div className="mail-skriv">
              <div className="kontakt-raekke">
                <label className="kontakt-felt">
                  <span>Fra</span>
                  <select value={fra} onChange={(e) => setFra(e.target.value)}>
                    {adresser.map((a) => (
                      <option key={a.email} value={a.email}>
                        {a.navn} · {a.email}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="kontakt-felt">
                  <span>Til</span>
                  <input
                    type="email"
                    value={til}
                    onChange={(e) => setTil(e.target.value)}
                    placeholder="modtager@eksempel.dk"
                  />
                </label>
              </div>
              <label className="kontakt-felt">
                <span>Emne</span>
                <input
                  type="text"
                  value={emne}
                  onChange={(e) => setEmne(e.target.value)}
                  placeholder="Emne"
                />
              </label>
              <label className="kontakt-felt">
                <span>Besked</span>
                <textarea
                  rows={6}
                  value={tekst}
                  onChange={(e) => setTekst(e.target.value)}
                  placeholder="Skriv din besked …"
                />
              </label>
              <div className="kontakt-bund">
                <button
                  type="button"
                  className="btn-solid kontakt-send"
                  onClick={send}
                  disabled={status === "sender"}
                >
                  {status === "sender" ? "Sender …" : "Send"}
                </button>
                {status === "fejl" && (
                  <p className="kontakt-status kontakt-fejl" role="alert">
                    {sendFejl}
                  </p>
                )}
              </div>
            </div>
          ))}
      </section>

      {/* Indbakke */}
      <section className="hud-panel besked-panel">
        <div className="hud-head">
          <span className="hud-label">
            <span className="hud-rune">ᛁ</span> Indbakke
          </span>
          {adresser.length > 1 && (
            <nav className="besked-faner" aria-label="Filtrér postkasse">
              <button
                type="button"
                className={postkasse === "alle" ? "aktiv" : ""}
                aria-pressed={postkasse === "alle"}
                onClick={() => setPostkasse("alle")}
              >
                Alle
              </button>
              {adresser.map((a) => (
                <button
                  key={a.email}
                  type="button"
                  className={postkasse === a.email ? "aktiv" : ""}
                  aria-pressed={postkasse === a.email}
                  onClick={() => setPostkasse(a.email)}
                >
                  {a.email.split("@")[0]}
                </button>
              ))}
            </nav>
          )}
        </div>

        {fejl ? (
          <p className="admin-fejl">{fejl}</p>
        ) : synlige.length === 0 ? (
          <p className="admin-tom">
            {mails.length === 0
              ? `Ingen mails endnu. Når nogen skriver til en camsilo-adresse, lander de her.`
              : "Ingen mails i denne postkasse."}
          </p>
        ) : (
          <ul className="besked-liste">
            {synlige.map((m) => {
              const er = aaben === m.id;
              const krop = kroppe[m.id];
              return (
                <li key={m.id} className={`besked${er ? " besked-aaben" : ""}`}>
                  <button
                    type="button"
                    className="besked-hoved"
                    onClick={() => aabnMail(m)}
                    aria-expanded={er}
                  >
                    <span className="besked-prik" aria-hidden="true" />
                    <span className="besked-afsender">
                      <span className="besked-navn">{m.fromAddress}</span>
                      <span className="besked-email">→ {m.toAddress}</span>
                    </span>
                    <span className="besked-emne">{m.subject}</span>
                    <span className="besked-dato">{datoTekst(m.receivedAt)}</span>
                  </button>
                  {er && (
                    <div className="besked-krop">
                      {krop === "henter" || krop === undefined ? (
                        <p className="admin-tom">Henter …</p>
                      ) : (
                        <p className="besked-tekst">{brodtekst(krop ?? m)}</p>
                      )}
                      <div className="besked-handlinger">
                        <button
                          type="button"
                          className="admin-knap admin-knap-primaer"
                          onClick={() => svarPaa(m)}
                        >
                          Svar
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
