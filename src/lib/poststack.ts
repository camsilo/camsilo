/**
 * PostStack-klient (https://poststack.dev) — KUN server. Bruges af admin til at
 * modtage indgående e-mails (folk skriver til camsilo-adressen) og sende/svare
 * fra camsilo-mailen.
 *
 * Env:
 *   POSTSTACK_API_KEY  sk_live_… (påkrævet — uden den degraderer UI'et pænt)
 *   POSTSTACK_FROM     fx "Camsilo <kontakt@camsilo.dk>" (afsender)
 *   MAIL_ADDRESS       kontakt@camsilo.dk (domæne-filter + reply-to)
 *   POSTSTACK_API_URL  valgfri base-override (default https://api.poststack.dev)
 */

const BASE = process.env.POSTSTACK_API_URL ?? "https://api.poststack.dev";

export const MAIL_ADDRESS = process.env.MAIL_ADDRESS ?? "kontakt@camsilo.dk";
export const MAIL_DOMAIN = MAIL_ADDRESS.split("@")[1] ?? "camsilo.dk";

export function postStackKonfigureret(): boolean {
  return Boolean(process.env.POSTSTACK_API_KEY);
}

/** En afsender-adresse man kan skrive fra. */
export type Afsender = { navn: string; email: string; fuld: string };

// Adresser sættes via MAIL_ADDRESSES (komma-separeret "Navn <email>" eller "email").
const STANDARD_ADRESSER = "Camsilo <kontakt@camsilo.dk>,Casper Madsen <casper@camsilo.dk>";

function parseAfsender(s: string): Afsender {
  const m = s.match(/^\s*(.*?)\s*<([^>]+)>\s*$/);
  if (m) {
    const email = m[2].trim();
    return { navn: m[1].trim() || email, email, fuld: `${m[1].trim() || email} <${email}>` };
  }
  const email = s.trim();
  return { navn: email, email, fuld: email };
}

/** Alle afsender-adresser admin kan skrive/svare fra. */
export function mailAdresser(): Afsender[] {
  const raw = process.env.MAIL_ADDRESSES ?? process.env.POSTSTACK_FROM ?? STANDARD_ADRESSER;
  const liste = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map(parseAfsender);
  return liste.length ? liste : [parseAfsender(STANDARD_ADRESSER.split(",")[0])];
}

export function standardAfsender(): Afsender {
  return mailAdresser()[0];
}

/** Find en tilladt afsender ud fra e-mail (fallback til standard) — anti-spoofing. */
export function vaelgAfsender(email?: string): Afsender {
  const liste = mailAdresser();
  return liste.find((a) => a.email === email) ?? liste[0];
}

export type IndgaaendeMail = {
  id: string;
  fromAddress: string;
  toAddress: string;
  subject: string;
  htmlBody?: string | null;
  textBody?: string | null;
  spamScore?: number | null;
  spamVerdict?: string | null;
  createdAt?: string;
  receivedAt?: string;
};

export class PostStackFejl extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = "PostStackFejl";
  }
}

async function ps<T>(path: string, init?: RequestInit): Promise<T> {
  const key = process.env.POSTSTACK_API_KEY;
  if (!key) throw new PostStackFejl("POSTSTACK_API_KEY er ikke sat");

  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${key}`,
      "content-type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new PostStackFejl(
      `PostStack svarede ${res.status}: ${txt.slice(0, 300)}`,
      res.status,
    );
  }
  // Send-endpoint kan svare uden krop
  const tekst = await res.text().catch(() => "");
  return (tekst ? JSON.parse(tekst) : {}) as T;
}

/** Normalisér list-svar uanset om API'et svøber i data/emails/messages. */
function listeAf(raw: unknown): Record<string, unknown>[] {
  if (Array.isArray(raw)) return raw as Record<string, unknown>[];
  if (raw && typeof raw === "object") {
    const o = raw as Record<string, unknown>;
    for (const k of ["data", "emails", "messages", "inbound", "items"]) {
      if (Array.isArray(o[k])) return o[k] as Record<string, unknown>[];
    }
  }
  return [];
}

function tilMail(m: Record<string, unknown>): IndgaaendeMail {
  const s = (v: unknown) => (typeof v === "string" ? v : undefined);
  return {
    id: s(m.id) ?? s(m.publicId) ?? "",
    fromAddress: s(m.fromAddress) ?? s(m.from) ?? "(ukendt afsender)",
    toAddress: s(m.toAddress) ?? s(m.to) ?? "",
    subject: s(m.subject) ?? "(uden emne)",
    htmlBody: s(m.htmlBody) ?? null,
    textBody: s(m.textBody) ?? null,
    spamScore: typeof m.spamScore === "number" ? m.spamScore : null,
    spamVerdict: s(m.spamVerdict) ?? null,
    createdAt: s(m.createdAt) ?? s(m.receivedAt),
    receivedAt: s(m.receivedAt) ?? s(m.createdAt),
  };
}

export async function hentIndbakke(side = 1, prSide = 30): Promise<IndgaaendeMail[]> {
  const q = new URLSearchParams({
    domain: MAIL_DOMAIN,
    page: String(side),
    per_page: String(prSide),
  });
  const raw = await ps<unknown>(`/inbound?${q}`);
  return listeAf(raw).map(tilMail);
}

export async function hentMail(id: string): Promise<IndgaaendeMail> {
  const raw = await ps<unknown>(`/inbound/${encodeURIComponent(id)}`);
  const o = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const inderst =
    o.data && typeof o.data === "object"
      ? (o.data as Record<string, unknown>)
      : o.email && typeof o.email === "object"
        ? (o.email as Record<string, unknown>)
        : o;
  return tilMail(inderst);
}

/** Ren tekst → simpel, escaped HTML (afsnit + linjeskift). */
export function tekstTilHtml(tekst: string): string {
  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return tekst
    .split(/\n{2,}/)
    .map((afsnit) => `<p>${esc(afsnit).replace(/\n/g, "<br/>")}</p>`)
    .join("\n");
}

export async function sendMail(opts: {
  to: string;
  subject: string;
  html: string;
  /** fuld afsender "Navn <email>"; default = første tilladte adresse */
  from?: string;
}): Promise<void> {
  const afsender = opts.from ? parseAfsender(opts.from) : standardAfsender();
  await ps("/emails", {
    method: "POST",
    body: JSON.stringify({
      from: afsender.fuld,
      to: [opts.to],
      subject: opts.subject,
      html: opts.html,
      reply_to: afsender.email,
    }),
  });
}
