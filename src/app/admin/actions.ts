"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  brugernavnKorrekt,
  erAdmin,
  kodeordKorrekt,
  logAdminInd,
  logAdminUd,
} from "@/lib/admin-auth";
import { hentBesked, opdaterBesked, sletBesked } from "@/lib/messages/store";
import {
  hentMail,
  sendMail,
  tekstTilHtml,
  vaelgAfsender,
  type IndgaaendeMail,
} from "@/lib/poststack";

export async function adminLoginAction(formData: FormData): Promise<void> {
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
      html: tekstTilHtml(krop),
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
      html: tekstTilHtml(tekst),
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
