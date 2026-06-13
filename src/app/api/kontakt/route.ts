/**
 * Modtager beskeder fra forsidens kontaktformular og gemmer dem i besked-lageret.
 * Misbrugs-værn: kræver application/json (CORS-preflight for cross-origin), loft
 * på body-størrelse FØR parse, per-IP + global rate-limit (IP udledes robust,
 * ikke fra den spoofbare venstre-XFF-hop), og en skjult honeypot mod bots.
 * Landekode læses fra hostens geo-header, aldrig IP.
 */
import { gemBesked } from "@/lib/messages/store";
import { klientIp } from "@/lib/klient-ip";

export const runtime = "nodejs";

const VINDUE_MS = 10 * 60_000;
const MAKS_PR_VINDUE = 5; // pr. klient-IP
const MAKS_GLOBALT = 120; // backstop på tværs af alle IP'er pr. vindue
const MAKS_KROP = 16 * 1024; // 16 KB — besked-cap er 5000 tegn, så rigeligt
const taeller = new Map<string, { n: number; start: number }>();
let globalt = { n: 0, start: 0 };

const GEO_HEADERE = [
  "cf-ipcountry",
  "x-vercel-ip-country",
  "x-geo-country",
  "x-country-code",
  "fastly-geo-country",
  "x-appengine-country",
];

function landekode(req: Request): string | undefined {
  for (const h of GEO_HEADERE) {
    const v = req.headers.get(h)?.trim().toUpperCase();
    if (v && /^[A-Z]{2}$/.test(v) && v !== "XX" && v !== "T1") return v;
  }
  return undefined;
}

function rateLimited(noegle: string): boolean {
  const nu = Date.now();
  const post = taeller.get(noegle);
  if (!post || nu - post.start > VINDUE_MS) {
    taeller.set(noegle, { n: 1, start: nu });
    return false;
  }
  post.n++;
  if (taeller.size > 10_000) taeller.clear();
  return post.n > MAKS_PR_VINDUE;
}

function globaltOverskredet(): boolean {
  const nu = Date.now();
  if (nu - globalt.start > VINDUE_MS) {
    globalt = { n: 1, start: nu };
    return false;
  }
  globalt.n++;
  return globalt.n > MAKS_GLOBALT;
}

// Forbyder mailto-betydende tegn (?, &, %, ,) ud over whitespace/dobbelt-@,
// så en gemt e-mail aldrig kan injicere ekstra felter i admins mailto-link.
const EMAIL_RE = /^[^\s@?&,%]+@[^\s@?&,%]+\.[^\s@?&,%]+$/;

function tekst(v: unknown, maks: number): string {
  return typeof v === "string" ? v.trim().slice(0, maks) : "";
}

/**
 * Valgfri notifikation: hvis KONTAKT_WEBHOOK_URL er sat, sendes en kopi af
 * beskeden dertil (Slack/Discord/Make/Zapier). Fire-and-forget med timeout —
 * må aldrig blokere eller vælte svaret til afsenderen.
 */
function notificer(b: {
  navn: string;
  email: string;
  emne?: string;
  besked: string;
  land?: string;
}): void {
  const url = process.env.KONTAKT_WEBHOOK_URL;
  if (!url) return;
  const linjer = [
    "📨 **Ny besked via camsilo.dk**",
    `Fra: ${b.navn} <${b.email}>`,
    b.emne ? `Emne: ${b.emne}` : null,
    b.land ? `Land: ${b.land}` : null,
    "",
    b.besked,
  ]
    .filter((l) => l !== null)
    .join("\n");
  // Provider-specifik form: Discord bruger `content`, Slack `text`; ellers begge + felter.
  let krop: string;
  if (/discord(app)?\.com\/api\/webhooks/i.test(url)) {
    krop = JSON.stringify({ username: "Camsilo", content: linjer.slice(0, 1900) });
  } else if (/hooks\.slack\.com/i.test(url)) {
    krop = JSON.stringify({ text: linjer });
  } else {
    krop = JSON.stringify({ text: linjer, content: linjer, ...b });
  }
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), 4000);
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: krop,
    signal: ac.signal,
  })
    .catch(() => {})
    .finally(() => clearTimeout(timer));
}

export async function POST(req: Request): Promise<Response> {
  // Kræv JSON → tvinger CORS-preflight for cross-origin browser-kald
  const ct = req.headers.get("content-type")?.toLowerCase() ?? "";
  if (!ct.includes("application/json")) {
    return Response.json({ ok: false, fejl: "format" }, { status: 415 });
  }

  // Rate-limit FØR body læses (per-IP + global backstop)
  const ip = klientIp(req);
  if (rateLimited(ip) || globaltOverskredet()) {
    return Response.json({ ok: false, fejl: "rate" }, { status: 429 });
  }

  // Loft på body-størrelse før parse (Content-Length + faktisk længde)
  const len = Number(req.headers.get("content-length"));
  if (Number.isFinite(len) && len > MAKS_KROP) {
    return Response.json({ ok: false, fejl: "for_stor" }, { status: 413 });
  }
  let raw: string;
  try {
    raw = await req.text();
  } catch {
    return Response.json({ ok: false, fejl: "format" }, { status: 400 });
  }
  if (raw.length > MAKS_KROP) {
    return Response.json({ ok: false, fejl: "for_stor" }, { status: 413 });
  }

  let krop: unknown;
  try {
    krop = JSON.parse(raw);
  } catch {
    return Response.json({ ok: false, fejl: "format" }, { status: 400 });
  }
  if (!krop || typeof krop !== "object") {
    return Response.json({ ok: false, fejl: "format" }, { status: 400 });
  }
  const o = krop as Record<string, unknown>;

  // Honeypot: et felt mennesker ikke ser. ENHVER ikke-tom rå værdi (også
  // whitespace) = bot. Lad som om det gik godt.
  if (typeof o.firma === "string" && o.firma.length > 0) {
    return Response.json({ ok: true });
  }

  const navn = tekst(o.navn, 120);
  const email = tekst(o.email, 200);
  const emne = tekst(o.emne, 160);
  const besked = tekst(o.besked, 5000);
  const sprog = o.sprog === "en" ? "en" : o.sprog === "da" ? "da" : undefined;

  if (navn.length < 1 || !EMAIL_RE.test(email) || besked.length < 1) {
    return Response.json({ ok: false, fejl: "ugyldig" }, { status: 400 });
  }

  const land = landekode(req);

  try {
    await gemBesked({ navn, email, emne: emne || undefined, besked, sprog, land });
  } catch (err) {
    console.error("[kontakt] kunne ikke gemme besked:", err);
    return Response.json({ ok: false, fejl: "server" }, { status: 500 });
  }

  notificer({ navn, email, emne: emne || undefined, besked, land });

  return Response.json({ ok: true });
}
