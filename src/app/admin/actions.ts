"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import {
  brugernavnKorrekt,
  erAdmin,
  kodeordKorrekt,
  logAdminInd,
  logAdminUd,
} from "@/lib/admin-auth";
import { klientIp } from "@/lib/klient-ip";
import { hentBesked, opdaterBesked, sletBesked } from "@/lib/messages/store";
import {
  hentMail,
  sendMail,
  sletInbound,
  vaelgAfsender,
  type IndgaaendeMail,
} from "@/lib/poststack";
import {
  hentMailTilstande,
  saetMailTilstand,
} from "@/lib/mail/state";

// ── Brute-force-værn på login: per-IP + global backstop ───────
const LOGIN_VINDUE_MS = 15 * 60_000;
const LOGIN_MAKS = 8; // forsøg pr. IP pr. 15 min
const LOGIN_MAKS_GLOBALT = 40;
const loginTaeller = new Map<string, { n: number; start: number }>();
let loginGlobalt = { n: 0, start: 0 };

function loginBlokeret(ip: string): boolean {
  const nu = Date.now();
  if (nu - loginGlobalt.start > LOGIN_VINDUE_MS) loginGlobalt = { n: 0, start: nu };
  loginGlobalt.n++;
  if (loginGlobalt.n > LOGIN_MAKS_GLOBALT) return true;

  const p = loginTaeller.get(ip);
  if (!p || nu - p.start > LOGIN_VINDUE_MS) {
    loginTaeller.set(ip, { n: 1, start: nu });
    return false;
  }
  p.n++;
  if (loginTaeller.size > 5000) loginTaeller.clear();
  return p.n > LOGIN_MAKS;
}

export async function adminLoginAction(formData: FormData): Promise<void> {
  const ip = klientIp(await headers());
  if (loginBlokeret(ip)) {
    redirect("/admin?fejl=rate");
  }
  const brugernavn = String(formData.get("brugernavn") ?? "");
  const kode = String(formData.get("kode") ?? "");
  if (!brugernavnKorrekt(brugernavn) || !kodeordKorrekt(kode)) {
    redirect("/admin?fejl=kode");
  }
  await logAdminInd();
  redirect("/admin");
}

export async function adminLogoutAction(): Promise<void> {
  await logAdminUd();
  redirect("/admin");
}

// ── Kontaktbeskeder ───────────────────────────────────────────
// Bindes med besked-id (og evt. værdi) i admin-UI'et; alle bag admin-guard.

export async function saetLaestAction(id: string, laest: boolean): Promise<void> {
  if (!(await erAdmin())) return;
  await opdaterBesked(id, { laest });
  revalidatePath("/admin");
}

export async function saetArkivAction(id: string, arkiveret: boolean): Promise<void> {
  if (!(await erAdmin())) return;
  // Arkivering markerer også som læst, så den ikke tæller som ny.
  await opdaterBesked(id, arkiveret ? { arkiveret, laest: true } : { arkiveret });
  revalidatePath("/admin");
}

export async function sletBeskedAction(id: string): Promise<void> {
  if (!(await erAdmin())) return;
  await sletBesked(id);
  revalidatePath("/admin");
}

// ── Mail (PostStack) ──────────────────────────────────────────
// Kaldes imperativt fra klient-komponenter og returnerer et resultat, så
// UI'et kan vise pæn success/fejl uden mailto.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
type MailSvar = { ok: boolean; fejl?: string };

/** Svar på en kontaktbesked — sender en mail til afsenderens indtastede e-mail. */
export async function svarBeskedAction(
  id: string,
  tekst: string,
  fra?: string,
): Promise<MailSvar> {
  if (!(await erAdmin())) return { ok: false, fejl: "uautoriseret" };
  const krop = tekst.trim();
  if (!krop) return { ok: false, fejl: "tom" };

  const besked = await hentBesked(id);
  if (!besked) return { ok: false, fejl: "findes ikke" };
  if (!EMAIL_RE.test(besked.email)) return { ok: false, fejl: "ugyldig modtager" };

  const emne = besked.emne ? `Re: ${besked.emne}` : "Svar fra Camsilo";
  try {
    await sendMail({
      to: besked.email,
      subject: emne,
      tekst: krop,
      from: vaelgAfsender(fra).fuld,
    });
  } catch (err) {
    console.error("[mail] svar fejlede:", err);
    return { ok: false, fejl: "afsendelse fejlede" };
  }
  await opdaterBesked(id, { besvaret: true, svarTs: Date.now(), laest: true });
  revalidatePath("/admin");
  return { ok: true };
}

/** Send en fri mail (ny eller svar på indgående) fra en valgt camsilo-adresse. */
export async function sendMailAction(input: {
  til: string;
  emne: string;
  tekst: string;
  fra?: string;
}): Promise<MailSvar> {
  if (!(await erAdmin())) return { ok: false, fejl: "uautoriseret" };
  const til = input.til.trim();
  const emne = input.emne.trim();
  const tekst = input.tekst.trim();
  if (!EMAIL_RE.test(til)) return { ok: false, fejl: "ugyldig modtager" };
  if (!emne || !tekst) return { ok: false, fejl: "udfyld emne og besked" };

  try {
    await sendMail({
      to: til,
      subject: emne,
      tekst,
      from: vaelgAfsender(input.fra).fuld,
    });
  } catch (err) {
    console.error("[mail] afsendelse fejlede:", err);
    return { ok: false, fejl: "afsendelse fejlede" };
  }
  return { ok: true };
}

/** Hent fuld indgående mail (krop) til visning i admin. */
export async function hentMailAction(id: string): Promise<IndgaaendeMail | null> {
  if (!(await erAdmin())) return null;
  try {
    return await hentMail(id);
  } catch (err) {
    console.error("[mail] kunne ikke hente:", err);
    return null;
  }
}

// ── Indbakke-styring (lokalt overlay: læst/arkiv/slet) ────────

export async function mailLaestAction(id: string, laest: boolean): Promise<void> {
  if (!(await erAdmin())) return;
  await saetMailTilstand(id, { laest });
  revalidatePath("/admin");
}

export async function mailArkivAction(
  id: string,
  arkiveret: boolean,
): Promise<void> {
  if (!(await erAdmin())) return;
  await saetMailTilstand(id, arkiveret ? { arkiveret, laest: true } : { arkiveret });
  revalidatePath("/admin");
}

export async function mailSletAction(id: string): Promise<void> {
  if (!(await erAdmin())) return;
  await saetMailTilstand(id, { slettet: true });
  await sletInbound(id).catch(() => {}); // best-effort også i PostStack
  revalidatePath("/admin");
}

/** Markér læst når en mail åbnes (kun hvis ikke allerede læst). */
export async function mailAabnetAction(id: string): Promise<void> {
  if (!(await erAdmin())) return;
  const t = await hentMailTilstande();
  if (!t[id]?.laest) {
    await saetMailTilstand(id, { laest: true });
    revalidatePath("/admin");
  }
}
