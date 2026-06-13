/**
 * Letvægts User-Agent-tolkning — udleder enhedstype, browser og styresystem
 * server-side fra UA-strengen (ingen afhængigheder, ingen IP, cookieløst).
 * Bevidst grovkornet: vi vil have brugbare dashboard-kategorier, ikke perfekt
 * fingerprinting.
 */

export type UaInfo = { enhed: string; browser: string; os: string };

export function tolkUa(ua: string | null): UaInfo {
  if (!ua) return { enhed: "Ukendt", browser: "Ukendt", os: "Ukendt" };
  const s = ua.toLowerCase();

  // ── Enhed ───────────────────────────────────────────────
  let enhed = "Computer";
  if (/ipad|tablet|playbook|silk|(android(?!.*mobile))/.test(s)) enhed = "Tablet";
  else if (/mobi|iphone|ipod|android.*mobile|windows phone|blackberry|bb10/.test(s))
    enhed = "Mobil";

  // ── Styresystem ─────────────────────────────────────────
  let os = "Ukendt";
  if (/windows nt/.test(s)) os = "Windows";
  else if (/iphone|ipad|ipod/.test(s)) os = "iOS";
  else if (/mac os x|macintosh/.test(s)) os = "macOS";
  else if (/android/.test(s)) os = "Android";
  else if (/cros/.test(s)) os = "ChromeOS";
  else if (/linux/.test(s)) os = "Linux";

  // ── Browser (rækkefølge er vigtig — Edge/Brave/Opera maskerer sig som Chrome) ──
  let browser = "Ukendt";
  if (/edg(e|a|ios)?\//.test(s)) browser = "Edge";
  else if (/opr\/|opera/.test(s)) browser = "Opera";
  else if (/samsungbrowser/.test(s)) browser = "Samsung Internet";
  else if (/firefox|fxios/.test(s)) browser = "Firefox";
  else if (/chrome|crios|chromium/.test(s)) browser = "Chrome";
  else if (/safari/.test(s)) browser = "Safari";

  return { enhed, browser, os };
}
