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
import { opdaterBesked, sletBesked } from "@/lib/messages/store";

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
