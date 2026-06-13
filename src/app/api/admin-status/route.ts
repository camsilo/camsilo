/**
 * Lille status-endpoint: fortæller forsiden (statisk, klient-side) om den
 * nuværende browser er logget ind som admin — så vi kan vise en "tilbage til
 * admin"-genvej UDEN at gøre hele forsiden dynamisk. Returnerer kun en boolean;
 * den rigtige beskyttelse ligger fortsat på /admin og /api.
 */
import { erAdmin } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  return Response.json(
    { admin: await erAdmin() },
    { headers: { "Cache-Control": "no-store" } },
  );
}
