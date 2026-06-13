"use client";

import { useRef, useState } from "react";
import type { IndgaaendeMail } from "@/lib/poststack";
import { hentMailAction, sendMailAction } from "@/app/admin/actions";

type Props = {
  mails: IndgaaendeMail[];
  konfigureret: boolean;
  fejl?: string;
  mailAdresse: string;
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

export function AdminEmail({ mails, konfigureret, fejl, mailAdresse }: Props) {
  const [aaben, setAaben] = useState<string | null>(null);
  const [kroppe, setKroppe] = useState<Record<string, IndgaaendeMail | "henter" | null>>({});

  const [visSkriv, setVisSkriv] = useState(false);
  const [til, setTil] = useState("");
  const [emne, setEmne] = useState("");
  const [tekst, setTekst] = useState("");
  const [status, setStatus] = useState<SendStatus>("idle");
  const [sendFejl, setSendFejl] = useState("");
  const skrivRef = useRef<HTMLDivElement>(null);

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
    const r = await sendMailAction({ til, emne, tekst });
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
          (og evt. <code>POSTSTACK_FROM</code> / <code>MAIL_ADDRESS</code>) for at
          modtage og sende mails fra {mailAdresse}.
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
            <span className="hud-meta" style={{ marginLeft: 10 }}>
              fra {mailAdresse}
            </span>
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
              ✦ Sendt. Beskeden er på vej fra {mailAdresse}.
            </p>
          ) : (
            <div className="mail-skriv">
              <div className="kontakt-raekke">
                <label className="kontakt-felt">
                  <span>Til</span>
                  <input
                    type="email"
                    value={til}
                    onChange={(e) => setTil(e.target.value)}
                    placeholder="modtager@eksempel.dk"
                  />
                </label>
                <label className="kontakt-felt">
                  <span>Emne</span>
                  <input
                    type="text"
                    value={emne}
                    onChange={(e) => setEmne(e.target.value)}
                    placeholder="Emne"
                  />
                </label>
              </div>
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
          <span className="hud-meta">{mails.length} mails</span>
        </div>

        {fejl ? (
          <p className="admin-fejl">{fejl}</p>
        ) : mails.length === 0 ? (
          <p className="admin-tom">
            Ingen mails endnu. Når nogen skriver til {mailAdresse}, lander de her.
          </p>
        ) : (
          <ul className="besked-liste">
            {mails.map((m) => {
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
                        <p className="besked-tekst">
                          {brodtekst(krop ?? m)}
                        </p>
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
