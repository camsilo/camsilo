/**
 * Admin-session: brugernavn + adgangskode → HMAC-signeret httpOnly-cookie.
 *
 * Cookie-token = "<iat>.<hmac(iat.epoke)>" — bundet til et issued-at, så det
 * UDLØBER af sig selv (MAKS_ALDER), og til en bumpbar ADMIN_SESSION_EPOCH, så
 * ALLE sessioner kan tvangs-tilbagekaldes uden at rotere AUTH_SECRET. Kan ikke
 * forfalskes/gættes uden AUTH_SECRET (HMAC-SHA256 + timing-sikker sammenligning).
 */
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE = "ca_admin";
const MAKS_ALDER_MS = 60 * 60 * 24 * 30 * 1000; // 30 dage — match maxAge

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

/** Konstant-tids streng-sammenligning (genbruges af inbound-webhooken). */
export function sikkerSammenligning(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

/** Bumpes via env for at tvangs-udlogge ALLE aktive admin-sessioner. */
function epoke(): string {
  return process.env.ADMIN_SESSION_EPOCH ?? "1";
}

function lavToken(): string {
  const iat = Date.now().toString();
  return `${iat}.${signer(`${iat}.${epoke()}`)}`;
}

function tokenGyldigt(c: string): boolean {
  const i = c.indexOf(".");
  if (i < 0) return false;
  const iat = c.slice(0, i);
  const sig = c.slice(i + 1);
  if (!/^\d+$/.test(iat)) return false;
  if (!sikkerSammenligning(sig, signer(`${iat}.${epoke()}`))) return false;
  const alder = Date.now() - Number(iat);
  return alder >= 0 && alder <= MAKS_ALDER_MS;
}

export function kodeordKorrekt(input: string): boolean {
  const facit = process.env.ADMIN_PASSWORD;
  if (!facit) return false;
  return sikkerSammenligning(input, facit);
}

/** Brugernavn er ikke hemmeligt — default "camsilo", kan overstyres via ADMIN_USERNAME. */
export function brugernavnKorrekt(input: string): boolean {
  const facit = process.env.ADMIN_USERNAME ?? "camsilo";
  return input.trim().toLowerCase() === facit.trim().toLowerCase();
}

export async function erAdmin(): Promise<boolean> {
  const jar = await cookies();
  const c = jar.get(COOKIE)?.value;
  if (!c) return false;
  return tokenGyldigt(c);
}

export async function logAdminInd(): Promise<void> {
  const jar = await cookies();
  jar.set(COOKIE, lavToken(), {
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
