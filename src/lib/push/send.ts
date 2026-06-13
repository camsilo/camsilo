/**
 * Sender Web Push-notifikationer til admins abonnerede enheder (telefon m.m.).
 * Best-effort + fire-and-forget, rate-limitet (max 5/min — samme anti-spam-ånd
 * som Discord), og rydder døde abonnementer (404/410) væk.
 */
import webpush from "web-push";
import { hentAbonnementer, sletAbonnement } from "./store";

let konfigureret = false;

export function pushKonfigureret(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY,
  );
}

function konfig(): boolean {
  if (!pushKonfigureret()) return false;
  if (!konfigureret) {
    webpush.setVapidDetails(
      process.env.VAPID_SUBJECT ?? "mailto:kontakt@camsilo.dk",
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY as string,
      process.env.VAPID_PRIVATE_KEY as string,
    );
    konfigureret = true;
  }
  return true;
}

const VINDUE_MS = 60_000;
const MAKS_PR_MINUT = 5;
let vindueStart = 0;
let iVinduet = 0;

export function sendPush(titel: string, krop: string, url = "/admin"): void {
  if (!konfig()) return;

  const nu = Date.now();
  if (nu - vindueStart > VINDUE_MS) {
    vindueStart = nu;
    iVinduet = 0;
  }
  if (iVinduet >= MAKS_PR_MINUT) return;
  iVinduet++;

  void (async () => {
    const liste = await hentAbonnementer();
    const payload = JSON.stringify({ titel, krop, url });
    await Promise.all(
      liste.map(async (a) => {
        try {
          await webpush.sendNotification(
            { endpoint: a.endpoint, keys: a.keys },
            payload,
          );
        } catch (err) {
          const code = (err as { statusCode?: number })?.statusCode;
          if (code === 404 || code === 410) {
            await sletAbonnement(a.endpoint).catch(() => {});
          }
        }
      }),
    );
  })();
}
