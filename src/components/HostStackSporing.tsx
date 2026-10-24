"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * HostStacks cookieløse site analytics (24-10-2026). Intet gemmes på enheden,
 * IP-adressen gemmes ikke (kun land + et døgn-saltet besøgs-id hos HostStack),
 * så der kræves intet samtykke-banner — modsat GA4, som derfor står slukket.
 * Giver kanalen pr. besøg (organisk søgning, AI-assistenter, henvisninger …),
 * som den egne first-party-måling i /admin ikke kan se.
 *
 * Automatiske sidevisninger er slået fra, så /admin aldrig tælles — heller ikke
 * ved en klient-navigation dertil. Nøglen er offentlig af design (kan kun
 * TILFØJE hændelser til camsilo.dk).
 */
const SITE_KEY = process.env.NEXT_PUBLIC_HOSTSTACK_SITE_KEY || "site_5xnhosgg56zs2lafeh2oi45f";
const TAG = "https://hoststack.dev/t.js";
const KAMPAGNE = /^(utm_[a-z]+|gclid|gbraid|wbraid|msclkid|fbclid|ttclid|li_fat_id|twclid)$/i;

export function HostStackSporing() {
  const sti = usePathname();
  const senest = useRef<string | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (document.querySelector(`script[src="${TAG}"]`)) return;
    const s = document.createElement("script");
    s.src = TAG;
    s.defer = true;
    s.dataset.siteKey = SITE_KEY;
    s.dataset.autoPageview = "off";
    document.head.appendChild(s);
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!sti || sti.startsWith("/admin")) return;
    const ud = new URLSearchParams();
    for (const [k, v] of new URLSearchParams(location.search)) if (KAMPAGNE.test(k)) ud.append(k, v);
    const q = ud.toString();
    const fuld = q ? `${sti}?${q}` : sti;
    if (fuld === senest.current) return;
    let forsoeg = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const send = () => {
      const ps = (window as unknown as { psAnalytics?: { pageview: (p: string) => void } }).psAnalytics;
      if (ps) {
        senest.current = fuld;
        ps.pageview(fuld);
      } else if (forsoeg++ < 40) {
        timer = setTimeout(send, 250);
      }
    };
    send();
    return () => clearTimeout(timer);
  }, [sti]);

  return null;
}
