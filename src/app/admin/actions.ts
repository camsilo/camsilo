"use server";

import { redirect } from "next/navigation";
import { kodeordKorrekt, logAdminInd, logAdminUd } from "@/lib/admin-auth";

export async function adminLoginAction(formData: FormData): Promise<void> {
  const kode = String(formData.get("kode") ?? "");
  if (!kodeordKorrekt(kode)) {
    redirect("/admin?fejl=kode");
  }
  await logAdminInd();
  redirect("/admin");
}

export async function adminLogoutAction(): Promise<void> {
  await logAdminUd();
  redirect("/admin");
}
