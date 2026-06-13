/**
 * Webhook fra PostStack ved indgående e-mail (event "email.inbound"). Sender en
 * notifikation til Discord/Slack, så admin får et ping når nogen skriver til en
 * camsilo-adresse. Selve mailen ligger i PostStacks indbakke (hentes i /admin).
 *
 * Beskyttet med en hemmelig token i URL'en (?token=…) mod INBOUND_WEBHOOK_TOKEN.
 */
import { notificerWebhook } from "@/lib/discord";

export const runtime = "nodejs";

function felt(o: Record<string, unknown>, ...navne: string[]): string | undefined {
  for (const n of navne) {
    const v = o[n];
    if (typeof v === "string" && v.trim()) return v;
  }
  return undefined;
}

export async function POST(req: Request): Promise<Response> {
  const token = new URL(req.url).searchParams.get("token");
  const facit = process.env.INBOUND_WEBHOOK_TOKEN;
  if (!facit || token !== facit) {
    return new Response(null, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response(null, { status: 400 });
  }

  const top = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
  // Payload kan være {type,data:{…}} / {event,email:{…}} / direkte mail-objekt
  const data =
    (top.data && typeof top.data === "object" ? top.data : null) ??
    (top.email && typeof top.email === "object" ? top.email : null) ??
    top;
  const m = data as Record<string, unknown>;

  // Reagér kun på indgående (hvis event-felt findes)
  const event = felt(top, "type", "event");
  if (event && event !== "email.inbound") {
    return new Response(null, { status: 204 });
  }

  // Spring spam over (PostStack vurderer indgående) — så ingen kan spamme Discord
  // ved at maile dig. Mailen ligger stadig i indbakken, men der pinges ikke.
  const spamVerdict = felt(m, "spamVerdict", "spam_verdict");
  const raaScore = (m.spamScore ?? m.spam_score) as unknown;
  const spamScore = typeof raaScore === "number" ? raaScore : null;
  if (spamVerdict === "spam" || (spamScore !== null && spamScore >= 5)) {
    return new Response(null, { status: 200 });
  }

  const fra = felt(m, "fromAddress", "from") ?? "(ukendt afsender)";
  const til = felt(m, "toAddress", "to") ?? "";
  const emne = felt(m, "subject") ?? "(uden emne)";
  const tekst = felt(m, "textBody", "text", "snippet", "preview") ?? "";

  notificerWebhook("📥 **Ny e-mail til Camsilo**", [
    `Fra: ${fra}`,
    til ? `Til: ${til}` : "",
    `Emne: ${emne}`,
    "",
    tekst.slice(0, 600),
    "",
    "→ Læs & svar i admin: camsilo.dk/admin?vis=email",
  ]);

  return new Response(null, { status: 200 });
}
