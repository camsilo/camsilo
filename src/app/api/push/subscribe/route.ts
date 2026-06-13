/**
 * Admin abonnerer/afmelder Web Push fra sin enhed. Bag admin-guard.
 * POST  = gem abonnement (+ send en bekræftelses-notifikation)
 * DELETE = fjern abonnement
 */
import { erAdmin } from "@/lib/admin-auth";
import { gemAbonnement, sletAbonnement } from "@/lib/push/store";
import { sendPush } from "@/lib/push/send";

export const runtime = "nodejs";

export async function POST(req: Request): Promise<Response> {
  if (!(await erAdmin())) return new Response(null, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response(null, { status: 400 });
  }
  const s = (body ?? {}) as {
    endpoint?: string;
    expirationTime?: number | null;
    keys?: { p256dh?: string; auth?: string };
  };
  if (!s.endpoint || !s.keys?.p256dh || !s.keys?.auth) {
    return new Response(null, { status: 400 });
  }

  await gemAbonnement({
    endpoint: s.endpoint,
    expirationTime: s.expirationTime ?? null,
    keys: { p256dh: s.keys.p256dh, auth: s.keys.auth },
  });

  // Send en bekræftelse, så admin straks ser at det virker
  sendPush("Camsilo · Odin", "Notifikationer er slået til ✅", "/admin");

  return Response.json({ ok: true });
}

export async function DELETE(req: Request): Promise<Response> {
  if (!(await erAdmin())) return new Response(null, { status: 401 });
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response(null, { status: 400 });
  }
  const endpoint = (body as { endpoint?: string })?.endpoint;
  if (typeof endpoint === "string") await sletAbonnement(endpoint);
  return Response.json({ ok: true });
}
