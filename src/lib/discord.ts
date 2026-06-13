/**
 * Best-effort notifikation til en webhook (Discord/Slack/Make) — fire-and-forget
 * med timeout, så den ALDRIG blokerer eller vælter svaret. Sættes via
 * KONTAKT_WEBHOOK_URL. Bruges af både kontaktformularen og indgående e-mail.
 */
export function notificerWebhook(titel: string, linjer: string[]): void {
  const url = process.env.KONTAKT_WEBHOOK_URL;
  if (!url) return;
  const indhold = [titel, ...linjer].filter((l) => l !== null && l !== undefined).join("\n");

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
