"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { Dict, Lang } from "@/lib/i18n";

type Status = "idle" | "sender" | "ok" | "fejl" | "ugyldig";

const EMAIL_RE = /^[^\s@?&,%]+@[^\s@?&,%]+\.[^\s@?&,%]+$/;

export function KontaktForm({ t, lang }: { t: Dict; lang: Lang }) {
  const [navn, setNavn] = useState("");
  const [email, setEmail] = useState("");
  const [emne, setEmne] = useState("");
  const [besked, setBesked] = useState("");
  const [firma, setFirma] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [fejlFelter, setFejlFelter] = useState<Set<string>>(new Set());

  const navnRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const beskedRef = useRef<HTMLTextAreaElement>(null);
  const okRef = useRef<HTMLDivElement>(null);

  // Flyt fokus til kvitteringen efter succes (ellers falder fokus til <body>)
  useEffect(() => {
    if (status === "ok") okRef.current?.focus();
  }, [status]);

  function ryd(felt: string) {
    setFejlFelter((s) => {
      if (!s.has(felt)) return s;
      const n = new Set(s);
      n.delete(felt);
      return n;
    });
  }

  async function send(e: FormEvent) {
    e.preventDefault();
    if (status === "sender") return;

    const fejl = new Set<string>();
    if (!navn.trim()) fejl.add("navn");
    if (!EMAIL_RE.test(email.trim())) fejl.add("email");
    if (!besked.trim()) fejl.add("besked");
    if (fejl.size > 0) {
      setFejlFelter(fejl);
      setStatus("ugyldig");
      (fejl.has("navn") ? navnRef : fejl.has("email") ? emailRef : beskedRef).current?.focus();
      return;
    }
    setFejlFelter(new Set());

    setStatus("sender");
    try {
      const r = await fetch("/api/kontakt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ navn, email, emne, besked, firma, sprog: lang }),
      });
      if (r.ok) {
        setStatus("ok");
        setNavn("");
        setEmail("");
        setEmne("");
        setBesked("");
      } else {
        setStatus("fejl");
      }
    } catch {
      setStatus("fejl");
    }
  }

  if (status === "ok") {
    return (
      <div
        ref={okRef}
        tabIndex={-1}
        className="kontakt-kvittering reveal in"
        role="status"
      >
        <span className="kontakt-kvittering-rune" aria-hidden="true">
          ᚷ
        </span>
        <p>{t.formOk}</p>
        <a className="contact-mail" href="mailto:kontakt@camsilo.dk">
          {t.contactCta} <span aria-hidden="true">→</span>
        </a>
      </div>
    );
  }

  const beskrivFejl = (felt: string) =>
    fejlFelter.has(felt) ? "kontakt-fejl-besked" : undefined;

  return (
    <form className="kontakt-form reveal" onSubmit={send} noValidate>
      <div className="kontakt-raekke">
        <label className="kontakt-felt">
          <span>{t.formNavn}</span>
          <input
            ref={navnRef}
            type="text"
            name="navn"
            autoComplete="name"
            placeholder={t.formNavnPlaceholder}
            value={navn}
            onChange={(e) => {
              setNavn(e.target.value);
              ryd("navn");
            }}
            aria-invalid={fejlFelter.has("navn") || undefined}
            aria-describedby={beskrivFejl("navn")}
            maxLength={120}
            required
          />
        </label>
        <label className="kontakt-felt">
          <span>{t.formEmail}</span>
          <input
            ref={emailRef}
            type="email"
            name="email"
            autoComplete="email"
            placeholder={t.formEmailPlaceholder}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              ryd("email");
            }}
            aria-invalid={fejlFelter.has("email") || undefined}
            aria-describedby={beskrivFejl("email")}
            maxLength={200}
            required
          />
        </label>
      </div>

      <label className="kontakt-felt">
        <span>{t.formEmne}</span>
        <input
          type="text"
          name="emne"
          placeholder={t.formEmnePlaceholder}
          value={emne}
          onChange={(e) => setEmne(e.target.value)}
          maxLength={160}
        />
      </label>

      <label className="kontakt-felt">
        <span>{t.formBesked}</span>
        <textarea
          ref={beskedRef}
          name="besked"
          rows={5}
          placeholder={t.formBeskedPlaceholder}
          value={besked}
          onChange={(e) => {
            setBesked(e.target.value);
            ryd("besked");
          }}
          aria-invalid={fejlFelter.has("besked") || undefined}
          aria-describedby={beskrivFejl("besked")}
          maxLength={5000}
          required
        />
      </label>

      {/* Honeypot — skjult for mennesker, lokker bots */}
      <div className="kontakt-honeypot" aria-hidden="true">
        <label>
          Firma (lad stå tomt)
          <input
            type="text"
            name="firma"
            tabIndex={-1}
            autoComplete="off"
            value={firma}
            onChange={(e) => setFirma(e.target.value)}
          />
        </label>
      </div>

      <div className="kontakt-bund">
        <button
          className="btn-solid kontakt-send"
          type="submit"
          disabled={status === "sender"}
        >
          {status === "sender" ? t.formSender : t.formSend}
        </button>
        {status === "fejl" && (
          <p className="kontakt-status kontakt-fejl" role="alert">
            {t.formFejl}
          </p>
        )}
        {status === "ugyldig" && (
          <p
            id="kontakt-fejl-besked"
            className="kontakt-status kontakt-fejl"
            role="alert"
          >
            {t.formUgyldig}
          </p>
        )}
      </div>

      <p className="kontakt-direkte">
        {t.contactOrPre}
        <a href="mailto:kontakt@camsilo.dk">{t.contactCta}</a>
      </p>
    </form>
  );
}
