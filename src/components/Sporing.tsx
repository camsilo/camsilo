"use client";

import { useEffect } from "react";

/**
 * First-party analytics-beacon. Cookieløs: sessions-id'et er et tilfældigt
 * uuid i sessionStorage (dør når fanen lukkes). Sender ét hit ved load og
 * en puls hvert 20. sekund mens fanen er synlig (driver "online nu" og
 * besøgstid i /admin).
 */
export function Sporing() {
  useEffect(() => {
    if (location.pathname.startsWith("/admin")) return;

    let sid = sessionStorage.getItem("ca_sid");
    if (!sid) {
      sid =
        typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      sessionStorage.setItem("ca_sid", sid);
    }

    const send = (t: "hit" | "ping") => {
      const data = JSON.stringify({
        t,
        s: sid,
        p: location.pathname,
        r: t === "hit" ? document.referrer : undefined,
        l: navigator.language,
      });
      const blob = new Blob([data], { type: "application/json" });
      if (!navigator.sendBeacon?.("/api/hit", blob)) {
        fetch("/api/hit", { method: "POST", body: data, keepalive: true }).catch(
          () => {},
        );
      }
    };

    send("hit");
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") send("ping");
    }, 20_000);
    const vedLuk = () => send("ping");
    addEventListener("pagehide", vedLuk);

    return () => {
      clearInterval(interval);
      removeEventListener("pagehide", vedLuk);
    };
  }, []);

  return null;
}
