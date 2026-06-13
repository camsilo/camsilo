/**
 * Best-effort notifikation til en webhook (Discord/Slack/Make) — fire-and-forget
 * med timeout, så den ALDRIG blokerer eller vælter svaret. Sættes via
 * KONTAKT_WEBHOOK_URL. Bruges af både kontaktformularen og indgående e-mail.
 *
 * ANTI-SPAM: en hård grænse på antal pings pr. minut (på tværs af ALLE kilder),
 * så ingen kan oversvømme Discord ved at spamme formularen eller maile dig.
 * Overskydende pings droppes og tælles; antallet hænges på næste tilladte ping.
 */
const VINDUE_MS = 60_000;
const MAKS_PR_MINUT = 5; // højst 5 Discord-beskeder i minuttet
let vindueStart = 0;
let iVinduet = 0;
let undertrykt = 0;

export function notificerWebhook(titel: string, linjer: string[]): void {
  const url = process.env.KONTAKT_WEBHOOK_URL;
  if (!url) return;

  // Glidende minut-vindue
  const nu = Date.now();
  if (nu - vindueStart > VINDUE_MS) {
    vindueStart = nu;
    iVinduet = 0;
  }
  if (iVinduet >= MAKS_PR_MINUT) {
    undertrykt++;
    return; // beskeden er stadig gemt/modtaget — kun pinget droppes
  }
  iVinduet++;

  const dele = [titel, ...linjer].filter((l) => l !== null && l !== undefined && l !== "");
  if (undertrykt > 0) {
    dele.unshift(
      `⚠️ _${undertrykt} notifikation${undertrykt === 1 ? "" : "er"} undertrykt pga. høj aktivitet — tjek admin._`,
      "",
    );
    undertrykt = 0;
  }
  const indhold = dele.join("\n");

  let krop: string;
  if (/discord(app)?\.com\/api\/webhooks/i.test(url)) {
    krop = JSON.stringify({ username: "Camsilo", content: indhold.slice(0, 1900) });
  } else if (/hooks\.slack\.com/i.test(url)) {
    krop = JSON.stringify({ text: indhold });
  } else {
    krop = JSON.stringify({ text: indhold, content: indhold });
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
