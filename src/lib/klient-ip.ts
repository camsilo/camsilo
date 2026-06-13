/**
 * Best-effort klient-IP til rate-limiting. Den VENSTRE-mest værdi i
 * X-Forwarded-For er klient-leveret og kan forfalskes (send en frisk værdi pr.
 * request → uendelige buckets → rate-limit omgås). Derfor foretrækkes en
 * proxy-sat header (x-real-ip) eller den HØJRE-mest XFF-hop (tilføjet af edge-
 * proxyen). Mangler begge, returneres "global" — så manglende/forfalskede
 * headers falder ned i én delt bucket frem for at skabe ubegrænsede buckets.
 *
 * OBS: verificér HostStacks reelle klient-IP-header; den globale backstop-cap i
 * de enkelte routes beskytter uanset, hvis hop-antallet skulle være anderledes.
 */
export function klientIp(req: Request): string {
  const xri = req.headers.get("x-real-ip")?.trim();
  if (xri) return xri;
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const hops = xff
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (hops.length) return hops[hops.length - 1];
  }
  return "global";
}
