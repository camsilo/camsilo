/**
 * Next's opstarts-hook — her kun for HostStack error tracking (24-10-2026).
 *
 * Ubehandlede server-fejl sendes til HostStack, som grupperer dem i issues og
 * alarmerer ved nye og ved fejl der kommer igen efter «løst». Endpointet
 * (`HOSTSTACK_ERRORS_URL`, runtime-secret på servicen) bærer en skrive-nøgle til
 * denne ene service. Uden variablen sker der intet.
 *
 * Kontekst er rute-skabelon og metode — aldrig brugerdata. Rapportøren kaster
 * aldrig og venter ikke på netværket ud over en kort frist.
 */
export function register(): void {}

export async function onRequestError(
  err: unknown,
  request: { method?: string },
  kontekst?: { routePath?: string; routeType?: string },
): Promise<void> {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const url = process.env.HOSTSTACK_ERRORS_URL;
  if (!url || !url.startsWith("https://")) return;
  const e = err instanceof Error ? err : null;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        release: process.env.HOSTSTACK_RELEASE,
        platform: "node",
        events: [
          {
            type: (e?.name || "Error").slice(0, 200),
            value: String(e?.message ?? err ?? "").slice(0, 2000),
            stack: e?.stack?.slice(0, 16384),
            level: "error",
            context: {
              rute: kontekst?.routePath ?? "ukendt",
              type: kontekst?.routeType ?? "ukendt",
              metode: request?.method ?? "GET",
            },
          },
        ],
      }),
      signal: AbortSignal.timeout(3000),
    });
  } catch {
    /* Rapportøren må aldrig vælte det, den rapporterer for. */
  }
}
