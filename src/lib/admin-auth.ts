/**
 * Admin-session: adgangskode (ADMIN_PASSWORD) → HMAC-signeret httpOnly-cookie.
 * Samme minimale mønster som Camsilo Mail — én kode, ingen brugere.
 */
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE = "ca_admin";
const TOKEN_VAERDI = "camsilo-admin-v1";

function secret(): string {
  const s = process.env.AUTH_SECRET;
  if (!s && process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SECRET mangler i produktion");
  }
  return s ?? "dev-secret-kun-lokalt";
}

function signer(v: string): string {
  return createHmac("sha256", secret()).update(v).digest("hex");
}

function sikkerSammenligning(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

export function kodeordKorrekt(input: string): boolean {
  const facit = process.env.ADMIN_PASSWORD;
  if (!facit) return false;
  return sikkerSammenligning(input, facit);
}

export async function erAdmin(): Promise<boolean> {
  const jar = await cookies();
  const c = jar.get(COOKIE)?.value;
  if (!c) return false;
  return sikkerSammenligning(c, signer(TOKEN_VAERDI));
}

export async function logAdminInd(): Promise<void> {
  const jar = await cookies();
  jar.set(COOKIE, signer(TOKEN_VAERDI), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
}

export async function logAdminUd(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE);
}
